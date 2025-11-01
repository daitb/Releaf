using Microsoft.EntityFrameworkCore;
using Releaf.API.Data;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Repositories
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly ReleafDbContext _dbContext;

        public OrderDetailRepository(ReleafDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<int>> GetBestSellingProductIdsAsync(int count)
        {
            return await _dbContext.OrderDetails
                .GroupBy(od => od.ProductId)
                .Select(g => new
                {
                    ProductId = g.Key,
                    TotalSold = g.Sum(od => od.Quantity)
                })
                .OrderByDescending(x => x.TotalSold)
                .Take(count)
                .Select(x => x.ProductId)
                .ToListAsync();
        }
    }
}
