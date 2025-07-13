using System.Net;
using System.Text.Json;

namespace PinterestMini.API.Middlewares;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context); // Continue the request pipeline
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = ex switch
            {
                UnauthorizedAccessException => (int)HttpStatusCode.Unauthorized,
                KeyNotFoundException => (int)HttpStatusCode.NotFound,
                InvalidOperationException => (int)HttpStatusCode.BadRequest,
                AppUnauthorizedException => (int)HttpStatusCode.Unauthorized,
                AppNotFoundException => (int)HttpStatusCode.NotFound,
                AppBadRequestException => (int)HttpStatusCode.BadRequest,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = new
            {
                error = ex.Message,
                status = context.Response.StatusCode
            };

            var json = JsonSerializer.Serialize(response);
            await context.Response.WriteAsync(json);
        }
    }
}

public class AppBadRequestException : Exception
{
    public AppBadRequestException(string message) : base(message)
    {
    }
}

public class AppUnauthorizedException : Exception
{
    public AppUnauthorizedException(string message) : base(message)
    {
    }
}

public class AppNotFoundException : Exception
{
    public AppNotFoundException(string message) : base(message)
    {
    }
}