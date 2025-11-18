using Amazon;
using Amazon.S3;
using Amazon.S3.Model;
using PinterestMini.API.Domain.Interfaces.Shared;

namespace PinterestMini.API.Services;

public class S3BlobService : IBlobService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly string _region;

    public S3BlobService(IConfiguration config)
    {
        _bucketName = config["AWS:BucketName"] ?? throw new ArgumentNullException("AWS:BucketName");
        _region = config["AWS:Region"] ?? throw new ArgumentNullException("AWS:Region");

        var accessKey = config["AWS:AccessKey"];
        var secretKey = config["AWS:SecretKey"];

        var regionEndpoint = RegionEndpoint.GetBySystemName(_region);
        _s3Client = new AmazonS3Client(accessKey, secretKey, regionEndpoint);
    }

    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var putRequest = new PutObjectRequest
        {
            BucketName = _bucketName,
            Key = fileName, 
            InputStream = fileStream,
            ContentType = contentType,
            CannedACL = S3CannedACL.PublicRead
        };

        await _s3Client.PutObjectAsync(putRequest);

        var url = $"https://{_bucketName}.s3.{_region}.amazonaws.com/{Uri.EscapeDataString(fileName)}";
        return url;
    }

    public async Task DeleteFileAsync(string fileName)
    {
        var deleteRequest = new DeleteObjectRequest
        {
            BucketName = _bucketName,
            Key = fileName
        };

        await _s3Client.DeleteObjectAsync(deleteRequest);
    }
}