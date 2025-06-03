namespace PinterestMini.API.DTOs.Comments;

public class CreateCommentDto
{
    public Guid PinId { get; set; }
    public string Content { get; set; }
}
