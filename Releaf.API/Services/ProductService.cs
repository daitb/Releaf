using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Releaf.API.DTOs;
using Releaf.API.Exceptions;
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
        private readonly IFileStorageService _fileStorageService;
        public ProductService(IProductRepository repository, IMapper mapper, IMemoryCache cache, IOrderDetailRepository orderDetailRepository, IFileStorageService fileStorageService)
        {
            _productRepo = repository;
            _mapper = mapper;
            _cache = cache;
            _fileStorageService = fileStorageService;
            _orderDetailRepo = orderDetailRepository;
        }

        public async Task<PaginatedResult<ProductDto>> GetAllProductsAsync(string? q, int page, int pageSize, string? sort)
        {
            var paginatedProducts = await _productRepo.GetAllAsync(q, page, pageSize, sort);
            return new PaginatedResult<ProductDto>
            {
                Items = _mapper.Map<IEnumerable<ProductDto>>(paginatedProducts.Items),
                TotalCount = paginatedProducts.TotalCount,
                Page = paginatedProducts.Page,
                PageSize = paginatedProducts.PageSize
            };
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
            if (createProductDto.ImageFile != null && createProductDto.ImageFile.Any())
            {
                foreach (var imgFile in createProductDto.ImageFile)
                {
                    var imageUrl = await _fileStorageService.UploadFileAsync(imgFile, "product-images");
                    productEntity.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = imageUrl,
                        IsPrimary = !productEntity.ProductImages.Any()
                    });
                }
            }

            //EF automatically resognizes images and then insert them into ProductImages
            await _productRepo.AddAsync(productEntity);
            await _productRepo.SaveChangesAsync();

            return (await GetProductByIdAsync(productEntity.ProductId))!;
        }
        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product == null)
            {
                throw new NotFoundException($"Product with id {id} not found.");
            }
            _mapper.Map(updateProductDto, product);

            var oldImageUrls = product.ProductImages
                                    .Select(img => img.ImageUrl)
                                    .ToList();

            product.ProductImages.Clear();

            if(updateProductDto.ExistingImageFiles != null)
            {
                foreach (var imgUrl in updateProductDto.ExistingImageFiles)
                {
                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = imgUrl,
                        IsPrimary = !product.ProductImages.Any()
                    });
                }
            }

            if(updateProductDto.NewImageFiles != null)
            {
                foreach(var imgFile in updateProductDto.NewImageFiles)
                {
                    var imgUrl = await _fileStorageService.UploadFileAsync(imgFile, "product-images");

                    product.ProductImages.Add(new ProductImage
                    {
                        ImageUrl = imgUrl,
                        IsPrimary = !product.ProductImages.Any()
                    });
                }
            }

            _productRepo.Update(product);

            var success = await _productRepo.SaveChangesAsync();

            if (success)
            {
                var newImgUrls = product.ProductImages
                                        .Select(img => img.ImageUrl)
                                        .ToList();

                var imgToDelete = oldImageUrls.Except(newImgUrls);

                foreach(var imgUrl in imgToDelete)
                {
                    _fileStorageService.DeleteFile(imgUrl);
                }
            }

            return success;
        }
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product == null)
            {
                return false;
            }

            var imageUrls = product.ProductImages
                                    .Select(img => img.ImageUrl)
                                    .ToList();

            _productRepo.Delete(product);

            var success = await _productRepo.SaveChangesAsync();

            if (success)
            {
                foreach(var imgUrl in imageUrls)
                {
                    _fileStorageService.DeleteFile(imgUrl);
                }
            }

            return success;
        }

        public async Task<IEnumerable<ProductDto>> GetBestSellingProductAsync(int count)
        {
            string cacheKey = $"BestSellingProducts_{count}";

            if (_cache.TryGetValue(cacheKey, out IEnumerable<ProductDto>? cachedProducts))
            {
                return cachedProducts!;
            }

            var topProductIds = (await _orderDetailRepo.GetBestSellingProductIdsAsync(count)).ToList();

            if (!topProductIds.Any())
            {
                return new List<ProductDto>();
            }

            var topProducts = (await _productRepo.GetByIdsAsync(topProductIds))
                            .OrderBy(p => topProductIds.IndexOf(p.ProductId));

            var productDtos = _mapper.Map<IEnumerable<ProductDto>>(topProducts);

            var cacheEntryOptions = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(TimeSpan.FromHours(6));

            _cache.Set(cacheKey, productDtos, cacheEntryOptions);

            return productDtos;
        }
    }
}
