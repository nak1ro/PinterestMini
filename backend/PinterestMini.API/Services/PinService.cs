using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Services;

public class PinService : IPinService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IWebHostEnvironment _env;
    private readonly IUserContextService _userContext;

    public PinService(IUnitOfWork unitOfWork, IWebHostEnvironment env, IUserContextService userContext)
    {
        _unitOfWork = unitOfWork;
        _env = env;
        _userContext = userContext;
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

        await AttachTagsAsync(pin, dto.TagIds);
        await AttachBoardsAsync(pin, dto.BoardIds);

        await _unitOfWork.Pins.AddAsync(pin);
        await _unitOfWork.SaveChangesAsync();

        return pin.Id;
    }

    public async Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user)
    {
        var pin = await _unitOfWork.Pins.GetByIdWithTagsAndBoardsAsync(pinId);
        if (pin == null)
            throw new KeyNotFoundException("Pin not found");

        var userId = _userContext.GetUserId(user);
        if (pin.OwnerId != userId)
            throw new UnauthorizedAccessException("You don't own this pin");

        UpdateFields(pin, dto);
        await ReplaceBoardsAsync(pin, dto.BoardIds);
        await UpdateTagsAsync(pin, dto.TagIdsToAdd, dto.TagIdsToRemove);

        _unitOfWork.Pins.Update(pin);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task AttachTagsAsync(Pin pin, List<Guid>? tagIds)
    {
        if (tagIds is not { Count: > 0 }) return;

        var tags = await _unitOfWork.Tags.GetByIdsAsync(tagIds);
        pin.PinTags = tags.Select(t => new PinTag { TagId = t.Id, Pin = pin }).ToList();
    }

    private async Task AttachBoardsAsync(Pin pin, List<Guid>? boardIds)
    {
        if (boardIds is not { Count: > 0 }) return;

        var boards = await _unitOfWork.Boards.GetByIdsAsync(boardIds);
        pin.PinBoards = boards.Select(b => new PinBoard { BoardId = b.Id, Pin = pin }).ToList();
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

    private void UpdateFields(Pin pin, UpdatePinDto dto)
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
        var webRoot = _env.WebRootPath;
        var uploadsFolder = Path.Combine(webRoot, "images", "pins");

        if (!Directory.Exists(uploadsFolder))
            Directory.CreateDirectory(uploadsFolder);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(uploadsFolder, fileName);

        await using var fileStream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(fileStream);

        return $"/images/pins/{fileName}";
    }
}