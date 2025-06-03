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