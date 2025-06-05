using Microsoft.AspNetCore.Identity;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces;

public interface IAuthService
{
    public Task<NewUserDto> RegisterAsync(RegisterDto dto);
    public Task<NewUserDto> LoginAsync(LoginDto dto);
    Task<User> GetUserByLoginAsync(string login);
}