using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class CommentRepository : ICommentRepository
{
    private readonly ApplicationDbContext _context;

    public CommentRepository(ApplicationDbContext context)
    {
        _context = context;
    }


    public async Task AddAsync(Comment comment)
    {
        await _context.Comments.AddAsync(comment);
    }

    public async Task<Comment?> GetByIdWithUserAndPinAsync(Guid commentId)
    {
        return await _context.Comments
            .Include(c => c.User)
            .Include(c => c.Pin)
            .FirstOrDefaultAsync(c => c.Id == commentId);
    }

    public async Task<Comment?> GetByIdWithUserAsync(Guid commentId)
    {
        return await _context.Comments
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.Id == commentId);
    }

    public async Task<IEnumerable<Comment>> GetForPinPaginatedAsync(Guid pinId, int page, int pageSize)
    {
        return await _context.Comments
            .Where(c => c.PinId == pinId)
            .OrderByDescending(c => c.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Include(c => c.User)
            .ToListAsync();
    }

    public void Remove(Comment comment)
    {
        _context.Comments.Remove(comment);
    }

    public void Update(Comment comment)
    {
        _context.Comments.Update(comment);
    }
}