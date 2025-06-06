using System.ComponentModel.DataAnnotations.Schema;

namespace PinterestMini.API.Domain.Models;

public class Comment
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    public Guid PinId { get; set; }
    [ForeignKey("PinId")]
    public Pin Pin { get; set; }
}
