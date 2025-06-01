namespace PinterestMini.API.Models;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid PinId { get; set; }
    public Pin Pin { get; set; }
}
