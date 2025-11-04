using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace Releaf.API.DTOs
{
    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
