using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class BoardRepository : IBoardRepository
{
    private readonly ApplicationDbContext _context;

    public BoardRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Board>> GetByIdsAsync(List<Guid> boardIds)
    {
        return await _context.Boards
            .Where(b => boardIds.Contains(b.Id))
            .ToListAsync();
    }

    public async Task<Board?> GetByIdAsync(Guid boardId)
    {
        return await _context.Boards
            .FirstOrDefaultAsync(b => b.Id == boardId);
    }

    public async Task AddAsync(Board board)
    {
        await _context.Boards.AddAsync(board);
    }

    public void Delete(Board board)
    {
        _context.Boards.Remove(board);
    }

    public async Task<List<Board>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Boards
            .Include(b => b.User)
            .Where(b => b.UserId == userId)
            .ToListAsync();
    }

    public async Task<List<Board>> GetPublicBoardsByUserIdAsync(Guid userId)
    {
        return await _context.Boards
            .Include(b => b.User)
            .Where(b => b.UserId == userId && !b.IsPrivate)
            .ToListAsync();
    }
    
    public async Task<List<Pin>> GetPinsForBoardByUserAsync(Guid boardId, Guid userId)
    {
        return await _context.PinBoards
            .Where(pb => pb.BoardId == boardId && pb.UserId == userId)
            .Include(pb => pb.Pin)
            .Select(pb => pb.Pin)
            .ToListAsync();
    }
}