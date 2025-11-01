using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace Releaf.API.DTOs
{
    public class CreateProductDto
    {
        [Required(ErrorMessage = "Product Name is required")]
        [MaxLength(255)]
        public string ProductName { get; set; }
        public string Description { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal  Price { get; set; }
        public string Materials { get; set; }
        public int CategoryId { get; set; }
        public int SupplierId { get; set; }
        public List<string> ImageUrls { get; set; }
    }
}
