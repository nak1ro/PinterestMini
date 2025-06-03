using PinterestMini.API.Interfaces.Boards;
using PinterestMini.API.Interfaces.Pins;
using PinterestMini.API.Interfaces.Tags;

namespace PinterestMini.API.Interfaces
{
    public interface IUnitOfWork
    {
        IPinRepository Pins { get; }
        ITagRepository Tags { get; }
        IBoardRepository Boards { get; }

        Task SaveChangesAsync();
    }
}
