using PinterestMini.API.Models;

namespace PinterestMini.API.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(User user);
}