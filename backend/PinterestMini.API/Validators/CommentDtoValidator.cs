using FluentValidation;
using PinterestMini.API.DTOs.Comments;

namespace PinterestMini.API.Validators;

public class CreateCommentDtoValidator : AbstractValidator<CreateCommentDto>
{
    public CreateCommentDtoValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(500).WithMessage("Comment cannot exceed 500 characters.");

        RuleFor(x => x.PinId)
            .NotEmpty().WithMessage("PinId is required.");
    }
}

public class UpdateCommentDtoValidator : AbstractValidator<UpdateCommentDto>
{
    public UpdateCommentDtoValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty()
            .MaximumLength(500).WithMessage("Comment cannot exceed 500 characters.");
    }
}