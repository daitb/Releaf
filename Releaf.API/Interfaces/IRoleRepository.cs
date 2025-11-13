using Releaf.API.Models;

namespace Releaf.API.Interfaces;

public interface IRoleRepository
{
    Task<Role?> GetRoleByNameAsync(string roleName);
}