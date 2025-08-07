using System.Security.Claims;
using PinterestMini.API.DTOs.Account;

namespace PinterestMini.API.Domain.Interfaces.Follow;

public interface IFollowService
{
    Task FollowAsync(Guid targetUserId, ClaimsPrincipal currentUser);
    Task UnfollowAsync(Guid targetUserId, ClaimsPrincipal currentUser);
    Task<bool> IsFollowingAsync(Guid targetUserId, ClaimsPrincipal currentUser);
    Task<int> GetFollowersCountAsync(Guid userId);
    Task<int> GetFollowingCountAsync(Guid userId);
    Task<List<UserProfileDto>> GetFollowersAsync(Guid userId);
    Task<List<UserProfileDto>> GetFollowingAsync(Guid userId);
}