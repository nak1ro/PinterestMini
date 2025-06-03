using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Helpers;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Models;

namespace PinterestMini.API.Repositories;

public class PinRepository : IPinRepository
{
    private readonly ApplicationDbContext _context;

    public PinRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Pin?> GetByIdWithTagsAndBoardsAsync(Guid id)
    {
        return await _context.Pins
            .Include(p => p.PinTags).ThenInclude(pt => pt.Tag)
            .Include(p => p.PinBoards).ThenInclude(pb => pb.Board)
            .FirstOrDefaultAsync(p => p.Id == id);
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