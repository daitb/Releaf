using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Releaf.API.Exceptions;

namespace Releaf.API.Middleware
{
    /// <summary>
    /// Global Exception Handling Middleware.
    /// 
    /// WHY USE THIS?
    /// 1. Centralized error handling - all exceptions handled in ONE place
    /// 2. Consistent error response format for ALL endpoints
    /// 3. Prevents leaking sensitive stack traces to clients
    /// 4. Logs all unhandled exceptions for debugging
    /// 
    /// HOW IT WORKS:
    /// 1. Request comes in
    /// 2. Passes through this middleware
    /// 3. If controller throws exception, middleware catches it
    /// 4. Converts exception to appropriate HTTP response
    /// 5. Logs the error
    /// 
    /// INTERVIEW TIP:
    /// "Middleware is a pipeline - each request flows through all middleware in order.
    ///  Exception middleware should be FIRST so it can catch errors from any layer."
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                // Pass request to next middleware/controller
                await _next(context);
            }
            catch (Exception ex)
            {
                // Log the exception
                _logger.LogError(ex, "An unhandled exception occurred. TraceId: {TraceId}", 
                    context.TraceIdentifier);

                // Handle the exception and return appropriate response
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            // Determine status code and message based on exception type
            var (statusCode, title, detail) = exception switch
            {
                NotFoundException notFound => (
                    StatusCodes.Status404NotFound,
                    "Resource Not Found",
                    notFound.Message
                ),
                AuthenticationException auth => (
                    StatusCodes.Status401Unauthorized,
                    "Authentication Failed",
                    auth.Message
                ),
                ArgumentException arg => (
                    StatusCodes.Status400BadRequest,
                    "Bad Request",
                    arg.Message
                ),
                UnauthorizedAccessException => (
                    StatusCodes.Status403Forbidden,
                    "Access Denied",
                    "You do not have permission to access this resource."
                ),
                OperationCanceledException => (
                    StatusCodes.Status499ClientClosedRequest,
                    "Request Cancelled",
                    "The request was cancelled."
                ),
                _ => (
                    StatusCodes.Status500InternalServerError,
                    "Internal Server Error",
                    "An unexpected error occurred. Please try again later."
                )
            };

            // Create ProblemDetails response (RFC 7807 standard)
            var problemDetails = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = detail,
                Instance = context.Request.Path,
                Extensions =
                {
                    ["traceId"] = context.TraceIdentifier
                }
            };

            // In development, include exception details
            if (context.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
            {
                problemDetails.Extensions["exception"] = exception.Message;
                problemDetails.Extensions["stackTrace"] = exception.StackTrace;
            }

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsJsonAsync(problemDetails);
        }
    }

    /// <summary>
    /// Extension method to register the middleware in Program.cs.
    /// Usage: app.UseExceptionHandling();
    /// </summary>
    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExceptionHandling(this IApplicationBuilder app)
        {
            return app.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
