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
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (isSuccess, errors, user) = await _authService.RegisterAsync(dto);
        if (!isSuccess) return BadRequest(errors);

        return Ok(user);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var (isSuccess, errorMessage, user) = await _authService.LoginAsync(dto);
        if (!isSuccess) return Unauthorized(errorMessage);

        return Ok(user);
    }
}