using Microsoft.AspNetCore.Identity;

namespace PinterestMini.API.Domain.Models;

public class User: IdentityUser<Guid>
{
    public string? Name { get; set; }
    public string? ProfilePictureUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? Bio { get; set; }

    public ICollection<Board> Boards { get; set; }
    public ICollection<Pin> Pins { get; set; }
    public ICollection<Comment> Comments { get; set; }
    public ICollection<Like> Likes { get; set; }

    public ICollection<Follow> Followers { get; set; }
    public ICollection<Follow> Following { get; set; }
    public ICollection<SavedPin> SavedPins { get; set; }
}