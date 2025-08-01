namespace PinterestMini.API.DTOs.Pins;

public class CreatePinDto
{
    public string Title { get; set; }

    public string? Description { get; set; }

    public bool AllowComments { get; set; } = true;

    public List<string>? TagNames { get; set; }

    public List<Guid>? BoardIds { get; set; }

    public IFormFile Image { get; set; } // Uploaded image
}