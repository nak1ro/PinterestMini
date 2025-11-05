namespace PinterestMini.API.DTOs.Account;

public class UpdateProfileDto
{
    public string? Name { get; set; }
    public string? Bio { get; set; }
    public IFormFile? ProfilePicture { get; set; }
}
