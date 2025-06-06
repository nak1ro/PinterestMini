namespace PinterestMini.API.Domain.Models;

public class Like
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid PinId { get; set; }
    public Pin Pin { get; set; }

    public DateTime LikedAt { get; set; }
}