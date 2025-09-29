using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Tags;

namespace PinterestMini.API.Domain.Interfaces
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
