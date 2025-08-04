using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Follow;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/follow")]
public class FollowController : ControllerBase
{
    private readonly IFollowService _followService;

    public FollowController(IFollowService followService)
    {
        _followService = followService;
    }

    [HttpPost("{targetUserId:guid}")]
    [Authorize]
    public async Task<IActionResult> Follow(Guid targetUserId)
    {
        await _followService.FollowAsync(targetUserId, User);
        return Ok(new { message = "Followed successfully." });
    }

    [HttpDelete("{targetUserId:guid}")]
    [Authorize]
    public async Task<IActionResult> Unfollow(Guid targetUserId)
    {
        await _followService.UnfollowAsync(targetUserId, User);
        return Ok(new { message = "Unfollowed successfully." });
    }

    [HttpGet("{targetUserId:guid}/check")]
    [Authorize]
    public async Task<IActionResult> IsFollowing(Guid targetUserId)
    {
        var isFollowing = await _followService.IsFollowingAsync(targetUserId, User);
        return Ok(new { isFollowing });
    }
    
    [HttpGet("{userId:guid}/followers-count")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFollowersCount(Guid userId)
    {
        var count = await _followService.GetFollowersCountAsync(userId);
        return Ok(new { count });
    }

    [HttpGet("{userId:guid}/following-count")]
    [AllowAnonymous]
    public async Task<IActionResult> GetFollowingCount(Guid userId)
    {
        var count = await _followService.GetFollowingCountAsync(userId);
        return Ok(new { count });
    }
}
