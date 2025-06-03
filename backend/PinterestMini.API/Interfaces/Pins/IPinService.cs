using System.Security.Claims;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;

namespace PinterestMini.API.Services.Pins;

public interface IPinService
{
    Task<Guid> CreatePinAsync(CreatePinDto dto, ClaimsPrincipal user);
    Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user);
}
