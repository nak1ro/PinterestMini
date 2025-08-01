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
    public CreatePinDtoValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required.")
            .MaximumLength(100).WithMessage("Title cannot exceed 100 characters.");

        RuleFor(x => x.Image)
            .NotNull()
            .WithMessage("Image is required.")
            .Must(file => file != null && file.Length < 5_000_000)
            .WithMessage("Image must be smaller than 5MB.");

        RuleForEach(x => x.BoardIds)
            .Must(boardId => boardId != Guid.Empty)
            .WithMessage("Invalid board ID.");
    }
}