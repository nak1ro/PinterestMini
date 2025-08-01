using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Tags;

public interface ITagRepository
{
    Task<List<Tag>> GetByIdsAsync(List<Guid> tagIds);
    Task<Tag?> GetByNameAsync(string name);
    Task<List<Tag>> GetMostPopularAsync(int count);
    Task<Tag?> GetByIdAsync(Guid id);
    Task<List<Tag>> GetByNamesAsync(IEnumerable<string> names);
    Task AddAsync(Tag tag);
}