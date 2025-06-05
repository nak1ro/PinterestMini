namespace PinterestMini.API.DTOs.Boards;

public class CreateBoardDto
{
    public string Name { get; set; }
    public string? Description { get; set; }
    public bool IsPrivate { get; set; }
    public IFormFile? CoverImage { get; set; }
}