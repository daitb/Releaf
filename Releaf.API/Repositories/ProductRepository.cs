using System.Threading.Tasks;
using Azure;
using Microsoft.EntityFrameworkCore;
using Releaf.API.Data;
using Releaf.API.DTOs;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ReleafDbContext _context;

        public ProductRepository(ReleafDbContext context)
        {
            _context = context;
        }

        public async Task<PaginatedResult<Product>> GetAllAsync(string? q, int page, int pageSize, string? sort)
        {
            var queryable = _context.Products.AsQueryable();

            if (!string.IsNullOrWhiteSpace(q))
            {
                queryable = queryable.Where(p => p.ProductName!.Contains(q));
            }

            queryable = sort switch
            {
                "name_desc" => queryable.OrderByDescending(p => p.ProductName),
                "price_asc" => queryable.OrderBy(p => p.Price),
                "price_desc" => queryable.OrderByDescending(p => p.Price),
                _ => queryable.OrderBy(p => p.ProductName),
            };

            var totalCount = await queryable.CountAsync();
            var items = await queryable
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.ProductImages)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PaginatedResult<Product> { Items = items, TotalCount = totalCount, Page = page, PageSize = pageSize };
        }
        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Products.
                 Include(p => p.Category)
                .Include(p => p.Supplier)
                .Include(p => p.ProductImages)
                .FirstOrDefaultAsync(p => p.ProductId == id && p.ProductStatus != ProductStatus.Discontinue);
        }
        public async Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Products
                .Where(p => ids.Contains(p.ProductId))
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Supplier)
                .ToListAsync();
        }
        public async Task AddAsync(Product product)
        {
            await _context.Products.AddAsync(product);
        }
        public void Update(Product product)
        {
            _context.Products.Update(product);
        }
        public void Delete(Product product)
        {
            product.ProductStatus = ProductStatus.Discontinue;
            _context.Products.Update(product);
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
