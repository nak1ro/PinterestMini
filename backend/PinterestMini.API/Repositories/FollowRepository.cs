using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Follow;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class FollowRepository : IFollowRepository
{
    private readonly ApplicationDbContext _context;

    public FollowRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(Guid followerId, Guid followingId)
    {
        return await _context.Follows.AnyAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId);
    }

    public async Task<Follow?> GetAsync(Guid followerId, Guid followingId)
    {
        return await _context.Follows.FirstOrDefaultAsync(f =>
            f.FollowerId == followerId && f.FollowingId == followingId);
    }

    public async Task AddAsync(Follow follow)
    {
        await _context.Follows.AddAsync(follow);
    }

    public async Task RemoveAsync(Follow follow)
    {
        _context.Follows.Remove(follow);
    }

    public async Task<List<Guid>> GetFollowingIdsAsync(Guid userId)
    {
        return await _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId)
            .ToListAsync();
    }

    public async Task<int> GetFollowersCountAsync(Guid userId)
    {
        return await _context.Follows.CountAsync(f => f.FollowingId == userId);
    }

    public async Task<int> GetFollowingCountAsync(Guid userId)
    {
        return await _context.Follows.CountAsync(f => f.FollowerId == userId);
    }
}
