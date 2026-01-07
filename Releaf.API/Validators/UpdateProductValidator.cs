using FluentValidation;
using Releaf.API.DTOs;

namespace Releaf.API.Validators
{
    /// <summary>
    /// Validation rules for UpdateProductDto.
    /// Note: Price is nullable in Update, so we only validate if it has a value.
    /// </summary>
    public class UpdateProductValidator : AbstractValidator<UpdateProductDto>
    {
        public UpdateProductValidator()
        {
            // Product Name - optional in update, but if provided must be valid
            RuleFor(x => x.ProductName)
                .NotEmpty()
                    .WithMessage("Tên sản phẩm không được để trống nếu được cung cấp")
                    .WithErrorCode("Product.NameRequired")
                .MaximumLength(255)
                    .WithMessage("Tên sản phẩm không được vượt quá 255 ký tự")
                    .WithErrorCode("Product.NameTooLong")
                .When(x => x.ProductName != null);

            // Price validation - only if provided (nullable)
            RuleFor(x => x.Price)
                .GreaterThan(0)
                    .WithMessage("Giá sản phẩm phải lớn hơn 0")
                    .WithErrorCode("Product.InvalidPrice")
                .When(x => x.Price.HasValue);

            // Description validation
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

            // New images validation - using List<IFormFile>? as per DTO
            RuleFor(x => x.NewImageFiles)
                .Must(files => files == null || files.Count <= 10)
                    .WithMessage("Tối đa 10 hình ảnh mới cho mỗi lần cập nhật")
                    .WithErrorCode("Product.TooManyImages");

            RuleForEach(x => x.NewImageFiles)
                .Must(BeAValidImage)
                    .WithMessage("Chỉ chấp nhận file ảnh (.jpg, .jpeg, .png, .webp)")
                    .WithErrorCode("Product.InvalidImageFormat")
                .Must(BeWithinSizeLimit)
                    .WithMessage("Kích thước file ảnh tối đa 5MB")
                    .WithErrorCode("Product.ImageTooLarge")
                .When(x => x.NewImageFiles != null && x.NewImageFiles.Count > 0);
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
