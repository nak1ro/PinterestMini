using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Domain.Interfaces.Auth;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Middlewares;

namespace PinterestMini.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AuthService(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService, IMapper mapper)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;¶
        _mapper = mapper;
    }

    public async Task<NewUserDto> RegisterAsync(RegisterDto dto)
    {
        var existingUserByEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUserByEmail != null)
            throw new AppBadRequestException("This email is already in use.");

        var user = new User { UserName = dto.Username, Email = dto.Email };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errorMessages = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new AppBadRequestException(errorMessages);
        }

        await _userManager.AddToRoleAsync(user, "User");

        return new NewUserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = await _tokenService.CreateToken(user)
        };
    }

    public async Task<NewUserDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.UserName == dto.Login || u.Email == dto.Login);

        if (user == null)
            throw new AppUnauthorizedException("Invalid username or email");

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            throw new AppUnauthorizedException("Invalid credentials");

        return new NewUserDto
        {
            Username = user.UserName,
            Email = user.Email,
            Token = await _tokenService.CreateToken(user)
        };
    }

    public async Task<User> GetUserByLoginAsync(string login)
    {
        if (string.IsNullOrWhiteSpace(login))
            throw new AppBadRequestException("Login (username or email) must be provided.");

        var user = await _userManager.FindByNameAsync(login)
                   ?? await _userManager.FindByEmailAsync(login);

        if (user == null)
            throw new AppNotFoundException("User not found.");

        return user;
    }

    public async Task<UserProfileDto> GetUserProfileByUsernameAsync(string username)
    {
        var user = await _userManager.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
            throw new AppNotFoundException("User not found.");

        return _mapper.Map<UserProfileDto>(user);
    }
}
