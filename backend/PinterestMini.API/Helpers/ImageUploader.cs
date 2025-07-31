using PinterestMini.API.Domain.Interfaces.Shared;

namespace PinterestMini.API.Helpers;

public class ImageUploader
{
    private readonly IBlobService _blobService;

    public ImageUploader(IBlobService blobService)
    {
        _blobService = blobService;
    }

    public async Task<string> UploadAsync(IFormFile file, string folder)
    {
        var fileName = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        await using var stream = file.OpenReadStream();
        return await _blobService.UploadFileAsync(stream, fileName, file.ContentType);
    }
}
