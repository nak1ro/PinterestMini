using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Tags;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagController : ControllerBase
{
    private readonly ITagService _tagService;

    public TagController(ITagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet("popular")]
    [AllowAnonymous]
    public async Task<ActionResult<List<string>>> GetPopularTags([FromQuery] int count = 10)
    {
        var tags = await _tagService.GetMostPopularTagNamesAsync(count);
        return Ok(tags);
    }
    
    [HttpGet("{tagName}/pins")]
    [AllowAnonymous]
    public async Task<ActionResult<List<PinDto>>> GetPinsByTagName(string tagName)
    {
        var pins = await _tagService.GetPinsByTagNameAsync(tagName);
        return Ok(pins);
    }
}