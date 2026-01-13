
using System.Text;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Releaf.API.Behaviors;
using Releaf.API.Data;
using Releaf.API.Interfaces;
using Releaf.API.Mapping;
using Releaf.API.Middleware;
using Releaf.API.Repositories;
using Releaf.API.Services;

namespace Releaf.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            var config = builder.Configuration;

            // Add services to the container.
            builder.Services.AddDbContext<ReleafDbContext>(options =>
                    options.UseSqlServer(config.GetConnectionString("DefaultConnection")));

            // Add controllers with Validation Filter
            builder.Services.AddControllers(options =>
            {
                // Automatically validate DTOs before they reach controller actions
                options.Filters.Add<ValidationActionFilter>();
            });

            // Register all validators from this assembly
            // This scans for all classes that implement AbstractValidator<T>
            builder.Services.AddValidatorsFromAssemblyContaining<Program>();
            builder.Services.AddScoped<ValidationActionFilter>();

            builder.Services.AddAutoMapper(cfg =>
            {
                cfg.LicenseKey = config.GetConnectionString("LicenseKey");
            }, typeof(MappingProfile));

            builder.Services.AddEndpointsApiExplorer();
            
            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Releaf API", Version = "v1" });

                // Thêm cấu hình JWT Authorization
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Nhập JWT token vào đây: 'Bearer {token}'"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
            builder.Services.AddScoped<IProductService, ProductService>();
            builder.Services.AddScoped<IProductRepository, ProductRepository>();
            builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<IJwtService, JwtService>();
            builder.Services.AddScoped<IRoleRepository, RoleRepository>();
            builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();
            builder.Services.AddScoped<IStorageService, StorageService>();
            
            // Register Unit of Work - coordinates multiple repositories in a single transaction
            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddMemoryCache();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:5173")
                    .AllowAnyHeader()
                    .AllowAnyMethod();
                });
            });

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = config["Jwt:Issuer"],
                        ValidAudience = config["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
                    };
                });

            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            
            // IMPORTANT: Exception middleware must be FIRST!
            // This ensures it catches exceptions from ALL subsequent middleware
            app.UseExceptionHandling();
            
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseStaticFiles();

            app.UseCors("AllowFrontend");

            app.UseAuthentication();

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
