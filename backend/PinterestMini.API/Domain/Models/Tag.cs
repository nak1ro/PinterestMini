namespace PinterestMini.API.Domain.Models;

public class Tag
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int UsageCount { get; set; } = 0;
    public ICollection<PinTag> PinTags { get; set; }
}
