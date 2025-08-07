using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Follow;

public interface IFollowRepository
{
    Task<bool> ExistsAsync(Guid followerId, Guid followingId);
    Task AddAsync(Models.Follow follow);
    Task RemoveAsync(Models.Follow follow);
    Task<Models.Follow?> GetAsync(Guid followerId, Guid followingId);
    Task<List<Guid>> GetFollowingIdsAsync(Guid userId);
    Task<int> GetFollowersCountAsync(Guid userId);
    Task<int> GetFollowingCountAsync(Guid userId);
    Task<List<User>> GetFollowersAsync(Guid userId);
    Task<List<User>> GetFollowingAsync(Guid userId);
}