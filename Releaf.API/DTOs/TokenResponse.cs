namespace Releaf.API.DTOs
{
    public class TokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        // Tạm thời chúng ta sẽ chỉ trả về AccessToken cho đơn giản
        // public string RefreshToken { get; set; } = string.Empty;
    }
}
