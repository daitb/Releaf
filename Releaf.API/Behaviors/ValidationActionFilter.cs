using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Releaf.API.Behaviors
{
    /// <summary>
    /// Action Filter that automatically validates incoming DTOs using FluentValidation.
    /// 
    /// USAGE:
    /// Register in Program.cs:
    ///     builder.Services.AddControllers(options => 
    ///         options.Filters.Add<ValidationActionFilter>());
    /// 
    /// Or per-controller/action:
    ///     [ServiceFilter(typeof(ValidationActionFilter))]
    /// 
    /// WHY ACTION FILTER OVER MANUAL VALIDATION?
    /// 1. DRY: No repeated validation code in every action
    /// 2. Consistent: Same error response format everywhere
    /// 3. Testable: Validators can be unit tested separately
    /// </summary>
    public class ValidationActionFilter : IAsyncActionFilter
    {
        private readonly IServiceProvider _serviceProvider;

        public ValidationActionFilter(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // Iterate through all action arguments
            foreach (var argument in context.ActionArguments.Values)
            {
                if (argument is null) continue;

                var argumentType = argument.GetType();
                var validatorType = typeof(IValidator<>).MakeGenericType(argumentType);

                // Get validator from DI container
                var validator = _serviceProvider.GetService(validatorType) as IValidator;

                if (validator is not null)
                {
                    var validationContext = new ValidationContext<object>(argument);
                    var validationResult = await validator.ValidateAsync(validationContext);

                    if (!validationResult.IsValid)
                    {
                        // Convert to problem details format
                        var errors = validationResult.Errors
                            .GroupBy(f => f.PropertyName)
                            .ToDictionary(
                                g => g.Key,
                                g => g.Select(f => f.ErrorMessage).ToArray()
                            );

                        var problemDetails = new ValidationProblemDetails(errors)
                        {
                            Status = StatusCodes.Status400BadRequest,
                            Title = "One or more validation errors occurred."
                        };

                        context.Result = new BadRequestObjectResult(problemDetails);
                        return;
                    }
                }
            }

            await next();
        }
    }
}
