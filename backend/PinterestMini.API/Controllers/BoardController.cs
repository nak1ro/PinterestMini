using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.DTOs.Boards;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BoardController : ControllerBase
{
    private readonly IBoardService _boardService;

    public BoardController(IBoardService boardService)
    {
        _boardService = boardService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateBoard([FromForm] CreateBoardDto dto)
    {
        var boardId = await _boardService.CreateBoardAsync(dto, User);
        return CreatedAtAction(nameof(GetMyBoards), new { id = boardId }, new { id = boardId });
    }

    [HttpPut("{boardId:guid}")]
    [Authorize]
    public async Task<IActionResult> UpdateBoard([FromRoute] Guid boardId, [FromForm] UpdateBoardDto dto)
    {
        await _boardService.UpdateBoardAsync(boardId, dto, User);
        return NoContent();
    }

    [HttpDelete("{boardId:guid}")]
    [Authorize]
    public async Task<IActionResult> DeleteBoard([FromRoute] Guid boardId)
    {
        await _boardService.DeleteBoardAsync(boardId, User);
        return NoContent();
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetMyBoards()
    {
        var boards = await _boardService.GetMyBoardsAsync(User);
        return Ok(boards);
    }

    [HttpGet("user/{userId:guid}")]
    public async Task<IActionResult> GetBoardsByUser([FromRoute] Guid userId)
    {
        var boards = await _boardService.GetBoardsByUserAsync(userId);
        return Ok(boards);
    }

    [HttpGet("{boardId:guid}/pins-count")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPinsCount(Guid boardId)
    {
        var count = await _boardService.GetPinsCountAsync(boardId);
        return Ok(new { count });
    }
    
    [HttpGet("{boardId:guid}/pins")]
    [AllowAnonymous]
    public async Task<IActionResult> GetPinsOfBoard([FromRoute] Guid boardId)
    {
        var pins = await _boardService.GetPinsOfBoardAsync(boardId, User);
        return Ok(pins);
    }

    [HttpPost("{boardId:guid}/pins/{pinId:guid}")]
    [Authorize]
    public async Task<IActionResult> SavePinToBoard([FromRoute] Guid boardId, [FromRoute] Guid pinId)
    {
        await _boardService.SavePinToBoardAsync(boardId, pinId, User);
        return Ok(new { message = "Pin saved to board successfully." });
    }

    [HttpDelete("{boardId:guid}/pins/{pinId:guid}")]
    [Authorize]
    public async Task<IActionResult> RemovePinFromBoard([FromRoute] Guid boardId, [FromRoute] Guid pinId)
    {
        await _boardService.RemovePinFromBoardAsync(boardId, pinId, User);
        return Ok(new { message = "Pin removed from board successfully." });
    }
}