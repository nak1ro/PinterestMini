namespace PinterestMini.API.Helpers;

public class PinQuery
{
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
    public string? Search { get; set; }
    public string? Tag { get; set; }
}
