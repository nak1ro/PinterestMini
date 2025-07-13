using System.Security.Claims;

namespace PinterestMini.API.Domain.Interfaces.Follow;

public interface IFollowService
{
    Task FollowAsync(Guid targetUserId, ClaimsPrincipal currentUser);
    Task UnfollowAsync(Guid targetUserId, ClaimsPrincipal currentUser);
    Task<bool> IsFollowingAsync(Guid targetUserId, ClaimsPrincipal currentUser);
}