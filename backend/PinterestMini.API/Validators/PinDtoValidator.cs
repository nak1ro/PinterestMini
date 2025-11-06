using FluentValidation;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Validators;

public class UpdatePinDtoValidator : AbstractValidator<UpdatePinDto>
{
    public UpdatePinDtoValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(100)
            .WithMessage("Title cannot exceed 100 characters.")
            .When(x => x.Title != null);

        RuleForEach(x => x.TagNames)
            .NotEmpty().WithMessage("Tag name cannot be empty.")
            .MaximumLength(30).WithMessage("Tag name cannot exceed 30 characters.")
            .When(x => x.TagNames != null);

        RuleForEach(x => x.BoardIds)
            .Must(id => id != Guid.Empty)
            .WithMessage("Invalid board ID.");
    }
}

public class CreatePinDtoValidator : AbstractValidator<CreatePinDto>
{
    private static readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
    private static readonly string[] AllowedImageMimeTypes = { "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp" };

    public CreatePinDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.Image)
            .NotNull()
            .WithMessage("Image is required.")
            .Must(file => file != null && file.Length < 5_000_000)
            .WithMessage("Image must be smaller than 5MB.")
            .Must(file => file != null && IsValidImageType(file))
            .WithMessage("Image must be a valid image file (JPG, PNG, GIF, or WEBP).");

        RuleForEach(x => x.BoardIds)
            .Must(boardId => boardId != Guid.Empty)
            .WithMessage("Invalid board ID.");
    }

    private static bool IsValidImageType(Microsoft.AspNetCore.Http.IFormFile file)
    {
        if (file == null) return false;

        var extension = System.IO.Path.GetExtension(file.FileName)?.ToLowerInvariant();
        var contentType = file.ContentType?.ToLowerInvariant();

        return (!string.IsNullOrEmpty(extension) && AllowedImageExtensions.Contains(extension)) ||
               (!string.IsNullOrEmpty(contentType) && AllowedImageMimeTypes.Contains(contentType));
    }
}