using FluentValidation;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Validators;

public class UpdatePinDtoValidator : AbstractValidator<UpdatePinDto>
{
    public UpdatePinDtoValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.")
            .When(x => x.Title != null);

        RuleForEach(x => x.TagIdsToAdd)
            .Must(tagId => tagId != Guid.Empty)
            .WithMessage("Invalid tag ID to add.");

        RuleForEach(x => x.TagIdsToRemove)
            .Must(tagId => tagId != Guid.Empty)
            .WithMessage("Invalid tag ID to remove.");

        RuleForEach(x => x.BoardIds)
            .Must(boardId => boardId != Guid.Empty)
            .WithMessage("Invalid board ID.");
    }
}

public class CreatePinDtoValidator : AbstractValidator<CreatePinDto>
{
    public CreatePinDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.Image)
            .NotNull().WithMessage("Image is required.")
            .Must(file => file.ContentType.StartsWith("image/"))
            .WithMessage("Uploaded file must be an image.");

        RuleForEach(x => x.TagIds)
            .Must(tagId => tagId != Guid.Empty)
            .WithMessage("Invalid tag ID.");

        RuleForEach(x => x.BoardIds)
            .Must(boardId => boardId != Guid.Empty)
            .WithMessage("Invalid board ID.");
    }
}