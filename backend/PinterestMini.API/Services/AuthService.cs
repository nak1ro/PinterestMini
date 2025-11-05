using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Auth;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.Helpers;
using PinterestMini.API.Middlewares;
using System.Security.Claims;

namespace PinterestMini.API.Services;

public class AuthService : IAuthService
{
    private readonly UserManager<User> _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly ApplicationDbContext _context;
    private readonly IUserContextService _userContext;
    private readonly ImageUploader _imageUploader;

    public AuthService(
        UserManager<User> userManager, 
        SignInManager<User> signInManager, 
        ITokenService tokenService, 
        IMapper mapper,
        ApplicationDbContext context,
        IUserContextService userContext,
        ImageUploader imageUploader)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _mapper = mapper;
        _context = context;
        _userContext = userContext;
        _imageUploader = imageUploader;
    }

    public async Task<NewUserDto> RegisterAsync(RegisterDto dto)
    {
        var existingUserByEmail = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUserByEmail != null)
            throw new AppBadRequestException("This email is already in use.");

        var user = new User { UserName = dto.Username, Email = dto.Email };
        var result = await _userManager.CreateAsync(user, dto.Password);

        if (!result.Succeeded)
        {
            var errorMessages = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new AppBadRequestException(errorMessages);
        }

        await _userManager.AddToRoleAsync(user, "User");

        var token = await _tokenService.CreateToken(user);
        var newDto = _mapper.Map<NewUserDto>(user);
        newDto.Token = token;
        return newDto;
    }

    public async Task<NewUserDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.Users
            .FirstOrDefaultAsync(u => u.UserName == dto.Login || u.Email == dto.Login);

        if (user == null)
            throw new AppUnauthorizedException("Invalid username or email");

        var result = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
        if (!result.Succeeded)
            throw new AppUnauthorizedException("Invalid credentials");

        var token = await _tokenService.CreateToken(user);
        var newDto = _mapper.Map<NewUserDto>(user);
        newDto.Token = token;
        return newDto;
    }

    public async Task<User> GetUserByLoginAsync(string login)
    {
        if (string.IsNullOrWhiteSpace(login))
            throw new AppBadRequestException("Login (username or email) must be provided.");

        var user = await _userManager.FindByNameAsync(login)
                   ?? await _userManager.FindByEmailAsync(login);

        if (user == null)
            throw new AppNotFoundException("User not found.");

        return user;
    }

    public async Task<UserProfileDto> GetUserProfileByUsernameAsync(string username)
    {
        var user = await _userManager.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.UserName == username);

        if (user == null)
            throw new AppNotFoundException("User not found.");

        return _mapper.Map<UserProfileDto>(user);
    }

    public async Task<UserProfileDto> UpdateProfileAsync(UpdateProfileDto dto, ClaimsPrincipal user)
    {
        var currentUser = await _userContext.GetUserAsync(user);

        // Update only provided fields
        if (dto.Name != null)
            currentUser.Name = dto.Name;

        if (dto.Bio != null)
            currentUser.Bio = dto.Bio;

        // Handle profile picture upload if provided
        if (dto.ProfilePicture != null)
        {
            var imageUrl = await _imageUploader.UploadAsync(dto.ProfilePicture, "profiles");
            currentUser.ProfilePictureUrl = imageUrl;
        }

        var result = await _userManager.UpdateAsync(currentUser);
        if (!result.Succeeded)
        {
            var errorMessages = string.Join("; ", result.Errors.Select(e => e.Description));
            throw new AppBadRequestException(errorMessages);
        }

        return _mapper.Map<UserProfileDto>(currentUser);
    }

    public async Task DeleteAccountAsync(ClaimsPrincipal user)
    {
        var userId = _userContext.GetUserId(user);
        var userToDelete = await _userManager.FindByIdAsync(userId.ToString());
        
        if (userToDelete == null)
            throw new AppNotFoundException("User not found.");

        // Delete all related entities manually (most have DeleteBehavior.NoAction)
        
        // 1. Delete Follows (DeleteBehavior.Restrict - must delete both sides)
        var followers = await _context.Follows
            .Where(f => f.FollowingId == userId)
            .ToListAsync();
        _context.Follows.RemoveRange(followers);

        var following = await _context.Follows
            .Where(f => f.FollowerId == userId)
            .ToListAsync();
        _context.Follows.RemoveRange(following);

        // 2. Delete SavedPins (DeleteBehavior.NoAction)
        var savedPins = await _context.SavedPins
            .Where(sp => sp.UserId == userId)
            .ToListAsync();
        _context.SavedPins.RemoveRange(savedPins);

        // 3. Delete Likes created by the user (DeleteBehavior.NoAction)
        var userLikes = await _context.Likes
            .Where(l => l.UserId == userId)
            .ToListAsync();
        _context.Likes.RemoveRange(userLikes);

        // 4. Delete Comments created by the user (DeleteBehavior.NoAction)
        var userComments = await _context.Comments
            .Where(c => c.UserId == userId)
            .ToListAsync();
        _context.Comments.RemoveRange(userComments);

        // 5. Delete Pins and their related entities
        var pins = await _context.Pins
            .Where(p => p.OwnerId == userId)
            .ToListAsync();

        foreach (var pin in pins)
        {
            // Decrement tag usage counts
            var pinTags = await _context.PinTags
                .Where(pt => pt.PinId == pin.Id)
                .Include(pt => pt.Tag)
                .ToListAsync();
            
            foreach (var pinTag in pinTags)
            {
                if (pinTag.Tag != null)
                {
                    pinTag.Tag.UsageCount = Math.Max(0, pinTag.Tag.UsageCount - 1);
                }
            }

            // Delete PinTags
            _context.PinTags.RemoveRange(pinTags);

            // Delete PinBoards
            var pinBoards = await _context.PinBoards
                .Where(pb => pb.PinId == pin.Id)
                .ToListAsync();
            _context.PinBoards.RemoveRange(pinBoards);

            // Delete Comments on this pin (created by other users)
            var pinComments = await _context.Comments
                .Where(c => c.PinId == pin.Id)
                .ToListAsync();
            _context.Comments.RemoveRange(pinComments);

            // Delete Likes on this pin (created by other users)
            var pinLikes = await _context.Likes
                .Where(l => l.PinId == pin.Id)
                .ToListAsync();
            _context.Likes.RemoveRange(pinLikes);
        }

        // Delete the pins themselves
        _context.Pins.RemoveRange(pins);

        // 6. Delete Boards and their PinBoards
        var boards = await _context.Boards
            .Where(b => b.UserId == userId)
            .ToListAsync();

        foreach (var board in boards)
        {
            // Delete PinBoards associated with this board
            var boardPinBoards = await _context.PinBoards
                .Where(pb => pb.BoardId == board.Id)
                .ToListAsync();
            _context.PinBoards.RemoveRange(boardPinBoards);
        }

        _context.Boards.RemoveRange(boards);

        // Save all deletions
        await _context.SaveChangesAsync();

        // Finally, delete the user (Identity will handle Identity-related tables via cascade)
        var deleteResult = await _userManager.DeleteAsync(userToDelete);
        if (!deleteResult.Succeeded)
        {
            var errorMessages = string.Join("; ", deleteResult.Errors.Select(e => e.Description));
            throw new AppBadRequestException($"Failed to delete account: {errorMessages}");
        }
    }
}
