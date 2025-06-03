using System.Security.Claims;
using AutoMapper;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Models;
using PinterestMini.API.Services.Pins;
using Microsoft.EntityFrameworkCore;

namespace PinterestMini.API.Services;

public class PinService : IPinService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _env;

    public PinService(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment env)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _env = env;
    }

    public async Task<Guid> CreatePinAsync(CreatePinDto dto, ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);

        // Save image
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

        // Assign tags (if any)
        if (dto.TagIds != null && dto.TagIds.Count != 0)
        {
            var tags = await _unitOfWork.Tags.GetByIdsAsync(dto.TagIds);
            pin.PinTags = tags.Select(t => new PinTag { Tag = t, Pin = pin }).ToList();
        }

        // Assign boards (if any)
        if (dto.BoardIds != null && dto.BoardIds.Count != 0)
        {
            var boards = await _unitOfWork.Boards.GetByIdsAsync(dto.BoardIds);
            pin.PinBoards = boards.Select(b => new PinBoard { Board = b, Pin = pin }).ToList();
        }

        await _unitOfWork.Pins.AddAsync(pin);
        await _unitOfWork.SaveChangesAsync();

        return pin.Id;
    }

    public async Task UpdatePinAsync(Guid pinId, UpdatePinDto dto, ClaimsPrincipal user)
    {
        var pin = await _unitOfWork.Pins.GetByIdWithTagsAndBoardsAsync(pinId);
        if (pin == null) throw new KeyNotFoundException("Pin not found");

        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (pin.OwnerId != userId) throw new UnauthorizedAccessException("You don't own this pin");

        // Update fields if provided
        if (dto.Title != null) pin.Title = dto.Title;
        if (dto.Description != null) pin.Description = dto.Description;
        if (dto.AllowComments.HasValue) pin.AllowComments = dto.AllowComments.Value;

        // Replace boards
        if (dto.BoardIds != null)
        {
            var boards = await _unitOfWork.Boards.GetByIdsAsync(dto.BoardIds);
            pin.PinBoards = boards.Select(b => new PinBoard { BoardId = b.Id, PinId = pin.Id }).ToList();
        }

        // Tags: Add and Remove
        if (dto.TagIdsToAdd != null)
        {
            var newTags = await _unitOfWork.Tags.GetByIdsAsync(dto.TagIdsToAdd);
            foreach (var tag in newTags.Where(tag => pin.PinTags.All(pt => pt.TagId != tag.Id)))
            {
                pin.PinTags.Add(new PinTag { TagId = tag.Id, PinId = pin.Id });
            }
        }

        if (dto.TagIdsToRemove != null)
        {
            pin.PinTags = pin.PinTags
                .Where(pt => !dto.TagIdsToRemove.Contains(pt.TagId))
                .ToList();
        }

        _unitOfWork.Pins.Update(pin);
        await _unitOfWork.SaveChangesAsync();
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
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