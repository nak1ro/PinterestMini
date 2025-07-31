using System.Security.Claims;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Shared;

public interface IUserContextService
{
    Guid GetUserId(ClaimsPrincipal user);
    Task<User> GetUserAsync(ClaimsPrincipal user);
}