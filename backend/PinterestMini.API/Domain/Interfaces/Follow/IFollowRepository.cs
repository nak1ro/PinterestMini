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
}