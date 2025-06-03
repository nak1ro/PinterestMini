namespace PinterestMini.API.DTOs.Pins;

public class UpdatePinDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? AllowComments { get; set; }

    public List<Guid>? TagIdsToAdd { get; set; }

    public List<Guid>? TagIdsToRemove { get; set; }

    public List<Guid>? BoardIds { get; set; }
}