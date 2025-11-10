using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.PinBoards;

public interface IPinBoardRepository
{
    Task<bool> ExistsAsync(Guid pinId, Guid boardId, Guid userId);
    Task AddAsync(PinBoard pinBoard);
    Task RemoveAsync(Guid pinId, Guid boardId, Guid userId);
    Task<List<Board>> GetBoardsForPinAsync(Guid pinId, Guid? userId = null);
}