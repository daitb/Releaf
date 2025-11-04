using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Releaf.API.Data;
using Releaf.API.DTOs;
using Releaf.API.Exceptions;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly ReleafDbContext _context;
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepo;
        private readonly IJwtService _jwtService;

        public AuthService(ReleafDbContext context, IUserRepository userRepo, IConfiguration config, IJwtService jwtService)
        {
            _context = context;
            _config = config;
            _userRepo = userRepo;
            _jwtService = jwtService;
        }
        public async Task RegisterAsync(RegisterRequest request)
        {
            if( await _userRepo.UserExistsAsync(request.Email))
            {
                throw new ArgumentException("Email is already exists");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var defaultRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "Customer");
            if (defaultRole == null)
            {
                throw new Exception("Default 'Customer' role not found.");
            }

            var user = new User
            {
                FullName = request.FullName,
                PasswordHash = hashedPassword,
                Email = request.Email
            };

            user.Roles.Add(defaultRole);

            await _userRepo.AddUserAsync(user);
            await _context.SaveChangesAsync();
        }
        public async Task<TokenResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepo.GetUserByEmailAsync(request.Email);

            if(user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {
                throw new AuthenticationException("Invalid email or password"); // Dùng custom exception
            }

            var token = _jwtService.CreateJwtToken(user);

            return new TokenResponse
            {
                AccessToken = token
            };
        }       
    }
}
