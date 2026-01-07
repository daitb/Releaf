using Releaf.API.DTOs;

namespace Releaf.API.Interfaces
{
    /// <summary>
    /// Product service interface.
    /// Uses exception-based error handling - appropriate for Fresher/Junior level.
    /// </summary>
    public interface IProductService
    {
        /// <summary>
        /// Get paginated list of products. Always succeeds (returns empty if no data).
        /// </summary>
        Task<PaginatedResult<ProductDto>> GetAllProductsAsync(string? q, int page, int pageSize, string? sort);

        /// <summary>
        /// Get product by ID. Throws NotFoundException if not found.
        /// </summary>
        Task<ProductDto> GetProductByIdAsync(int id);

        /// <summary>
        /// Create a new product. Validation handled by FluentValidation.
        /// </summary>
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);

        /// <summary>
        /// Update existing product. Throws NotFoundException if product not found.
        /// </summary>
        Task<bool> UpdateProductAsync(int id, UpdateProductDto updateProductDto);

        /// <summary>
        /// Delete (soft-delete) a product. Throws NotFoundException if not found.
        /// </summary>
        Task<bool> DeleteProductAsync(int id);

        /// <summary>
        /// Get best selling products. Always succeeds (returns empty if no data).
        /// </summary>
        Task<IEnumerable<ProductDto>> GetBestSellingProductAsync(int count);
    }
}
