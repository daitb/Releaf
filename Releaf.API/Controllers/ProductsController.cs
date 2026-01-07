using Microsoft.AspNetCore.Mvc;
using Releaf.API.DTOs;
using Releaf.API.Interfaces;

namespace Releaf.API.Controllers
{
    /// <summary>
    /// Products API Controller.
    /// Uses ApiBaseController for consistent error handling via Exception Middleware.
    /// </summary>
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductsController : ApiBaseController
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger) 
            : base(logger)
        {
            _productService = productService;
        }

        /// <summary>
        /// Get all products with pagination and filtering.
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<PaginatedResult<ProductDto>>), StatusCodes.Status200OK)]
        public Task<IActionResult> GetAllProducts(
            [FromQuery] string? q = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? sort = "name_asc")
        {
            return ExecuteAsync(
                () => _productService.GetAllProductsAsync(q, page, pageSize, sort),
                "Get list product successfully"
            );
        }

        /// <summary>
        /// Get a single product by ID.
        /// </summary>
        [HttpGet("{id}", Name = "GetProductById")]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status404NotFound)]
        public Task<IActionResult> GetProductById(int id)
        {
            return ExecuteAsync(
                () => _productService.GetProductByIdAsync(id),
                "Get product successfully"
            );
        }

        /// <summary>
        /// Create a new product.
        /// Validation is automatically handled by FluentValidation.
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<ProductDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public Task<IActionResult> CreateProduct([FromForm] CreateProductDto createProductDto)
        {
            return ExecuteAsync(
                () => _productService.CreateProductAsync(createProductDto),
                "Add new product successfully"
            );
        }

        /// <summary>
        /// Update an existing product.
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> UpdateProduct(int id, [FromForm] UpdateProductDto updateProductDto)
        {
            return ExecuteAsync(
                () => _productService.UpdateProductAsync(id, updateProductDto),
                "Product updated successfully"
            );
        }

        /// <summary>
        /// Delete (soft-delete) a product.
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public Task<IActionResult> DeleteProduct(int id)
        {
            return ExecuteAsync(
                () => _productService.DeleteProductAsync(id),
                "Product deleted successfully"
            );
        }

        /// <summary>
        /// Get best selling products.
        /// </summary>
        [HttpGet("bestselling")]
        [ProducesResponseType(typeof(ApiResponse<IEnumerable<ProductDto>>), StatusCodes.Status200OK)]
        public Task<IActionResult> GetBestSellingProducts([FromQuery] int count = 4)
        {
            return ExecuteAsync(
                () => _productService.GetBestSellingProductAsync(count),
                $"Get top {count} best selling products successfully"
            );
        }
    }
}
