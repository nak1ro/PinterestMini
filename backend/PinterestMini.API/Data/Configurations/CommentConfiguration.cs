using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        // Keep cascade from Pin -> Comments
        builder
            .HasOne(c => c.Pin)
            .WithMany(p => p.Comments)
            .HasForeignKey(c => c.PinId)
            .OnDelete(DeleteBehavior.Cascade);

        // Break the second cascade path: User -> Comments = NoAction
        builder
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}