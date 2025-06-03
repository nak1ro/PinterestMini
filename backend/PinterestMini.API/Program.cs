using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PinterestMini.API.Data;
using PinterestMini.API.Data.Seed;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Models;
using PinterestMini.API.Services;
using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using PinterestMini.API.Extensions;
using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Interfaces.Comments;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Interfaces.Tags;
using PinterestMini.API.Middlewares;
using PinterestMini.API.Repositories;
using PinterestMini.API.Services.Pins;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseWebRoot("wwwroot");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<User, IdentityRole<Guid>>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders()
.AddRoles<IdentityRole<Guid>>(); 

builder.Services.ConfigureCors();

var jwtSection = builder.Configuration.GetSection("JWT");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSection["Issuer"],

        ValidateAudience = true,
        ValidAudience = jwtSection["Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSection["SigningKey"])),

        ValidateLifetime = true
    };
});

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPinRepository, PinRepository>();
builder.Services.AddScoped<IPinService, PinService>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IBoardRepository, BoardRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddAuthorization();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddControllers();

var app = builder.Build();

app.UseStaticFiles(); 

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication(); 
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var serviceProvider = scope.ServiceProvider;
    await RoleSeeder.SeedAsync(serviceProvider);
}

app.Run();
