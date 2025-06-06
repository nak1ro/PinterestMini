using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.DTOs.Common;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PinController : ControllerBase
{
    private readonly IPinService _pinService;

    public PinController(IPinService pinService)
    {
        _pinService = pinService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromForm] CreatePinDto dto)
    {
        var pinId = await _pinService.CreatePinAsync(dto, User);
        return CreatedAtAction(nameof(GetById), new { id = pinId }, new { id = pinId });
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Update(Guid id, [FromForm] UpdatePinDto dto)
    {
        await _pinService.UpdatePinAsync(id, dto, User);
        return NoContent();
    }

    [HttpGet("feed")]
    [AllowAnonymous]
    public async Task<ActionResult<PaginatedResult<PinDto>>> GetRecentFeed([FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _pinService.GetRecentPinsPaginatedAsync(page, pageSize);
        return Ok(result);
    }

    [HttpPost("{pinId:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Save(Guid pinId)
    {
        await _pinService.SavePinAsync(pinId, User);
        return Ok(new { message = "Pin saved successfully." });
    }

    [HttpDelete("{pinId:guid}/save")]
    [Authorize]
    public async Task<IActionResult> Unsave(Guid pinId)
    {
        await _pinService.UnsavePinAsync(pinId, User);
        return Ok(new { message = "Pin unsaved successfully." });
    }

    [HttpGet("saved")]
    [Authorize]
    public async Task<ActionResult<List<PinDto>>> GetSavedPins()
    {
        return Ok(await _pinService.GetSavedPinsAsync(User));
    }

    [HttpPost("{pinId:guid}/boards/{boardId:guid}")]
    [Authorize]
    public async Task<IActionResult> AssignToBoard(Guid pinId, Guid boardId)
    {
        await _pinService.AssignPinToBoardAsync(pinId, boardId, User);
        return NoContent();
    }
    
    [Authorize]
    [HttpGet("check")]
    public IActionResult Check()
    {
        return Ok("Token is valid and you are authenticated.");
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