using Releaf.API.DTOs;
using Releaf.API.Models;

namespace Releaf.API.Interfaces
{
    public interface IProductRepository
    {
        Task<PaginatedResult<Product>> GetAllAsync(string? q, int page, int pageSize, string? sort);
        Task<Product?> GetByIdAsync(int id);
        Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<int> ids);
        Task AddAsync(Product product);
        void Update(Product product);
        void Delete(Product product);
        Task<bool> SaveChangesAsync();
    }
}
