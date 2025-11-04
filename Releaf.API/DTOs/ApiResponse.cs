namespace Releaf.API.DTOs
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }

        private ApiResponse() { }

        public static ApiResponse<T> Ok(T data, string? message = null)
            => new ApiResponse<T>  { Success = true, Data = data, Message = message };

        public static ApiResponse<T> Fail(string? message)
            => new ApiResponse<T> { Success = false, Data = default, Message = message };
    }
}
