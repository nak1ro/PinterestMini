using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.Middlewares;

namespace PinterestMini.API.Services;

public class UserContextService : IUserContextService
{
    private readonly UserManager<User> _userManager;

    public UserContextService(UserManager<User> userManager)
    {
        _userManager = userManager;
    }

    public Guid GetUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(idStr))
            throw new AppUnauthorizedException("Authenticated user ID is missing from token.");
        
        return Guid.Parse(idStr);
    }

    public async Task<User> GetUserAsync(ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        var foundUser = await _userManager.FindByIdAsync(userId.ToString());

        if (foundUser == null)
            throw new AppUnauthorizedException("Authenticated user does not exist.");

        return foundUser;
    }
}