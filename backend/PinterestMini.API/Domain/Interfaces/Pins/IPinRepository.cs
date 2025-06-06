using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Pins;

public interface IPinRepository
{
    Task<Pin?> GetByIdAsync(Guid id);
    Task<Pin?> GetByIdWithTagsAndBoardsAsync(Guid id);
    Task AddAsync(Pin pin);
    void Update(Pin pin);
    void Delete(Pin pin);
}