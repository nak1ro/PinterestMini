using PinterestMini.API.Helpers;
using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces.Pins;

public interface IPinRepository
{
    Task<Pin?> GetByIdWithTagsAndBoardsAsync(Guid id);
    Task AddAsync(Pin pin);
    void Update(Pin pin);
    void Delete(Pin pin);
}
