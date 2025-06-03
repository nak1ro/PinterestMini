using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Interfaces.Comments;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Interfaces.Tags;

namespace PinterestMini.API.Interfaces
{
    public interface IUnitOfWork
    {
        IPinRepository Pins { get; }
        ITagRepository Tags { get; }
        IBoardRepository Boards { get; }
        ICommentRepository Comments { get; set; }

        Task SaveChangesAsync();
    }
}
