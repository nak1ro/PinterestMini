namespace PinterestMini.API.DTOs.Account;

public class NewUserDto
{
    public Guid Id { get; set; } 
    public string Username { get; set; }
    public string Email { get; set; }
    public string ProfilePictureUrl { get; set; } 
    public string Token { get; set; }
}