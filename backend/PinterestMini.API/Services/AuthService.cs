using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Models;

namespace PinterestMini.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    public async Task<(bool IsSuccess, IEnumerable<IdentityError>? Errors, NewUserDto? User)> RegisterAsync(RegisterDto dto)
    {
        var user = new User { UserName = dto.Username, Email = dto.Email };
        var userResult = await _userManager.CreateAsync(user, dto.Password);
        if (!userResult.Succeeded) return (false, userResult.Errors, null);

        await _userManager.AddToRoleAsync(user, "User");

        var userDto = new NewUserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = await _tokenService.CreateToken(user)
        };

        return (true, null, userDto);
    }

    public async Task<(bool IsSuccess, string? ErrorMessage, NewUserDto? User)> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == dto.Username);
        if (user == null) return (false, "Invalid username", null);

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded) return (false, "Invalid credentials", null);

        var userDto = new NewUserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = await _tokenService.CreateToken(user)
        };

        return (true, null, userDto);
    }
}
