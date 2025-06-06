using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Domain.Interfaces.Tags;

public interface ITagRepository
{
    Task<List<Tag>> GetByIdsAsync(List<Guid> tagIds);
    Task<Tag?> GetByNameAsync(string name);
    Task AddAsync(Tag tag);
}