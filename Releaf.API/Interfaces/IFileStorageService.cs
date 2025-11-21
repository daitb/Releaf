namespace Releaf.API.Interfaces
{
    public interface IFileStorageService
    {
        Task<string> UploadFileAsync(IFormFile file, string subFolder);
        void DeleteFile(string? filePath);
    }
}