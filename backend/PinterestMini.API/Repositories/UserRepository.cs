using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Users;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.UserName == username);
    }
}