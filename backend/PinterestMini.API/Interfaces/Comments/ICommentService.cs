using System.Security.Claims;
using PinterestMini.API.DTOs.Comments;

namespace PinterestMini.API.Interfaces.Comments;

public interface ICommentService
{
    Task<Guid> CreateCommentAsync(Guid pinId, CreateCommentDto dto, ClaimsPrincipal user);
    Task UpdateCommentAsync(Guid commentId, UpdateCommentDto dto, ClaimsPrincipal user);
    Task DeleteCommentAsync(Guid commentId, ClaimsPrincipal user);
    Task<IEnumerable<CommentDto>> GetCommentsForPinAsync(Guid pinId, int page, int pageSize);
}