using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Releaf.API.DTOs;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly IOrderDetailRepository _orderDetailRepo;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        public ProductService(IProductRepository repository, IMapper mapper, IMemoryCache cache, IOrderDetailRepository orderDetailRepository)
        {
            _productRepo = repository;
            _mapper = mapper;
            _cache = cache;
            _orderDetailRepo = orderDetailRepository;
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepo.GetAllAsync();
            return _mapper.Map<IEnumerable<ProductDto>>(products);
        }
        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            return _mapper.Map<ProductDto?>(product);
        }
        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            //Map createProductDto to ProductDto
            var productEntity = _mapper.Map<Product>(createProductDto);

            //Set default time for CreateAt attribute
            productEntity.CreateAt = DateTime.Now;

            //Process logic add image
            if(createProductDto.ImageUrls != null)
            {
                foreach (var imgUrl in createProductDto.ImageUrls)
                {
                    productEntity.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = imgUrl,
                        IsPrimary = !productEntity.ProductImages.Any()
                    });
                }
            }        

            //EF automatically resognizes images and then insert them into ProductImages
            await _productRepo.AddAsync(productEntity);
            await _productRepo.SaveChangesAsync();

            return _mapper.Map<ProductDto>(productEntity);
        }
        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if(product == null)
            {
                return false;
            }
            product = _mapper.Map<Product>(updateProductDto);

            if(updateProductDto.ImageUrls != null)
            {
                foreach(var imgUrl in updateProductDto.ImageUrls)
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = imgUrl,
                    });
                }
            }
            _productRepo.Update(product);
            return await _productRepo.SaveChangesAsync();
        }
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product == null)
            {
                return false;
            }

            _productRepo.Delete(product);
            return await _productRepo.SaveChangesAsync();
        }

        public async Task<IEnumerable<ProductDto>> GetBestSellingProductAsync(int count)
        {
            string cacheKey = $"BestSellingProducts_{count}";

            if(_cache.TryGetValue(cacheKey, out IEnumerable<ProductDto>? cachedProducts))
            {
                return cachedProducts!;
            }

            var topProductIds = (await _orderDetailRepo.GetBestSellingProductIdsAsync(count)).ToList();

            if (!topProductIds.Any())
            {
                return new List<ProductDto>();
            }

            var topProducts = await _productRepo.GetByIdsAsync(topProductIds);

            var sortedProducts = topProducts
                        .OrderBy(p => topProductIds.IndexOf(p.ProductId));

            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(sortedProducts);

            var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromHours(6));

            _cache.Set(cacheKey, productDtos, cacheEntryOptions);

            return productDtos;
        }
    }
}
