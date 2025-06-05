using System.Security.Claims;
using AutoMapper;
using PinterestMini.API.DTOs.Boards;
using PinterestMini.API.Interfaces;
using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Models;

public class BoardService : IBoardService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IWebHostEnvironment _env;
    private readonly IUserContextService _userContext;

    public BoardService(IUnitOfWork unitOfWork, IMapper mapper, IWebHostEnvironment env,
        IUserContextService userContext)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _env = env;
        _userContext = userContext;
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
                    ?? throw new KeyNotFoundException("Board not found");

        var userId = _userContext.GetUserId(user);
        if (board.UserId != userId)
            throw new UnauthorizedAccessException("You can only update your own boards.");

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
                    ?? throw new KeyNotFoundException("Board not found");

        var userId = _userContext.GetUserId(user);
        if (board.UserId != userId)
            throw new UnauthorizedAccessException("You can only delete your own boards.");

        _unitOfWork.Boards.Delete(board);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<IEnumerable<BoardDto>> GetMyBoardsAsync(ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);
        var boards = await _unitOfWork.Boards.GetByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<BoardDto>>(boards);
    }

    public async Task<IEnumerable<BoardDto>> GetBoardsByUserAsync(Guid userId)
    {
        var boards = await _unitOfWork.Boards.GetPublicBoardsByUserIdAsync(userId);
        return _mapper.Map<IEnumerable<BoardDto>>(boards);
    }

    private async Task<string> SaveImageAsync(IFormFile image)
    {
        var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var folderPath = Path.Combine(webRoot, "images", "boards");

        if (!Directory.Exists(folderPath))
            Directory.CreateDirectory(folderPath);

        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(folderPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await image.CopyToAsync(stream);

        return $"/images/boards/{fileName}";
    }
}