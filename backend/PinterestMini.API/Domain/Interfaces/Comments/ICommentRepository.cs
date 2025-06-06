using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Comments;

public interface ICommentRepository
{
    Task AddAsync(Comment comment);
    Task<Comment?> GetByIdWithUserAsync(Guid commentId);
    Task<Comment?> GetByIdWithUserAndPinAsync(Guid commentId);
    Task<IEnumerable<Comment>> GetForPinPaginatedAsync(Guid pinId, int page, int pageSize);
    void Remove(Comment comment);
    void Update(Comment comment);
}