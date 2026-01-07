using FluentValidation;
using Releaf.API.DTOs;

namespace Releaf.API.Validators
{
    /// <summary>
    /// Validation rules for CreateProductDto.
    /// 
    /// WHY FLUENT VALIDATION?
    /// 1. Validation logic tách biệt khỏi business logic
    /// 2. Dễ test từng validation rule riêng biệt
    /// 3. Consistent validation messages
    /// 4. Reusable rules (Include, RuleSet)
    /// 
    /// FRESHER NOTE: 
    /// Nhà tuyển dụng sẽ hỏi "Tại sao dùng FluentValidation thay vì Data Annotations?"
    /// Trả lời: 
    /// - Separation of Concerns: Validation rules không nằm trong DTO
    /// - Testable: Có thể unit test validation riêng
    /// - Flexible: Hỗ trợ conditional validation, async validation
    /// - Clean: DTO chỉ chứa data, không chứa logic
    /// </summary>
    public class CreateProductValidator : AbstractValidator<CreateProductDto>
    {
        public CreateProductValidator()
        {
            // Product Name validation
            RuleFor(x => x.ProductName)
                .NotEmpty()
                    .WithMessage("Tên sản phẩm không được để trống")
                    .WithErrorCode("Product.NameRequired")
                .MaximumLength(255)
                    .WithMessage("Tên sản phẩm không được vượt quá 255 ký tự")
                    .WithErrorCode("Product.NameTooLong");

            // Price validation
            RuleFor(x => x.Price)
                .GreaterThan(0)
                    .WithMessage("Giá sản phẩm phải lớn hơn 0")
                    .WithErrorCode("Product.InvalidPrice");

            // Description validation (optional but has max length)
            RuleFor(x => x.Description)
                .MaximumLength(5000)
                    .WithMessage("Mô tả sản phẩm không được vượt quá 5000 ký tự")
                    .WithErrorCode("Product.DescriptionTooLong")
                .When(x => !string.IsNullOrEmpty(x.Description));

            // Materials validation
            RuleFor(x => x.Materials)
                .MaximumLength(500)
                    .WithMessage("Vật liệu không được vượt quá 500 ký tự")
                    .WithErrorCode("Product.MaterialsTooLong")
                .When(x => !string.IsNullOrEmpty(x.Materials));

            // Image validation - using List<IFormFile> as per DTO definition
            RuleFor(x => x.ImageFile)
                .Must(files => files == null || files.Count <= 10)
                    .WithMessage("Tối đa 10 hình ảnh cho mỗi sản phẩm")
                    .WithErrorCode("Product.TooManyImages");

            // Validate each image file
            RuleForEach(x => x.ImageFile)
                .Must(BeAValidImage)
                    .WithMessage("Chỉ chấp nhận file ảnh (.jpg, .jpeg, .png, .webp)")
                    .WithErrorCode("Product.InvalidImageFormat")
                .Must(BeWithinSizeLimit)
                    .WithMessage("Kích thước file ảnh tối đa 5MB")
                    .WithErrorCode("Product.ImageTooLarge")
                .When(x => x.ImageFile != null && x.ImageFile.Count > 0);
        }

        private bool BeAValidImage(IFormFile? file)
        {
            if (file == null) return true;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return allowedExtensions.Contains(extension);
        }

        private bool BeWithinSizeLimit(IFormFile? file)
        {
            if (file == null) return true;
            const long maxSize = 5 * 1024 * 1024; // 5MB
            return file.Length <= maxSize;
        }
    }
}
