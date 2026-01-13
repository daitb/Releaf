using Microsoft.AspNetCore.Mvc;
using Releaf.API.Services;

namespace Releaf.API.Controllers;

[Route("api/v1/[controller]")]
[ApiController]
public class UploadController : ApiBaseController
{
    private readonly IStorageService _storageService;

    public UploadController(IStorageService storageService, ILogger<UploadController> logger) : base(logger)
    {
        _storageService = storageService;
    }

    [HttpPost]
    public async Task<IActionResult> UploadFile(IEnumerable<IFormFile> files)
    {
        return await ExecuteAsync(
            async () => await _storageService.UploadFileAsync(files),
            "File uploaded successfully"
        );
    }
}