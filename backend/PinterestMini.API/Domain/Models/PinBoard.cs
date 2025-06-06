namespace PinterestMini.API.Domain.Models;

public class PinBoard
{
    public Guid BoardId { get; set; }
    public Board Board { get; set; }

    public Guid PinId { get; set; }
    public Pin Pin { get; set; }
}