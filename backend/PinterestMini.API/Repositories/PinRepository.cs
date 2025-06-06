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
        return await _context.SavedPins
            .Where(sp => sp.UserId == userId)
            .OrderByDescending(sp => sp.SavedAt)
            .Select(sp => sp.Pin)
            .Include(p => p.Owner)
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .ToListAsync();
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