using Releaf.API.Models;

namespace Releaf.API.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetUserByEmailAsync(string email);
        Task<bool> UserExistsAsync(string email);
        Task AddUserAsync(User user);
    }
}
