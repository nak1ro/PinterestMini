using System.Security.Claims;
using PinterestMini.API.DTOs.Common;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Domain.Interfaces.Pins;

public interface IPinService
{
    Task<Guid> CreatePinAsync(CreatePinDto dto, ClaimsPrincipal user);
    Task<PaginatedResult<PinDto>> GetRecentPinsPaginatedAsync(int page, int pageSize);
    Task<List<PinDto>> GetMyPinsAsync(ClaimsPrincipal user);
    Task<PaginatedResult<PinDto>> GetFollowedCreatorsFeedAsync(ClaimsPrincipal user, int page, int pageSize);
    Task<PaginatedResult<PinDto>> SearchPinsAsync(string query, int page, int pageSize);
    Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user);
    Task SavePinAsync(Guid pinId, ClaimsPrincipal user);
    Task UnsavePinAsync(Guid pinId, ClaimsPrincipal user);
    Task<List<PinDto>> GetSavedPinsAsync(ClaimsPrincipal user);
}
