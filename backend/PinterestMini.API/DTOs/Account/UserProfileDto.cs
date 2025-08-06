namespace PinterestMini.API.DTOs.Account;

public class UserProfileDto
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public string? DisplayName { get; set; } // ← from User.Name
    public string? ProfilePictureUrl { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
}