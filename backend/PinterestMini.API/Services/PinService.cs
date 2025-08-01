using System.Security.Claims;
using AutoMapper;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Common;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;
using PinterestMini.API.Middlewares;

namespace PinterestMini.API.Services;

public class PinService : IPinService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IUserContextService _userContext;
    private readonly IMapper _mapper;
    private readonly ImageUploader _imageUploader;

    public PinService(IUnitOfWork unitOfWork, IUserContextService userContext, IMapper mapper,
        ImageUploader imageUploader)
    {
        _unitOfWork = unitOfWork;
        _userContext = userContext;
        _mapper = mapper;
        _imageUploader = imageUploader;
    }

    public async Task<Guid> CreatePinAsync(CreatePinDto dto, ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var imageUrl = await SaveImageAsync(dto.Image);
        var pin = new Pin
        {
            Title = dto.Title,
            Description = dto.Description,
            ImageUrl = imageUrl,
            CreatedAt = DateTime.UtcNow,
            AllowComments = dto.AllowComments,
            OwnerId = userId
        };

        await SetTagsByNameAsync(pin, dto.TagNames);
        await SetBoardsAsync(pin, dto.BoardIds, userId);

        await _unitOfWork.Pins.AddAsync(pin);
        await _unitOfWork.SaveChangesAsync();

        return pin.Id;
    }

    public async Task<List<PinDto>> GetMyPinsAsync(ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);
        var pins = await _unitOfWork.Pins.GetPinsByOwnerAsync(userId);
        return _mapper.Map<List<PinDto>>(pins);
    }

    public async Task<PaginatedResult<PinDto>> GetFollowedCreatorsFeedAsync(ClaimsPrincipal user, int page,
        int pageSize)
    {
        var userId = _userContext.GetUserId(user);

        var pins = await _unitOfWork.Pins.GetPinsCreatedByFollowedUsersAsync(userId, page, pageSize);
        var items = _mapper.Map<List<PinDto>>(pins.Take(pageSize));

        return new PaginatedResult<PinDto>
        {
            Items = items,
            Page = page,
            PageSize = pageSize,
            HasMore = pins.Count > pageSize
        };
    }

    public async Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user)
    {
        var pin = await _unitOfWork.Pins.GetByIdWithTagsAndBoardsAsync(pinId);
        if (pin == null)
            throw new AppNotFoundException("Pin not found.");

        var userId = _userContext.GetUserId(user);
        if (pin.OwnerId != userId)
            throw new AppUnauthorizedException("You don't own this pin.");

        UpdateFields(pin, dto);
        await SetBoardsAsync(pin, dto.BoardIds, userId);
        await SetTagsByNameAsync(pin, dto.TagNames);

        _unitOfWork.Pins.Update(pin);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<PaginatedResult<PinDto>> GetRecentPinsPaginatedAsync(int page, int pageSize)
    {
        var pins = await _unitOfWork.Pins.GetRecentPublicPinsAsync(page, pageSize + 1);
        var mapped = _mapper.Map<List<PinDto>>(pins.Take(pageSize));

        return new PaginatedResult<PinDto>
        {
            Items = mapped,
            Page = page,
            PageSize = pageSize,
            HasMore = pins.Count() > pageSize
        };
    }

    public async Task SavePinAsync(Guid pinId, ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var pin = await _unitOfWork.Pins.GetByIdAsync(pinId);
        if (pin == null)
            throw new AppNotFoundException("Pin not found.");

        var alreadySaved = await _unitOfWork.Pins.IsPinSavedAsync(userId, pinId);
        if (alreadySaved)
            return;

        await _unitOfWork.Pins.SavePinAsync(userId, pinId);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UnsavePinAsync(Guid pinId, ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var saved = await _unitOfWork.Pins.IsPinSavedAsync(userId, pinId);
        if (!saved)
            return;

        await _unitOfWork.Pins.UnsavePinAsync(userId, pinId);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<List<PinDto>> GetSavedPinsAsync(ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var savedPins = await _unitOfWork.Pins.GetSavedPinsAsync(userId);
        return _mapper.Map<List<PinDto>>(savedPins);
    }

    private async Task SetBoardsAsync(Pin pin, List<Guid>? boardIds, Guid userId)
    {
        pin.PinBoards = new List<PinBoard>(); // clear existing

        if (boardIds is not { Count: > 0 }) return;

        var boards = await _unitOfWork.Boards.GetByIdsAsync(boardIds);
        pin.PinBoards = boards.Select(board => new PinBoard
        {
            PinId = pin.Id,
            BoardId = board.Id,
            UserId = userId
        }).ToList();
    }

    private async Task SetTagsByNameAsync(Pin pin, List<string>? tagNames)
    {
        var oldTagIds = pin.PinTags?.Select(pt => pt.TagId).ToHashSet() ?? new HashSet<Guid>();
        pin.PinTags = new List<PinTag>();

        if (tagNames == null || tagNames.Count == 0)
        {
            await DecrementUsageCountsAsync(oldTagIds);
            return;
        }

        var normalizedNames = NormalizeTagNames(tagNames);

        var existingTags = await _unitOfWork.Tags.GetByNamesAsync(normalizedNames);
        var newTags = await CreateNewTagsAsync(normalizedNames, existingTags);

        var allTags = existingTags.Concat(newTags).ToList();
        var newTagIds = allTags.Select(t => t.Id).ToHashSet();

        await AdjustUsageCountsAsync(oldTagIds, newTagIds, allTags);

        pin.PinTags = CreatePinTags(pin.Id, allTags);
    }

    private static List<string> NormalizeTagNames(List<string> tagNames)
    {
        return tagNames
            .Select(t => t.Trim().ToLower())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct()
            .ToList();
    }

    private async Task<List<Tag>> CreateNewTagsAsync(List<string> normalized, List<Tag> existingTags)
    {
        var existingNames = existingTags.Select(t => t.Name.ToLower()).ToHashSet();
        var newNames = normalized.Except(existingNames).ToList();

        var newTags = newNames.Select(name => new Tag
        {
            Id = Guid.NewGuid(),
            Name = name,
            UsageCount = 0
        }).ToList();

        foreach (var tag in newTags)
            await _unitOfWork.Tags.AddAsync(tag);

        return newTags;
    }

    private async Task AdjustUsageCountsAsync(HashSet<Guid> oldTagIds, HashSet<Guid> newTagIds, List<Tag> allTags)
    {
        var added = newTagIds.Except(oldTagIds);
        var removed = oldTagIds.Except(newTagIds);

        foreach (var tagId in added)
        {
            var tag = allTags.FirstOrDefault(t => t.Id == tagId);
            if (tag != null) tag.UsageCount += 1;
        }

        foreach (var tagId in removed)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
            if (tag != null) tag.UsageCount -= 1;
        }
    }

    private async Task DecrementUsageCountsAsync(HashSet<Guid> tagIds)
    {
        foreach (var tagId in tagIds)
        {
            var tag = await _unitOfWork.Tags.GetByIdAsync(tagId);
            if (tag != null) tag.UsageCount -= 1;
        }
    }

    private static List<PinTag> CreatePinTags(Guid pinId, List<Tag> tags)
    {
        return tags.Select(tag => new PinTag
        {
            PinId = pinId,
            TagId = tag.Id
        }).ToList();
    }


    private static void UpdateFields(Pin pin, UpdatePinDto dto)
    {
        if (!string.IsNullOrWhiteSpace(dto.Title))
            pin.Title = dto.Title;

        if (!string.IsNullOrWhiteSpace(dto.Description))
            pin.Description = dto.Description;

        if (dto.AllowComments.HasValue)
            pin.AllowComments = dto.AllowComments.Value;
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        return await _imageUploader.UploadAsync(image, "pins");
    }
}