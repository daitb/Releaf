using Microsoft.EntityFrameworkCore;
using Releaf.API.Data;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly ReleafDbContext _context;

        public RoleRepository(ReleafDbContext context)
        {
            _context = context;
        }

        public async Task<Role?> GetRoleByNameAsync(string roleName)
        {
            return await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == roleName);
        }
    }
}

