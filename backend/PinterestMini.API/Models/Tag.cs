namespace PinterestMini.API.Models;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; }

    public ICollection<PinTag> PinTags { get; set; }
}
