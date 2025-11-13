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
        private readonly IConfiguration _config;
        private readonly IUserRepository _userRepo;
        private readonly IJwtService _jwtService;
        private readonly IRoleRepository _roleRepo;

        public AuthService(IUserRepository userRepo, IConfiguration config, IJwtService jwtService, IRoleRepository roleRepo)
        {
            _config = config;
            _userRepo = userRepo;
            _jwtService = jwtService;
            _roleRepo = roleRepo;
        }
        public async Task RegisterAsync(RegisterRequest request)
        {
            if( await _userRepo.UserExistsAsync(request.Email))
            {
                throw new ArgumentException("Email is already exists");
            }

            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var defaultRole = await _roleRepo.GetRoleByNameAsync("Customer");
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
            await _userRepo.SaveChangesAsync();
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
