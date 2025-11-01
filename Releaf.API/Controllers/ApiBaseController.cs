using Microsoft.AspNetCore.Mvc;
using Releaf.API.Exceptions;

namespace Releaf.API.Controllers
{
   public abstract class ApiBaseController : ControllerBase
    {
        private readonly ILogger<ApiBaseController> _logger;

        protected ApiBaseController(ILogger<ApiBaseController> logger)
        {
            _logger = logger;
        }
        protected async Task<IActionResult> ExecuteAsync<T>(Func<Task<T>> func, string? successMessage = null)
        {
            try
            {
                var result = await func();
                return Ok(ApiResponse<T>.Ok(result, successMessage));
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Resource not found: {Message}", ex.Message);
                return NotFound(ApiResponse<T>.Fail(ex.Message)); 
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Bad request: {Message}", ex.Message);
                return BadRequest(ApiResponse<string>.Fail(ex.Message));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");
                return StatusCode(500, ApiResponse<string>.Fail("Internall Server Error"));
            }
        }
    }
}
