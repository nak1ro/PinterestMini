using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PinController : ControllerBase
{
    private readonly IPinService _pinService;

    public PinController(IPinService pinService)
    {
        _pinService = pinService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreatePinDto dto)
    {
        var pinId = await _pinService.CreatePinAsync(dto, User);
        return CreatedAtAction(nameof(GetById), new { id = pinId }, new { id = pinId });
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdatePinDto dto)
    {
        await _pinService.UpdatePinAsync(id, dto, User);
        return NoContent();
    }

    // (Optional) Get method to support CreatedAtAction
    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public IActionResult GetById(Guid id)
    {
        // You can implement this later
        return Ok(new { message = "Coming soon." });
    }
}