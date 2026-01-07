using AutoMapper;
using Microsoft.Extensions.Caching.Memory;
using Releaf.API.DTOs;
using Releaf.API.Exceptions;
using Releaf.API.Interfaces;
using Releaf.API.Models;

namespace Releaf.API.Services
{
    /// <summary>
    /// Product service implementation using exception-based error handling.
    /// 
    /// FRESHER/JUNIOR APPROACH:
    /// - Throws exceptions for error cases (NotFoundException, etc.)
    /// - Easy to understand and common in most .NET projects
    /// - Exception Middleware will catch and format errors
    /// </summary>
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepo;
        private readonly IOrderDetailRepository _orderDetailRepo;
        private readonly IMapper _mapper;
        private readonly IMemoryCache _cache;
        private readonly IFileStorageService _fileStorageService;

        public ProductService(
            IProductRepository repository,
            IMapper mapper,
            IMemoryCache cache,
            IOrderDetailRepository orderDetailRepository,
            IFileStorageService fileStorageService)
        {
            _productRepo = repository;
            _mapper = mapper;
            _cache = cache;
            _fileStorageService = fileStorageService;
            _orderDetailRepo = orderDetailRepository;
        }

        /// <summary>
        /// Get all products with pagination. Always succeeds.
        /// </summary>
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

        /// <summary>
        /// Get product by ID. Throws NotFoundException if not found.
        /// </summary>
        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product is null)
            {
                throw new NotFoundException($"Product with ID {id} was not found.");
            }

            return _mapper.Map<ProductDto>(product);
        }

        /// <summary>
        /// Create a new product.
        /// Validation is handled automatically by FluentValidation.
        /// </summary>
        public async Task<ProductDto> CreateProductAsync(CreateProductDto createProductDto)
        {
            // Validation is handled by FluentValidation via ValidationActionFilter
            // No need for manual checks here

            var productEntity = _mapper.Map<Product>(createProductDto);
            productEntity.CreateAt = DateTime.Now;

            // Process image uploads
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

            await _productRepo.AddAsync(productEntity);
            await _productRepo.SaveChangesAsync();

            // Return the created product
            return await GetProductByIdAsync(productEntity.ProductId);
        }

        /// <summary>
        /// Update existing product. Throws NotFoundException if not found.
        /// </summary>
        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto updateProductDto)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product is null)
            {
                throw new NotFoundException($"Product with ID {id} was not found.");
            }

            _mapper.Map(updateProductDto, product);

            var oldImageUrls = product.ProductImages
                .Select(img => img.ImageUrl)
                .ToList();

            product.ProductImages.Clear();

            // Re-add existing images that user wants to keep
            if (updateProductDto.ExistingImageFiles != null)
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

            // Upload and add new images
            if (updateProductDto.NewImageFiles != null)
            {
                foreach (var imgFile in updateProductDto.NewImageFiles)
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
                // Clean up orphaned images
                var newImgUrls = product.ProductImages
                    .Select(img => img.ImageUrl)
                    .ToList();

                var imgToDelete = oldImageUrls.Except(newImgUrls!);
                foreach (var imgUrl in imgToDelete)
                {
                    _fileStorageService.DeleteFile(imgUrl);
                }
            }

            return success;
        }

        /// <summary>
        /// Soft-delete a product. Throws NotFoundException if not found.
        /// </summary>
        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);

            if (product is null)
            {
                throw new NotFoundException($"Product with ID {id} was not found.");
            }

            var imageUrls = product.ProductImages
                .Select(img => img.ImageUrl)
                .ToList();

            _productRepo.Delete(product);
            var success = await _productRepo.SaveChangesAsync();

            if (success)
            {
                // Clean up images after successful delete
                foreach (var imgUrl in imageUrls)
                {
                    _fileStorageService.DeleteFile(imgUrl);
                }
            }

            return success;
        }

        /// <summary>
        /// Get best selling products (cached for 6 hours).
        /// Always succeeds - returns empty list if no data.
        /// </summary>
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
