using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Boards;

public interface IBoardRepository
{
    Task<List<Board>> GetByIdsAsync(List<Guid> boardIds);
    Task<Board?> GetByIdAsync(Guid boardId);
    Task AddAsync(Board board);
    void Delete(Board board);
    Task<List<Board>> GetByUserIdAsync(Guid userId);
    Task<List<Board>> GetPublicBoardsByUserIdAsync(Guid userId);
    Task<int> GetPinsCountAsync(Guid boardId);
    Task<List<Pin>> GetPinsForBoardAsync(Guid boardId);
    Task<List<Pin>> GetPinsForBoardByUserAsync(Guid boardId, Guid userId);
}