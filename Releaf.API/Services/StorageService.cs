using Azure.Storage.Blobs;

namespace Releaf.API.Services
{
    public interface IStorageService
    {
        Task<IEnumerable<string>> UploadFileAsync(IEnumerable<IFormFile> files);
        Task<Stream> DownloadFileAsync(string fileUrl);
        Task DeleteFileAsync(string fileUrl);
    }

    public class StorageService : IStorageService
    {
        private readonly string _connectionString;
        private readonly string _containerName;

        public StorageService(IConfiguration configuration)
        {
            _connectionString = configuration["AzureStorage:ConnectionString"];
            _containerName = configuration["AzureStorage:ContainerName"];
        }
        public Task DeleteFileAsync(string fileUrl)
        {
            throw new NotImplementedException();
        }

        public Task<Stream> DownloadFileAsync(string fileUrl)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> UploadFileAsync(IEnumerable<IFormFile> files)
        {
            var serviceClient = new BlobServiceClient(_connectionString);
            var containerClient = serviceClient.GetBlobContainerClient(_containerName);
            List<string> imageUrls = new List<string>();

            foreach (var file in files)
            {
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var blobClient = containerClient.GetBlobClient(fileName);
                using var strem = file.OpenReadStream();
                await blobClient.UploadAsync(strem, overwrite: true);
                imageUrls.Add(blobClient.Uri.ToString());
            }

            return imageUrls;
        }
    }
}