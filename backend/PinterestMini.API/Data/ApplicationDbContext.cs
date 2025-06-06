using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PinterestMini.API.Data.Configurations;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data;

public class ApplicationDbContext : IdentityDbContext<User, IdentityRole<Guid>, Guid>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Pin> Pins { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<PinTag> PinTags { get; set; }
    public DbSet<PinBoard> PinBoards { get; set; }
    public DbSet<Follow> Follows { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfiguration(new LikeConfiguration());
        builder.ApplyConfiguration(new FollowConfiguration());
        builder.ApplyConfiguration(new PinTagConfiguration());
        builder.ApplyConfiguration(new PinBoardConfiguration());
        builder.ApplyConfiguration(new CommentConfiguration());
    }
}