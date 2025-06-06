using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Auth;

public interface ITokenService
{
    Task<string> CreateToken(User user);
}