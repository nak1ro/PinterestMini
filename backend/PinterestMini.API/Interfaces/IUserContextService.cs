using System.Security.Claims;
using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces;

public interface IUserContextService
{
    Guid GetUserId(ClaimsPrincipal user);
    Task<User> GetUserAsync(ClaimsPrincipal user);
}