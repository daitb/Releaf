using AutoMapper;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
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
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public AuthService(IUserRepository userRepo, IConfiguration config, IJwtService jwtService, IRoleRepository roleRepo, IHttpContextAccessor httpContextAccessor, IMapper mapper)
        {
            _config = config;
            _userRepo = userRepo;
            _jwtService = jwtService;
            _roleRepo = roleRepo;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
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

            var accessToken = _jwtService.CreateJwtToken(user);

            return new TokenResponse
            {
                AccessToken = accessToken
            };
        }

        public async Task<CurrentUserDto> GetCurrentUserAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            var userIdClaim = httpContext?.User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value ??
                            httpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if(string.IsNullOrWhiteSpace(userIdClaim)){
                throw new AuthenticationException("User is not authenticated");
            }
            
            if(!int.TryParse(userIdClaim, out var userId)){
                throw new AuthenticationException("Invalid user identifier");
            }

            var user =await _userRepo.GetUserByIdAsync(userId);

            if(user == null){
                throw new NotFoundException("User not found");
            }

            return _mapper.Map<CurrentUserDto>(user);
        }    
    }
}
