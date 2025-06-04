using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PinterestMini.API.DTOs.Comments;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Interfaces.Comments;
using PinterestMini.API.Models;

namespace PinterestMini.API.Services;

public class CommentService : ICommentService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly UserManager<User> _userManager;

    public CommentService(IUnitOfWork unitOfWork, IMapper mapper, UserManager<User> userManager)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<Guid> CreateCommentAsync(Guid pinId, CreateCommentDto dto, ClaimsPrincipal user)
    {
        var userId = GetUserId(user);
        await EnsureUserExists(userId);

        var pin = await GetPinIfCommentingAllowed(pinId);

        var comment = new Comment
        {
            Content = dto.Content,
            CreatedAt = DateTime.UtcNow,
            UserId = userId,
            PinId = pinId
        };

        await _unitOfWork.Comments.AddAsync(comment);
        await _unitOfWork.SaveChangesAsync();

        return comment.Id;
    }

    public async Task UpdateCommentAsync(Guid commentId, UpdateCommentDto dto, ClaimsPrincipal user)
    {
        var comment = await GetCommentWithUser(commentId);
        var userId = GetUserId(user);

        if (!EnsureCommentOwner(comment.UserId, userId))
            throw new UnauthorizedAccessException("You are not allowed to update this comment.");

        comment.Content = dto.Content;
        comment.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteCommentAsync(Guid commentId, ClaimsPrincipal user)
    {
        var comment = await GetCommentWithUserAndPin(commentId);
        var userId = GetUserId(user);

        if (!EnsureCommentOwner(comment.UserId, userId) && !IsPinOwner(comment.Pin.OwnerId, userId))
            throw new UnauthorizedAccessException("You are not allowed to delete this comment.");

        _unitOfWork.Comments.Remove(comment);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsForPinAsync(Guid pinId, int page, int pageSize)
    {
        var comments = await _unitOfWork.Comments.GetForPinPaginatedAsync(pinId, page, pageSize);
        return _mapper.Map<IEnumerable<CommentDto>>(comments);
    }

    // 🔽 Helper Methods

    private Guid GetUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier)
                    ?? throw new UnauthorizedAccessException("User ID claim not found.");
        return Guid.Parse(idStr);
    }

    private async Task EnsureUserExists(Guid userId)
    {
        var user = await _userManager.FindByIdAsync(userId.ToString());
        if (user == null)
            throw new UnauthorizedAccessException("User not found.");
    }

    private async Task<Pin> GetPinIfCommentingAllowed(Guid pinId)
    {
        var pin = await _unitOfWork.Pins.GetByIdAsync(pinId)
                  ?? throw new KeyNotFoundException("Pin not found.");

        if (!pin.AllowComments)
            throw new InvalidOperationException("Comments are disabled for this pin.");

        return pin;
    }

    private async Task<Comment> GetCommentWithUser(Guid commentId)
    {
        return await _unitOfWork.Comments.GetByIdWithUserAsync(commentId)
               ?? throw new KeyNotFoundException("Comment not found.");
    }

    private async Task<Comment> GetCommentWithUserAndPin(Guid commentId)
    {
        return await _unitOfWork.Comments.GetByIdWithUserAndPinAsync(commentId)
               ?? throw new KeyNotFoundException("Comment not found.");
    }

    private static bool EnsureCommentOwner(Guid commentUserId, Guid currentUserId)
    {
        return commentUserId != currentUserId;
    }

    private static bool IsPinOwner(Guid pinOwnerId, Guid currentUserId) => pinOwnerId == currentUserId;
}