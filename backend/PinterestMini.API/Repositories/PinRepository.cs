using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.Helpers;

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

        var savedIds = await _context.SavedPins
            .Where(sp => sp.UserId == userId)
            .Select(sp => sp.PinId)
            .ToListAsync();
        
        return await _context.Pins
            .Where(p =>
                savedIds.Contains(p.Id) &&
                (
                    p.Title.ToLower().Contains(query.ToLower()) ||
                    p.Description.ToLower().Contains(query.ToLower()) ||
                    p.PinTags.Any(pt => pt.Tag.Name.ToLower().Contains(query.ToLower()))
                )
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
        return await _context.Pins
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
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
        query = query.Trim().ToLower();

        return await _context.Pins
            .Where(p =>
                p.Title.Contains(query) ||
                p.Description.Contains(query) ||
                p.PinTags.Any(pt => pt.Tag.Name.Contains(query))
            )
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .OrderByDescending(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
    }


    public async Task<List<Pin>> GetPinsByTagNameAsync(string tagName)
    {
        return await _context.Pins
            .Where(p => p.PinTags.Any(pt => pt.Tag.Name.ToLower() == tagName.ToLower()))
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
        var pinIds = await _context.SavedPins
            .Where(sp => sp.UserId == userId)
            .OrderByDescending(sp => sp.SavedAt)
            .Select(sp => sp.PinId)
            .ToListAsync();

        return await _context.Pins
            .Where(p => pinIds.Contains(p.Id))
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .OrderByDescending(p => pinIds.IndexOf(p.Id)) // Preserve saved order
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
}