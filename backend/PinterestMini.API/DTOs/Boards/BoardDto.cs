namespace PinterestMini.API.DTOs.Boards;

public class BoardDto
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public string? CoverImageUrl { get; set; }
    public string OwnerUsername { get; set; }
}