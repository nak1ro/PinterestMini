namespace PinterestMini.API.DTOs.Pins;

public class PinDto
{
    public Guid Id { get; set; }

    public string Title { get; set; }

    public string? Description { get; set; }

    public string ImageUrl { get; set; }

    public DateTime CreatedAt { get; set; }

    public bool AllowComments { get; set; }

    public OwnerDto Owner { get; set; } = null!;
    public List<TagPreviewDto> Tags { get; set; }
    public List<BoardPreviewDto> Boards { get; set; }
}