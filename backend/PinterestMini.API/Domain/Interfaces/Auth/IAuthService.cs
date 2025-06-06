using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Account;

namespace PinterestMini.API.Domain.Interfaces.Auth;

public interface IAuthService
{
    public Task<NewUserDto> RegisterAsync(RegisterDto dto);
    public Task<NewUserDto> LoginAsync(LoginDto dto);
    Task<User> GetUserByLoginAsync(string login);
}