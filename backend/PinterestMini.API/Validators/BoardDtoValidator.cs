using FluentValidation;
using PinterestMini.API.DTOs.Boards;

namespace PinterestMini.API.Validators;

public class CreateBoardDtoValidator : AbstractValidator<CreateBoardDto>
{
    public CreateBoardDtoValidator()
    {
        RuleFor(b => b.Name)
            .NotEmpty()
            .WithMessage("Board name is required.")
            .MaximumLength(100);
    }
}

public class UpdateBoardDtoValidator : AbstractValidator<UpdateBoardDto>
{
    public UpdateBoardDtoValidator()
    {
        RuleFor(b => b.Name)
            .MaximumLength(100)
            .When(b => !string.IsNullOrWhiteSpace(b.Name));
    }
}