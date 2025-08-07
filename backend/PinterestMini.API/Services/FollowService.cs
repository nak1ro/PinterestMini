using System.Security.Claims;
using AutoMapper;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Follow;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Middlewares;

namespace PinterestMini.API.Services;

public class FollowService : IFollowService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IUserContextService _userContext;

    public FollowService(IUnitOfWork unitOfWork, IMapper mapper, IUserContextService userContext)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userContext = userContext;
    }

    public async Task FollowAsync(Guid targetUserId, ClaimsPrincipal currentUser)
    {
        var currentUserId = _userContext.GetUserId(currentUser);

        if (currentUserId == targetUserId)
            throw new AppBadRequestException("You cannot follow yourself.");

        var exists = await _unitOfWork.Follows.ExistsAsync(currentUserId, targetUserId);
        if (exists)
            throw new AppBadRequestException("You already follow this user.");

        var follow = new Follow
        {
            FollowerId = currentUserId,
            FollowingId = targetUserId,
            FollowedAt = DateTime.UtcNow
        };

        await _unitOfWork.Follows.AddAsync(follow);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UnfollowAsync(Guid targetUserId, ClaimsPrincipal currentUser)
    {
        var currentUserId = _userContext.GetUserId(currentUser);

        var follow = await _unitOfWork.Follows.GetAsync(currentUserId, targetUserId);
        if (follow == null)
            throw new AppBadRequestException("You must first follow this user before unfollowing.");

        await _unitOfWork.Follows.RemoveAsync(follow);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<bool> IsFollowingAsync(Guid targetUserId, ClaimsPrincipal currentUser)
    {
        var currentUserId = _userContext.GetUserId(currentUser);
        return await _unitOfWork.Follows.ExistsAsync(currentUserId, targetUserId);
    }

    public async Task<int> GetFollowersCountAsync(Guid userId)
    {
        return await _unitOfWork.Follows.GetFollowersCountAsync(userId);
    }

    public async Task<int> GetFollowingCountAsync(Guid userId)
    {
        return await _unitOfWork.Follows.GetFollowingCountAsync(userId);
    }

    public async Task<List<UserProfileDto>> GetFollowersAsync(Guid userId)
    {
        var users = await _unitOfWork.Follows.GetFollowersAsync(userId);
        return users.Select(u => _mapper.Map<UserProfileDto>(u)).ToList();
    }

    public async Task<List<UserProfileDto>> GetFollowingAsync(Guid userId)
    {
        var users = await _unitOfWork.Follows.GetFollowingAsync(userId);
        return users.Select(u => _mapper.Map<UserProfileDto>(u)).ToList();
    }
}
