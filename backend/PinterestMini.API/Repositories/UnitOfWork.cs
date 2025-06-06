using PinterestMini.API.Data;
using System.Threading.Tasks;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Tags;

namespace PinterestMini.API.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ApplicationDbContext _context;

    public IPinRepository Pins { get; }
    public ITagRepository Tags { get; }
    public IBoardRepository Boards { get; }
    public ICommentRepository Comments { get; set; }

    public UnitOfWork(ApplicationDbContext context, IPinRepository pins, ITagRepository tags, IBoardRepository boards,
        ICommentRepository comments)
    {
        _context = context;
        Pins = pins;
        Tags = tags;
        Boards = boards;
        Comments = comments;
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}