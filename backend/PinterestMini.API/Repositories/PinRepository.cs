using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.EF;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class PinRepository : IPinRepository
{
    private readonly ApplicationDbContext _context;

    public PinRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(Guid userId)
    {
        return await _context.Users.AnyAsync(u => u.Id == userId);
    }

    public async Task<Pin?> GetByIdAsync(Guid id)
    {
        return await _context.Pins.FindAsync(id);
    }

    public async Task<Pin?> GetByIdWithTagsAndBoardsAsync(Guid id)
    {
        return await _context.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<Pin?> GetByIdWithAllRelationsAsync(Guid id)
    {
        return await _context.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards)
            .Include(p => p.Comments)
            .Include(p => p.Likes)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Pin>> GetPinsByOwnerAsync(Guid ownerId)
    {
        return await _context.Pins
            .Where(p => p.OwnerId == ownerId)
            .OrderByDescending(p => p.CreatedAt)
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .ToListAsync();
    }

    public async Task<List<Pin>> SearchSavedPinsAsync(Guid userId, string query, int page, int pageSize)
    {
        query = query.Trim().ToLower();
        var skip = (page - 1) * pageSize;

        // Use join instead of loading IDs into memory for better performance
        return await _context.SavedPins
            .Where(sp => sp.UserId == userId)
            .Join(_context.Pins, sp => sp.PinId, p => p.Id, (sp, p) => p)
            .Where(p =>
                Functions.Like(p.Title, $"%{query}%") ||
                (p.Description != null && Functions.Like(p.Description, $"%{query}%")) ||
                p.PinTags.Any(pt => Functions.Like(pt.Tag.Name, $"%{query}%"))
            )
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
    }


    public async Task<IEnumerable<Pin>> GetRecentPublicPinsAsync(int page, int pageSize)
    {
        // Include before Skip/Take for better query optimization
        return await _context.Pins
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }

    public async Task<List<Pin>> GetPinsCreatedByFollowedUsersAsync(Guid userId, int page, int pageSize)
    {
        var skip = (page - 1) * pageSize;

        var followedIds = _context.Follows
            .Where(f => f.FollowerId == userId)
            .Select(f => f.FollowingId);

        return await _context.Pins
            .Where(p => followedIds.Contains(p.OwnerId))
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(pageSize + 1)
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .ToListAsync();
    }

    public async Task<List<Pin>> SearchPublicPinsAsync(string query, int page, int pageSize)
    {
        query = query.Trim();
        var skip = (page - 1) * pageSize;

        return await _context.Pins
            .Where(p =>
                Functions.Like(p.Title, $"%{query}%") ||
                (p.Description != null && Functions.Like(p.Description, $"%{query}%")) ||
                p.PinTags.Any(pt => Functions.Like(pt.Tag.Name, $"%{query}%"))
            )
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(pageSize)
            .ToListAsync();
    }


    public async Task<List<Pin>> GetPinsByTagNameAsync(string tagName)
    {
        var normalizedTagName = tagName.Trim().ToLower();
        return await _context.Pins
            .Where(p => p.PinTags.Any(pt => pt.Tag.Name.ToLower() == normalizedTagName))
            .Include(p => p.PinTags)
            .ThenInclude(pt => pt.Tag)
            .Include(p => p.Owner)
            .Include(p => p.PinBoards)
            .ThenInclude(pb => pb.Board)
            .ToListAsync();
    }

    public async Task<bool> IsPinSavedAsync(Guid userId, Guid pinId)
    {
        return await _context.SavedPins
            .AnyAsync(sp => sp.UserId == userId && sp.PinId == pinId);
    }

    public async Task SavePinAsync(Guid userId, Guid pinId)
    {
        if (!await IsPinSavedAsync(userId, pinId))
        {
            var saved = new SavedPin
            {
                UserId = userId,
                PinId = pinId,
                SavedAt = DateTime.UtcNow
            };

            await _context.SavedPins.AddAsync(saved);
        }
    }

    public async Task UnsavePinAsync(Guid userId, Guid pinId)
    {
        var saved = await _context.SavedPins
            .FirstOrDefaultAsync(sp => sp.UserId == userId && sp.PinId == pinId);

        if (saved != null)
        {
            _context.SavedPins.Remove(saved);
        }
    }

    public async Task<IEnumerable<Pin>> GetSavedPinsAsync(Guid userId)
    {
        var query =
            from sp in _context.SavedPins
            where sp.UserId == userId
            join p in _context.Pins on sp.PinId equals p.Id
            orderby sp.SavedAt descending
            select p;

        return await query
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .ToListAsync();
    }


    public async Task<int> GetLikeCountAsync(Guid pinId)
    {
        return await _context.Likes
            .CountAsync(l => l.PinId == pinId);
    }

    public async Task<bool> IsPinLikedByUserAsync(Guid pinId, Guid userId)
    {
        return await _context.Likes
            .AnyAsync(l => l.PinId == pinId && l.UserId == userId);
    }

    public async Task LikePinAsync(Guid pinId, Guid userId)
    {
        var like = new Like
        {
            PinId = pinId,
            UserId = userId,
            LikedAt = DateTime.UtcNow
        };

        await _context.Likes.AddAsync(like);
    }

    public async Task UnlikePinAsync(Guid pinId, Guid userId)
    {
        var like = await _context.Likes
            .FirstOrDefaultAsync(l => l.PinId == pinId && l.UserId == userId);

        if (like != null)
            _context.Likes.Remove(like);
    }


    public async Task AddAsync(Pin pin)
    {
        await _context.Pins.AddAsync(pin);
    }

    public void Update(Pin pin)
    {
        _context.Pins.Update(pin);
    }

    public void Delete(Pin pin)
    {
        _context.Pins.Remove(pin);
    }

    public async Task DeletePinBoardsAsync(Guid pinId)
    {
        var pinBoards = await _context.PinBoards
            .Where(pb => pb.PinId == pinId)
            .ToListAsync();
        
        _context.PinBoards.RemoveRange(pinBoards);
    }

    public async Task DeleteCommentsAsync(Guid pinId)
    {
        var comments = await _context.Comments
            .Where(c => c.PinId == pinId)
            .ToListAsync();
        
        _context.Comments.RemoveRange(comments);
    }

    public async Task DeleteLikesAsync(Guid pinId)
    {
        var likes = await _context.Likes
            .Where(l => l.PinId == pinId)
            .ToListAsync();
        
        _context.Likes.RemoveRange(likes);
    }

    public async Task DeletePinTagsAsync(Guid pinId)
    {
        var pinTags = await _context.PinTags
            .Where(pt => pt.PinId == pinId)
            .ToListAsync();
        
        _context.PinTags.RemoveRange(pinTags);
    }

    public Task<bool> AnyAsync(Expression<Func<SavedPin, bool>> predicate) =>
        _context.SavedPins.AnyAsync(predicate);
}