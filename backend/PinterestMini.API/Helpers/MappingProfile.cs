using AutoMapper;
using PinterestMini.API.Domain.Models;
using PinterestMini.API.DTOs.Account;
using PinterestMini.API.DTOs.Boards;
using PinterestMini.API.DTOs.Comments;
using PinterestMini.API.DTOs.Pins;

namespace PinterestMini.API.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ✅ Comment → CommentDto
        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.UserAvatarUrl, opt => opt.MapFrom(src => src.User.ProfilePictureUrl));

        // ✅ CreateCommentDto → Comment
        CreateMap<CreateCommentDto, Comment>();

        // ✅ UpdateCommentDto → Comment
        CreateMap<UpdateCommentDto, Comment>();

        // ✅ Board → BoardDto
        CreateMap<Board, BoardDto>()
            .ForMember(dest => dest.OwnerUsername, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.CoverImageUrl, opt => opt.MapFrom(src => src.CoverImageUrl));

        // ✅ Tag → TagPreviewDto
        CreateMap<Tag, TagPreviewDto>();

        // ✅ Board → BoardPreviewDto
        CreateMap<Board, BoardPreviewDto>();

        // ✅ User → OwnerDto (for embedding inside PinDto)
        CreateMap<User, OwnerDto>();

        // ✅ Pin → PinDto (unified version)
        CreateMap<Pin, PinDto>()
            .ForMember(dest => dest.Owner, opt => opt.MapFrom(src => src.Owner))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src =>
                src.PinTags.Select(pt => new TagPreviewDto
                {
                    Id = pt.Tag.Id,
                    Name = pt.Tag.Name
                })))
            .ForMember(dest => dest.Boards, opt => opt.MapFrom(src =>
                src.PinBoards.Select(pb => new BoardPreviewDto
                {
                    Id = pb.Board.Id,
                    Name = pb.Board.Name
                })));
        
        CreateMap<User, UserProfileDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.Name));
        
        CreateMap<User, NewUserDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.UserName))
            .ForMember(dest => dest.ProfilePictureUrl, opt => opt.MapFrom(src => src.ProfilePictureUrl));
    }
}