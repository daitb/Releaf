using Releaf.API.Interfaces;

namespace Releaf.API.Services
{
    public class LocalFileStorageService : IFileStorageService
    {
        private readonly IWebHostEnvironment _env;
        public LocalFileStorageService(IWebHostEnvironment env)
        {
            _env = env;
        }
        public async Task<string> UploadFileAsync(IFormFile file, string subFolder)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException("File is null or empty.", nameof(file));
            }

            string fileExtension = Path.GetExtension(file.FileName);
            string uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";

            string forderPath = Path.Combine(_env.WebRootPath, subFolder);
            string absoluteSavePath = Path.Combine(forderPath, uniqueFileName);

            Directory.CreateDirectory(forderPath);

            using (var stream = new FileStream(absoluteSavePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/{subFolder.Replace("\\", "/")}/{uniqueFileName}";
        }
        
        public void DeleteFile(string? filePath)
        {
            if (string.IsNullOrEmpty(filePath))
            {
                return;
            }

            string physicalPath = Path.Combine(_env.WebRootPath, filePath.TrimStart('/'));

            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }
        }
    }
}