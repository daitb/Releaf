using AutoMapper;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Releaf.API.DTOs;
using Releaf.API.Models;

namespace Releaf.API.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(
                    dest => dest.CategoryName,
                    opt => opt.MapFrom(src => src.Category!.CategoryName)
                )
                .ForMember(
                    dest => dest.SupplierName,
                    opt => opt.MapFrom(src => src.Supplier!.NameSupplier)
                );
            CreateMap<ProductDto, Product>();
            CreateMap<Product, CreateProductDto>();

            CreateMap<CreateProductDto, Product>()
            .ForMember(
                dest => dest.ProductImages, 
                opt => opt.Ignore()
            )
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
            CreateMap<User, CurrentUserDto>()
            .ForMember(
                dest => dest.Role, 
                opt => opt.MapFrom(src => src.Roles.Select(r => r.RoleName).FirstOrDefault())
            );
        }
    }
}
