using System.ComponentModel.DataAnnotations;

namespace PinterestMini.API.DTOs.Account;

public class LoginDto
{
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }
}