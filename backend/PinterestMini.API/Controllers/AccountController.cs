using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Models;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/account")]
public class AccountController : ControllerBase
{
    private readonly IAuthService _authService;

    public AccountController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var userDto = await _authService.RegisterAsync(dto);
        return Ok(userDto);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var userDto = await _authService.LoginAsync(dto);
        return Ok(userDto);
    }
}