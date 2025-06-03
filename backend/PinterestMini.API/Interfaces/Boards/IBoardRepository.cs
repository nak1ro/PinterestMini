using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces.Boards;

public interface IBoardRepository
{
    Task<List<Board>> GetByIdsAsync(List<Guid> boardIds);
}