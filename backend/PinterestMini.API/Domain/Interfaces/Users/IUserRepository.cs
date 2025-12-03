using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Users;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
}