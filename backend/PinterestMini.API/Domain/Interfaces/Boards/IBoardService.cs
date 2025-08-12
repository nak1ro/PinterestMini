using System.Security.Claims;
using PinterestMini.API.DTOs.Boards;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Domain.Interfaces.Boards;

public interface IBoardService
{
    Task<Guid> CreateBoardAsync(CreateBoardDto dto, ClaimsPrincipal user);
    Task UpdateBoardAsync(Guid boardId, UpdateBoardDto dto, ClaimsPrincipal user);
    Task DeleteBoardAsync(Guid boardId, ClaimsPrincipal user);
    Task<IEnumerable<BoardDto>> GetMyBoardsAsync(ClaimsPrincipal user);
    Task<int> GetPinsCountAsync(Guid boardId);
    Task<IEnumerable<PinDto>> GetPinsForBoardAsync(Guid boardId, ClaimsPrincipal user);
    Task<IEnumerable<BoardDto>> GetBoardsByUserAsync(Guid userId);
}