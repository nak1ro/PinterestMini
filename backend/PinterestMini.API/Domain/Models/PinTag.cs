namespace PinterestMini.API.Domain.Models;

public class PinTag
{
    public Guid PinId { get; set; }
    public Pin Pin { get; set; }

    public Guid TagId { get; set; }
    public Tag Tag { get; set; }
}