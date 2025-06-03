using AutoMapper;
using PinterestMini.API.DTOs.Comments;
using PinterestMini.API.Models;

namespace PinterestMini.API.Helpers;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Display: Comment → CommentDto
        CreateMap<Comment, CommentDto>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.UserName))
            .ForMember(dest => dest.UserAvatarUrl, opt => opt.MapFrom(src => src.User.ProfilePictureUrl));

        // Create: CreateCommentDto → Comment
        CreateMap<CreateCommentDto, Comment>();

        // Update: UpdateCommentDto → Comment (not always used, but ready)
        CreateMap<UpdateCommentDto, Comment>();
    }
}