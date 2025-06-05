using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces.Boards;

public interface IBoardRepository
{
    Task<List<Board>> GetByIdsAsync(List<Guid> boardIds);
    Task<Board?> GetByIdAsync(Guid boardId);
    Task AddAsync(Board board);
    void Delete(Board board);
    Task<List<Board>> GetByUserIdAsync(Guid userId);
    Task<List<Board>> GetPublicBoardsByUserIdAsync(Guid userId);
}