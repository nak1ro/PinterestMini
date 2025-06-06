using System.Security.Claims;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Domain.Interfaces.Pins;

public interface IPinService
{
    Task<Guid> CreatePinAsync(CreatePinDto dto, ClaimsPrincipal user);
    Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user);
}
