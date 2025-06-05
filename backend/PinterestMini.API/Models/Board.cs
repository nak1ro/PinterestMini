using System.ComponentModel.DataAnnotations.Schema;

namespace PinterestMini.API.Models;

public class Board
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPrivate { get; set; }  
    public string? CoverImageUrl { get; set; } 

    public Guid UserId { get; set; }
    [ForeignKey("UserId")]
    public User User { get; set; }

    public ICollection<PinBoard> PinBoards { get; set; } = new List<PinBoard>();
}