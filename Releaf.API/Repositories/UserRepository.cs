using Microsoft.EntityFrameworkCore;
using Releaf.API.Data;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ReleafDbContext _context;

        public UserRepository(ReleafDbContext context)
        {
            _context = context;
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserByIdAsync(int userId)
        {
            return await _context.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<bool> UserExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public Task SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }
    }
}
