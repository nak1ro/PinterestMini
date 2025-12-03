using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PinterestMini.API.Data;
using PinterestMini.API.Data.Seed;
using PinterestMini.API.Domain.Interfaces.Auth;
using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.Domain.Interfaces.Follow;
using PinterestMini.API.Domain.Interfaces.PinBoards;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Interfaces.Tags;
using PinterestMini.API.Domain.Interfaces.Users;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.Helpers;
using PinterestMini.API.Middlewares;
using PinterestMini.API.Repositories;
using PinterestMini.API.Services;

const string corsPolicyName = "AllowReactApp";
const string jwtSectionName = "JWT";

var builder = WebApplication.CreateBuilder(args);

ConfigureBuilder(builder);
ConfigureServices(builder);

var app = builder.Build();

ConfigureMiddleware(app);
await InitializeDatabaseAsync(app);

await app.RunAsync();

void ConfigureBuilder(WebApplicationBuilder webApplicationBuilder)
{
    webApplicationBuilder.Configuration.AddEnvironmentVariables();

    webApplicationBuilder.Logging.ClearProviders();
    webApplicationBuilder.Logging.AddConsole();

    webApplicationBuilder.WebHost.UseWebRoot("wwwroot");
}

void ConfigureServices(WebApplicationBuilder webApplicationBuilder)
{
    var configuration = webApplicationBuilder.Configuration;
    var services = webApplicationBuilder.Services;

    ConfigureDatabase(services, configuration);
    ConfigureIdentity(services);
    ConfigureJwtAuthentication(services, configuration);
    ConfigureCors(services, configuration);
    ConfigureApplicationServices(services);
    ConfigureValidation(services);
    ConfigureMvcAndSwagger(services);
}

void ConfigureDatabase(IServiceCollection services, IConfiguration configuration)
{
    var connectionString =
        configuration.GetConnectionString("DefaultConnection") ??
        configuration["DefaultConnection"] ??
        throw new InvalidOperationException("Connection string 'DefaultConnection' was not found.");

    services.AddDbContext<ApplicationDbContext>(options =>
        options.UseNpgsql(connectionString));
}

void ConfigureIdentity(IServiceCollection services)
{
    services
        .AddIdentity<User, IdentityRole<Guid>>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = true;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 6;
        })
        .AddEntityFrameworkStores<ApplicationDbContext>()
        .AddDefaultTokenProviders()
        .AddRoles<IdentityRole<Guid>>();
}

void ConfigureJwtAuthentication(IServiceCollection services, IConfiguration configuration)
{
    var jwtSection = configuration.GetSection(jwtSectionName);

    var jwtIssuer = GetRequiredConfigurationValue(jwtSection, "Issuer");
    var jwtAudience = GetRequiredConfigurationValue(jwtSection, "Audience");
    var jwtSigningKey = GetRequiredConfigurationValue(jwtSection, "SigningKey");

    services
        .AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = jwtIssuer,
                ValidateAudience = true,
                ValidAudience = jwtAudience,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSigningKey)),
                ValidateLifetime = true
            };
        });
}

void ConfigureCors(IServiceCollection services, IConfiguration configuration)
{
    var allowedOrigins = configuration["CORS:AllowedOrigins"]?
                             .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                         ?? Array.Empty<string>();

    services.AddCors(options =>
    {
        options.AddPolicy(corsPolicyName, policy =>
        {
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
    });
}

void ConfigureApplicationServices(IServiceCollection services)
{
    services.AddScoped<IAuthService, AuthService>();
    services.AddScoped<ITokenService, TokenService>();
    services.AddScoped<IPinRepository, PinRepository>();
    services.AddScoped<IPinService, PinService>();
    services.AddScoped<ITagRepository, TagRepository>();
    services.AddScoped<ITagService, TagService>();
    services.AddScoped<IBoardRepository, BoardRepository>();
    services.AddScoped<IBoardService, BoardService>();
    services.AddScoped<ICommentRepository, CommentRepository>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<ICommentService, CommentService>();
    services.AddScoped<IPinBoardRepository, PinBoardRepository>();
    services.AddScoped<IFollowService, FollowService>();
    services.AddScoped<IFollowRepository, FollowRepository>();
    services.AddScoped<IUserContextService, UserContextService>();
    services.AddScoped<IUnitOfWork, UnitOfWork>();

    services.AddSingleton<IBlobService, S3BlobService>();

    services.AddScoped<ImageUploader>();
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
}

void ConfigureValidation(IServiceCollection services)
{
    services.AddValidatorsFromAssemblyContaining<Program>();
    services.AddFluentValidationAutoValidation();
    services.AddFluentValidationClientsideAdapters();
}

void ConfigureMvcAndSwagger(IServiceCollection services)
{
    services.AddAuthorization();
    services.AddEndpointsApiExplorer();
    services.AddControllers();

    services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "PinterestMini API",
            Version = "v1"
        });

        var jwtSecurityScheme = new OpenApiSecurityScheme
        {
            Scheme = "bearer",
            BearerFormat = "JWT",
            Name = "Authorization",
            In = ParameterLocation.Header,
            Type = SecuritySchemeType.Http,
            Reference = new OpenApiReference
            {
                Id = "Bearer",
                Type = ReferenceType.SecurityScheme
            }
        };

        c.AddSecurityDefinition("Bearer", jwtSecurityScheme);
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            { jwtSecurityScheme, Array.Empty<string>() }
        });
    });
}

void ConfigureMiddleware(WebApplication webApplication)
{
    webApplication.UseStaticFiles();
    webApplication.UseMiddleware<ExceptionHandlingMiddleware>();
    webApplication.UseHttpsRedirection();
    webApplication.UseCors(corsPolicyName);
    webApplication.UseAuthentication();
    webApplication.UseAuthorization();

    if (webApplication.Environment.IsDevelopment())
    {
        webApplication.UseSwagger();
        webApplication.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "PinterestMini API v1");
            c.RoutePrefix = "swagger";
        });
    }

    webApplication.MapControllers();
}

async Task InitializeDatabaseAsync(WebApplication webApplication)
{
    using var scope = webApplication.Services.CreateScope();

    var serviceProvider = scope.ServiceProvider;
    var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
    var logger = serviceProvider
        .GetRequiredService<ILoggerFactory>()
        .CreateLogger("StartupDiagnostics");

    try
    {
        var conn = context.Database.GetDbConnection();
        await conn.OpenAsync();

        await using var cmd = conn.CreateCommand();
        cmd.CommandText =
            """
            SELECT 
                current_user        AS login_name,
                current_user        AS db_user_name,
                current_database()  AS db_name,
                has_database_privilege(current_user, current_database(), 'CREATE') AS can_create_table
            """;

        await using var reader = await cmd.ExecuteReaderAsync();
        if (await reader.ReadAsync())
        {
            logger.LogInformation(
                "PostgreSQL identity check → login_name={login} db_user_name={user} db={db} can_create_table={perm}",
                reader["login_name"],
                reader["db_user_name"],
                reader["db_name"],
                reader["can_create_table"]);
        }
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed probing PostgreSQL identity/permissions");
    }

    await context.Database.MigrateAsync();
    await RoleSeeder.SeedAsync(serviceProvider);
}

string GetRequiredConfigurationValue(IConfiguration configuration, string key)
{
    return configuration[key] ??
           throw new InvalidOperationException($"Configuration value '{key}' is not configured.");
}