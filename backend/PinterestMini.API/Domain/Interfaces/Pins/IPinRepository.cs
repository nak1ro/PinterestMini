using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Pins;

public interface IPinRepository
{
    Task<Pin?> GetByIdAsync(Guid id);
    Task<Pin?> GetByIdWithTagsAndBoardsAsync(Guid id);
    Task<List<Pin>> GetPinsByOwnerAsync(Guid ownerId);
    Task<List<Pin>> SearchSavedPinsAsync(Guid userId, string query, int page, int pageSize);
    Task<IEnumerable<Pin>> GetRecentPublicPinsAsync(int page, int pageSize);
    Task<List<Pin>> GetPinsCreatedByFollowedUsersAsync(Guid userId, int page, int pageSize);
    Task<List<Pin>> SearchPublicPinsAsync(string query, int page, int pageSize);
    Task<List<Pin>> GetPinsByTagNameAsync(string tagName);
    Task<bool> IsPinSavedAsync(Guid userId, Guid pinId);
    Task SavePinAsync(Guid userId, Guid pinId);
    Task UnsavePinAsync(Guid userId, Guid pinId);
    Task<IEnumerable<Pin>> GetSavedPinsAsync(Guid userId);
    Task<int> GetLikeCountAsync(Guid pinId);
    Task<bool> IsPinLikedByUserAsync(Guid pinId, Guid userId);
    Task LikePinAsync(Guid pinId, Guid userId);
    Task UnlikePinAsync(Guid pinId, Guid userId);
    Task AddAsync(Pin pin);
    void Update(Pin pin);
    void Delete(Pin pin);
}