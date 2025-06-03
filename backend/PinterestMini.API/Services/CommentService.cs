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
        var owner = await _userManager.FindByIdAsync(userId.ToString());
        if (owner == null) throw new UnauthorizedAccessException("User not found.");

        var pin = await _unitOfWork.Pins.GetByIdAsync(pinId);
        if (pin == null) throw new KeyNotFoundException("Pin not found.");
        if (!pin.AllowComments) throw new InvalidOperationException("Comments are disabled for this pin.");

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
        var comment = await _unitOfWork.Comments.GetByIdWithUserAsync(commentId);
        if (comment == null) throw new KeyNotFoundException("Comment not found.");

        var userId = GetUserId(user);
        if (comment.UserId != userId)
            throw new UnauthorizedAccessException("You can only edit your own comments.");

        comment.Content = dto.Content;
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteCommentAsync(Guid commentId, ClaimsPrincipal user)
    {
        var comment = await _unitOfWork.Comments.GetByIdWithUserAndPinAsync(commentId);
        if (comment == null) throw new KeyNotFoundException("Comment not found.");

        var userId = GetUserId(user);
        var isOwner = comment.UserId == userId;
        var isPinOwner = comment.Pin.OwnerId == userId;

        if (!isOwner && !isPinOwner)
            throw new UnauthorizedAccessException("You can't delete this comment.");

        _unitOfWork.Comments.Remove(comment);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsForPinAsync(Guid pinId, int page, int pageSize)
    {
        var comments = await _unitOfWork.Comments.GetForPinPaginatedAsync(pinId, page, pageSize);
        return _mapper.Map<IEnumerable<CommentDto>>(comments);
    }

    private Guid GetUserId(ClaimsPrincipal user)
    {
        var idStr = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(idStr))
            throw new UnauthorizedAccessException("User ID claim not found.");
        return Guid.Parse(idStr);
    }
}