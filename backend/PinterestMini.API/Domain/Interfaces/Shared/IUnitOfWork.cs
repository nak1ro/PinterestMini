using PinterestMini.API.Domain.Interfaces.Boards;
using PinterestMini.API.Domain.Interfaces.Comments;
using PinterestMini.API.Domain.Interfaces.Follow;
using PinterestMini.API.Domain.Interfaces.PinBoards;
using PinterestMini.API.Domain.Interfaces.Pins;
using PinterestMini.API.Domain.Interfaces.Tags;
using PinterestMini.API.Domain.Interfaces.Users;

namespace PinterestMini.API.Domain.Interfaces.Shared
{
    public interface IUnitOfWork
    {
        IPinRepository Pins { get; }
        ITagRepository Tags { get; }
        IBoardRepository Boards { get; }
        ICommentRepository Comments { get; set; }
        IPinBoardRepository PinBoards { get; set; }
        IFollowRepository Follows { get; set; }
        IUserRepository Users { get; set; }

        Task SaveChangesAsync();
    }
}
