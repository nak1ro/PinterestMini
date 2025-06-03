using PinterestMini.API.Data;
using PinterestMini.API.Interfaces;
using System.Threading.Tasks;
using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Interfaces.Tags;

namespace PinterestMini.API.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IPinRepository Pins { get; }
    public ITagRepository Tags { get; }
    public IBoardRepository Boards { get; }

    public UnitOfWork(ApplicationDbContext context,
        IPinRepository pins,
        ITagRepository tags,
        IBoardRepository boards)
    {
        _context = context;
        Pins = pins;
        Tags = tags;
        Boards = boards;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}
