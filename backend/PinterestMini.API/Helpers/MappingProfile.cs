using AutoMapper;
using PinterestMini.API.Domain.Models;
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

        // ✅ Pin → PinDto
        CreateMap<Pin, PinDto>()
            .ForMember(dest => dest.OwnerId, opt => opt.MapFrom(src => src.OwnerId.ToString()))
            .ForMember(dest => dest.Tags, opt => opt.MapFrom(src => src.PinTags.Select(pt => pt.Tag.Name)))
            .ForMember(dest => dest.Boards, opt => opt.MapFrom(src => src.PinBoards.Select(pb => pb.Board.Name)));
        
        CreateMap<Tag, TagPreviewDto>();
        CreateMap<Board, BoardPreviewDto>();
        
        CreateMap<Pin, PinDto>()
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
    }
}