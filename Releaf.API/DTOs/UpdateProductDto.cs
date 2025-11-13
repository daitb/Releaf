using Releaf.API.Models;

namespace Releaf.API.DTOs
{
    public class UpdateProductDto
    {
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? Materials { get; set; }
        public ProductStatus ProductStatus { get; set; }
        public int? SupplierId { get; set; }
        public int? CategoryId { get; set; }
        public List<IFormFile>? NewImageFiles { get; set; } = new List<IFormFile>();
        public List<string>?  ExistingImageFiles { get; set; } = new List<string>();
    }
}
