using AutoMapper;
using PinterestMini.API.Domain.Interfaces.Shared;
using PinterestMini.API.Domain.Interfaces.Tags;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Services;

public class TagService : ITagService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public TagService(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }


    public async Task<List<string>> GetMostPopularTagNamesAsync(int count)
    {
        var tags = await _unitOfWork.Tags.GetMostPopularAsync(count);
        return tags.Select(t => t.Name).ToList();
    }

    public async Task<List<PinDto>> GetPinsByTagNameAsync(string tagName)
    {
        var pins = await _unitOfWork.Pins.GetPinsByTagNameAsync(tagName);
        return _mapper.Map<List<PinDto>>(pins);
    }
}