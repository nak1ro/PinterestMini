using System.Security.Claims;
using AutoMapper;
using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Boards;
using PinterestMini.API.DTOs.Pins;
using PinterestMini.API.Helpers;
using PinterestMini.API.Middlewares;

namespace PinterestMini.API.Services;

public class BoardService : IBoardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IUserContextService _userContext;
    private readonly ImageUploader _imageUploader;

    public BoardService(IUnitOfWork unitOfWork, IMapper mapper, IUserContextService userContext,
        ImageUploader imageUploader)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userContext = userContext;
        _imageUploader = imageUploader;
    }

    public async Task<Guid> CreateBoardAsync(CreateBoardDto dto, ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);

        var board = new Board
        {
            Name = dto.Name,
            Description = dto.Description,
            IsPrivate = dto.IsPrivate,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            CoverImageUrl = dto.CoverImage != null ? await SaveImageAsync(dto.CoverImage) : null
        };

        await _unitOfWork.Boards.AddAsync(board);
        await _unitOfWork.SaveChangesAsync();

        return board.Id;
    }

    public async Task UpdateBoardAsync(Guid boardId, UpdateBoardDto dto, ClaimsPrincipal user)
    {
        var board = await _unitOfWork.Boards.GetByIdAsync(boardId)
                    ?? throw new AppNotFoundException("Board not found");

        var userId = _userContext.GetUserId(user);
        if (board.UserId != userId)
            throw new AppUnauthorizedException("You can only update your own boards.");

        board.Name = dto.Name ?? board.Name;
        board.Description = dto.Description ?? board.Description;
        if (dto.IsPrivate.HasValue)
            board.IsPrivate = dto.IsPrivate.Value;

        if (dto.CoverImage != null)
            board.CoverImageUrl = await SaveImageAsync(dto.CoverImage);

        await _unitOfWork.SaveChangesAsync();
    }

    public async Task DeleteBoardAsync(Guid boardId, ClaimsPrincipal user)
    {
        var board = await _unitOfWork.Boards.GetByIdAsync(boardId)
                    ?? throw new AppNotFoundException("Board not found");

        var userId = _userContext.GetUserId(user);
        if (board.UserId != userId)
            throw new AppUnauthorizedException("You can only delete your own boards.");

        _unitOfWork.Boards.Delete(board);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<BoardDto>> GetMyBoardsAsync(ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);
        var boards = await _unitOfWork.Boards.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<BoardDto>>(boards);
    }

    public async Task<int> GetPinsCountAsync(Guid boardId)
    {
        return await _unitOfWork.Boards.GetPinsCountAsync(boardId);
    }

    public async Task<IEnumerable<PinDto>> GetPinsForBoardAsync(Guid boardId, ClaimsPrincipal user)
    {
        var board = await _unitOfWork.Boards.GetByIdAsync(boardId)
                    ?? throw new AppNotFoundException("Board not found");

        if (board.IsPrivate)
        {
            var userId = _userContext.GetUserId(user);
            if (board.UserId != userId)
                throw new AppUnauthorizedException("This board is private.");
        }

        var pins = await _unitOfWork.Boards.GetPinsForBoardAsync(boardId);
        return _mapper.Map<IEnumerable<PinDto>>(pins);
    }

    public async Task<IEnumerable<BoardDto>> GetBoardsByUserAsync(Guid userId)
    {
        var boards = await _unitOfWork.Boards.GetPublicBoardsByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<BoardDto>>(boards);
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        return await _imageUploader.UploadAsync(image, "boards");
    }
}