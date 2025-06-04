using System.ComponentModel.DataAnnotations;

namespace PinterestMini.API.DTOs.Account;

public class LoginDto
{
    public string Login { get; set; }
    public string Password { get; set; }
}