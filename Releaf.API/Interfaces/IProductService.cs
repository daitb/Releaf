using Releaf.API.DTOs;

namespace Releaf.API.Interfaces
{
    public interface IProductService
    {
       Task<PaginatedResult<ProductDto>> GetAllProductsAsync(string? q, int page, int pageSize, string? sort);
        Task<ProductDto?> GetProductByIdAsync(int id);
        Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto);
        Task<bool> UpdateProductAsync(int id, UpdateProductDto updateProductDto);
        Task<bool> DeleteProductAsync(int id);
        Task<IEnumerable<ProductDto>> GetBestSellingProductAsync(int count);
    }
}
