namespace PinterestMini.API.DTOs.Pins;

public class OwnerDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = null!;
    public string? ProfilePictureUrl { get; set; }
}