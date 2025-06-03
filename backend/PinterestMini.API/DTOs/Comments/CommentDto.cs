namespace PinterestMini.API.DTOs.Comments;

public class CommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Guid UserId { get; set; }
    public string Username { get; set; }
    public string? UserAvatarUrl { get; set; }
}