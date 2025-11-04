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
    
    [HttpDelete("{id:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _pinService.DeletePinAsync(id, User);
        return NoContent();
    }

    [HttpGet("{pinId:guid}/boards")]
    [AllowAnonymous]
    public async Task<IActionResult> GetBoardsForPin(Guid pinId)
    {
        var boards = await _pinService.GetBoardsForPinAsync(pinId);
        return Ok(boards);
    }

    [HttpPut("{pinId:guid}/boards")]
    [Authorize]
    public async Task<IActionResult> SetBoardsForPin(Guid pinId, [FromBody] SetPinBoardsDto dto)
    {
        await _pinService.SetBoardsForPinAsync(pinId, dto.BoardIds, User);
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

    [HttpGet("search")]
    [AllowAnonymous]
    public async Task<ActionResult<PaginatedResult<PinDto>>> SearchPins(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { error = "Query cannot be empty", status = 400 });

        var result = await _pinService.SearchPinsAsync(query, page, pageSize);
        return Ok(result);
    }

    [HttpGet("saved/search")]
    [Authorize]
    public async Task<ActionResult<PaginatedResult<PinDto>>> SearchSavedPins(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest(new { error = "Query cannot be empty" });

        var result = await _pinService.SearchSavedPinsAsync(query, User, page, pageSize);
        return Ok(result);
    }

    [HttpGet("followed")]
    [Authorize]
    public async Task<ActionResult<PaginatedResult<PinDto>>> GetFollowedCreatorsFeed(
        [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        var result = await _pinService.GetFollowedCreatorsFeedAsync(User, page, pageSize);
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

    [HttpGet("mine")]
    [Authorize]
    public async Task<ActionResult<List<PinDto>>> GetMyPins()
    {
        return Ok(await _pinService.GetMyPinsAsync(User));
    }

    [Authorize]
    [HttpGet("check")]
    public IActionResult Check()
    {
        return Ok("Token is valid and you are authenticated.");
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    public async Task<ActionResult<PinDto>> GetById(Guid id)
    {
        var pin = await _pinService.GetByIdAsync(id);
        return Ok(pin);
    }
    
    [HttpGet("{pinId:guid}/likes/count")]
    [AllowAnonymous]
    public async Task<IActionResult> GetLikeCount(Guid pinId)
    {
        var count = await _pinService.GetLikeCountAsync(pinId);
        return Ok(new { count });
    }

    [HttpGet("{pinId:guid}/likes/is-liked")]
    [Authorize]
    public async Task<IActionResult> IsLiked(Guid pinId)
    {
        var isLiked = await _pinService.IsPinLikedAsync(pinId, User);
        return Ok(new { isLiked });
    }

    [HttpPost("{pinId:guid}/likes")]
    [Authorize]
    public async Task<IActionResult> Like(Guid pinId)
    {
        await _pinService.LikePinAsync(pinId, User);
        return Ok(new { message = "Pin liked successfully." });
    }

    [HttpDelete("{pinId:guid}/likes")]
    [Authorize]
    public async Task<IActionResult> Unlike(Guid pinId)
    {
        await _pinService.UnlikePinAsync(pinId, User);
        return Ok(new { message = "Pin unliked successfully." });
    }
    [HttpGet("{pinId:guid}/saved/is-saved")]
    [Authorize]
    public async Task<IActionResult> IsSaved(Guid pinId)
    {
        var isSaved = await _pinService.IsPinSavedAsync(pinId, User);
        return Ok(new { isSaved });
    }
}