namespace PinterestMini.API.DTOs.Pins;

public class UpdatePinDto
{
    public string? Title { get; set; }

    public string? Description { get; set; }

    public bool? AllowComments { get; set; }

    public List<string>? TagNames { get; set; }
    
    public List<Guid>? BoardIds { get; set; }
}

public class SetPinBoardsDto
{
    public List<Guid> BoardIds { get; set; } = new();
}