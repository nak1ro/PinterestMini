using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data;
using PinterestMini.API.Domain.Interfaces.Tags;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Repositories;

public class TagRepository : ITagRepository
{
    private readonly ApplicationDbContext _context;

    public TagRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<Tag>> GetByIdsAsync(List<Guid> tagIds)
    {
        return await _context.Tags
            .Where(t => tagIds.Contains(t.Id))
            .ToListAsync();
    }

    public async Task<Tag?> GetByNameAsync(string name)
    {
        return await _context.Tags.FirstOrDefaultAsync(t => t.Name == name);
    }
    
    public async Task<List<Tag>> GetByNamesAsync(IEnumerable<string> names)
    {
        var normalized = names.Select(n => n.Trim().ToLower()).ToList();
        return await _context.Tags
            .Where(t => normalized.Contains(t.Name.ToLower()))
            .ToListAsync();
    }
    
    public async Task AddAsync(Tag tag)
    {
        await _context.Tags.AddAsync(tag);
    }
}