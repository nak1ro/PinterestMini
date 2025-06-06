using System.ComponentModel.DataAnnotations.Schema;

namespace PinterestMini.API.Domain.Models;

public class Pin
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string? Description { get; set; }
    public string ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool AllowComments { get; set; }

    public Guid OwnerId { get; set; }
    [ForeignKey("OwnerId")]
    public User Owner { get; set; }

    public ICollection<Comment> Comments { get; set; }
    public ICollection<Like> Likes { get; set; }
    public ICollection<PinBoard> PinBoards { get; set; }
    public ICollection<PinTag> PinTags { get; set; }
    public ICollection<SavedPin> SavedPins { get; set; }
}