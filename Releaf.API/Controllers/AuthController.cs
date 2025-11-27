using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Releaf.API.DTOs;
using Releaf.API.Interfaces;

namespace Releaf.API.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class AuthController : ApiBaseController
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService, ILogger<AuthController> logger) : base(logger)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            return await ExecuteAsync<Object>(
               async () =>
                {
                    await _authService.RegisterAsync(request);
                    return null;

                }, "User registered successfully");
        }

        [HttpPost("login")]
        public Task<IActionResult> Login(LoginRequest request)
        {
            return ExecuteAsync(
                async () => await _authService.LoginAsync(request),
                "User login successfully");
        }

        [Authorize]
        [HttpGet("me")]
        public Task<IActionResult> GetCurrentUser()
        {
            return ExecuteAsync(
                async () => await _authService.GetCurrentUserAsync(),
                "Get current user successfully");
        }
    }
}
