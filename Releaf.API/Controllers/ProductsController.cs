using Microsoft.AspNetCore.Mvc;
using Releaf.API.DTOs;
using Releaf.API.Exceptions;
using Releaf.API.Interfaces;

namespace Releaf.API.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class ProductsController : ApiBaseController
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService, ILogger<ProductsController> logger) : base(logger) 
        {
            _productService = productService;
        }

        [HttpGet]
        public  Task<IActionResult> GetAllProduct()
        {
            return  ExecuteAsync(
                 () =>  _productService.GetAllProductsAsync(), 
                "Get list product successfully"
            );
        }

        [HttpGet("{id}")]
        public  Task<IActionResult> GetProductById(int id)
        {
            return  ExecuteAsync(
                 () =>
                {
                    var product =  _productService.GetProductByIdAsync(id);
                    if (product == null)
                    {
                        throw new NotFoundException($"No product found with ID = {id}");
                    }

                    return product;
                }, 
                "Get product successfully"
             );
        }

        [HttpPost]
        public  Task<IActionResult> AddNewProductAsync(CreateProductDto createProductDto)
        {
            return  ExecuteAsync(
                 () =>  _productService.CreateProductAsync(createProductDto),
                "Add new product successfully"
             );
        }

        [HttpGet("bestselling")]
        public Task<IActionResult> GetBestSellingProducts([FromQuery] int count = 4)
        {
            return ExecuteAsync(
                 () =>  _productService.GetBestSellingProductAsync(count),
                $"Get top {count} best selling products successfully"
            );
        }
    }
}
