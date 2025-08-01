using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Domain.Interfaces.Tags;

public interface ITagService
{
    Task<List<string>> GetMostPopularTagNamesAsync(int count);
    Task<List<PinDto>> GetPinsByTagNameAsync(string tagName);
}