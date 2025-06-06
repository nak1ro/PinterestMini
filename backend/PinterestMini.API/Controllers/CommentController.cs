using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.DTOs.Comments;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/pin/{pinId:guid}/comments")]
public class CommentController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    // Create comment
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromRoute] Guid pinId, [FromBody] CreateCommentDto dto)
    {
        var commentId = await _commentService.CreateCommentAsync(pinId, dto, User);
        return CreatedAtAction(nameof(GetForPin), new { pinId }, new { commentId });
    }

    // Get comments for a pin (paginated)
    [HttpGet]
    public async Task<IActionResult> GetForPin([FromRoute] Guid pinId, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var comments = await _commentService.GetCommentsForPinAsync(pinId, page, pageSize);
        return Ok(comments);
    }

    // Update comment
    [HttpPut("{commentId:guid}")]
    [Authorize]
    public async Task<IActionResult> Update([FromRoute] Guid commentId, [FromBody] UpdateCommentDto dto)
    {
        await _commentService.UpdateCommentAsync(commentId, dto, User);
        return NoContent();
    }

    // Delete comment
    [HttpDelete("{commentId:guid}")]
    [Authorize]
    public async Task<IActionResult> Delete([FromRoute] Guid commentId)
    {
        await _commentService.DeleteCommentAsync(commentId, User);
        return NoContent();
    }
}