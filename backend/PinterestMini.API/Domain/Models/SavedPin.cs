namespace PinterestMini.API.Domain.Models;

public class SavedPin
{
    public Guid UserId { get; set; }
    public User User { get; set; }

    public Guid PinId { get; set; }
    public Pin Pin { get; set; }

    public DateTime SavedAt { get; set; }
}