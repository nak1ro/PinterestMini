using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.PinBoards;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class PinBoardRepository : IPinBoardRepository
{
    private readonly ApplicationDbContext _context;

    public PinBoardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ExistsAsync(Guid pinId, Guid boardId, Guid userId)
    {
        return await _context.PinBoards.AnyAsync(pb =>
            pb.PinId == pinId && pb.BoardId == boardId && pb.UserId == userId);
    }

    public async Task AddAsync(PinBoard pinBoard)
    {
        await _context.PinBoards.AddAsync(pinBoard);
    }

    public async Task RemoveAsync(Guid pinId, Guid boardId, Guid userId)
    {
        var entry = await _context.PinBoards.FirstOrDefaultAsync(pb =>
            pb.PinId == pinId && pb.BoardId == boardId && pb.UserId == userId);

        if (entry != null)
            _context.PinBoards.Remove(entry);
    }

    public async Task<List<Board>> GetBoardsForPinAsync(Guid pinId)
    {
        return await _context.PinBoards
            .Where(pb => pb.PinId == pinId)
            .Include(pb => pb.Board)
            .ThenInclude(b => b.User)
            .Select(pb => pb.Board)
            .Distinct()
            .ToListAsync();
    }
}