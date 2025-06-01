namespace PinterestMini.API.Models;

public class Board
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; }

    public ICollection<PinBoard> PinBoards { get; set; }
}