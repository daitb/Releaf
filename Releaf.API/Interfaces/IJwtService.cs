using Releaf.API.Models;

namespace Releaf.API.Interfaces
{
    public interface IJwtService
    {
        string CreateJwtToken(User user);
    }
}