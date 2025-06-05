namespace PinterestMini.API.DTOs.Boards;

public class UpdateBoardDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? IsPrivate { get; set; }
    public IFormFile? CoverImage { get; set; }
}