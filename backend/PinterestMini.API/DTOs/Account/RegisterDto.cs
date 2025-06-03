using System.ComponentModel.DataAnnotations;

namespace PinterestMini.API.DTOs.Account;

public class RegisterDto
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}