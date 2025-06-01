using Microsoft.AspNetCore.Identity;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces;

public interface IAuthService
{
    Task<(bool IsSuccess, IEnumerable<IdentityError>? Errors, NewUserDto? User)> RegisterAsync(RegisterDto dto);
    Task<(bool IsSuccess, string? ErrorMessage, NewUserDto? User)> LoginAsync(LoginDto dto);
}