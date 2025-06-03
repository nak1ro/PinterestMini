using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Models;

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
}