using Releaf.API.Models;
namespace Releaf.API.Interfaces
{
    public interface IOrderDetailRepository
    {
        Task<IEnumerable<int>> GetBestSellingProductIdsAsync(int count);
    }
}