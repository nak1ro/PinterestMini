using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using PinterestMini.API.Domain.Interfaces;
using PinterestMini.API.Domain.Interfaces.Shared;

namespace PinterestMini.API.Services;

public class BlobService : IBlobService
{
    private readonly BlobContainerClient _containerClient;

    public BlobService(IConfiguration config)
    {
        var connStr = config["AzureBlob:ConnectionString"];
        var containerName = config["AzureBlob:ContainerName"];
        _containerClient = new BlobContainerClient(connStr, containerName);
        _containerClient.CreateIfNotExists(PublicAccessType.Blob);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var blobClient = _containerClient.GetBlobClient(fileName);
        var options = new BlobUploadOptions
        {
            HttpHeaders = new BlobHttpHeaders
            {
                ContentType = contentType
            }
        };

        await blobClient.UploadAsync(fileStream, options, cancellationToken: CancellationToken.None);
        return blobClient.Uri.ToString();
    }

    public async Task DeleteFileAsync(string fileName)
    {
        var blobClient = _containerClient.GetBlobClient(fileName);
        await blobClient.DeleteIfExistsAsync();
    }
}