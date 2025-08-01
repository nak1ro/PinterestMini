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

        await AttachTagsByNameAsync(pin, dto.TagNames);
        await AttachBoardsAsync(pin, dto.BoardIds, userId);

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

    public async Task AssignPinToBoardAsync(Guid pinId, Guid boardId, ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var pin = await _unitOfWork.Pins.GetByIdAsync(pinId)
                  ?? throw new AppNotFoundException("Pin not found.");

        var board = await _unitOfWork.Boards.GetByIdAsync(boardId)
                    ?? throw new AppNotFoundException("Board not found.");

        if (board.UserId != userId)
            throw new AppUnauthorizedException("You do not own this board.");

        var alreadyAssigned = await _unitOfWork.PinBoards.ExistsAsync(pinId, boardId, userId);
        if (alreadyAssigned)
            return;

        await _unitOfWork.PinBoards.AddAsync(new PinBoard
        {
            PinId = pinId,
            BoardId = boardId,
            UserId = userId
        });

        await _unitOfWork.SaveChangesAsync();
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
        await ReplaceBoardsAsync(pin, dto.BoardIds);
        await UpdateTagsAsync(pin, dto.TagIdsToAdd, dto.TagIdsToRemove);

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

    private async Task AttachTagsByNameAsync(Pin pin, List<string>? tagNames)
    {
        if (tagNames == null || tagNames.Count == 0) return;
        Console.WriteLine(tagNames);
        // Normalize input (case-insensitive, trim)
        var normalized = tagNames
            .Select(t => t.Trim().ToLower())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Distinct()
            .ToList();

        var existingTags = await _unitOfWork.Tags.GetByNamesAsync(normalized);

        var newTagNames = normalized
            .Except(existingTags.Select(t => t.Name.ToLower()))
            .ToList();

        var newTags = newTagNames
            .Select(name => new Tag { Id = Guid.NewGuid(), Name = name, UsageCount = 0 })
            .ToList();

        foreach (var tag in newTags)
            await _unitOfWork.Tags.AddAsync(tag);

        var allTags = existingTags.Concat(newTags).ToList();

        pin.PinTags = allTags
            .Select(tag => new PinTag { TagId = tag.Id, Pin = pin })
            .ToList();

        foreach (var tag in allTags)
            tag.UsageCount += 1;
    }


    private async Task AttachBoardsAsync(Pin pin, List<Guid>? boardIds, Guid userId)
    {
        if (boardIds is not { Count: > 0 }) return;

        var boards = await _unitOfWork.Boards.GetByIdsAsync(boardIds);
        pin.PinBoards = boards.Select(b => new PinBoard { BoardId = b.Id, Pin = pin, UserId = userId }).ToList();
    }

    private async Task ReplaceBoardsAsync(Pin pin, List<Guid>? boardIds)
    {
        if (boardIds == null) return;

        var boards = await _unitOfWork.Boards.GetByIdsAsync(boardIds);
        pin.PinBoards = boards.Select(b => new PinBoard { BoardId = b.Id, PinId = pin.Id }).ToList();
    }

    private async Task UpdateTagsAsync(Pin pin, List<Guid>? tagsToAdd, List<Guid>? tagsToRemove)
    {
        if (tagsToAdd != null)
        {
            var newTags = await _unitOfWork.Tags.GetByIdsAsync(tagsToAdd);
            foreach (var tag in newTags.Where(tag => pin.PinTags.All(pt => pt.TagId != tag.Id)))
            {
                pin.PinTags.Add(new PinTag { TagId = tag.Id, PinId = pin.Id });
            }
        }

        if (tagsToRemove != null)
        {
            pin.PinTags = pin.PinTags
                .Where(pt => !tagsToRemove.Contains(pt.TagId))
                .ToList();
        }
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