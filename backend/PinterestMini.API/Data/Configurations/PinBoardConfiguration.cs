using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations;

public class PinBoardConfiguration : IEntityTypeConfiguration<PinBoard>
{
    public void Configure(EntityTypeBuilder<PinBoard> builder)
    {
        builder.HasKey(pb => new { pb.BoardId, pb.PinId, pb.UserId });

        builder.HasOne(pb => pb.Board)
            .WithMany(b => b.PinBoards)
            .HasForeignKey(pb => pb.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(pb => pb.Pin)
            .WithMany(p => p.PinBoards)
            .HasForeignKey(pb => pb.PinId)
            .OnDelete(DeleteBehavior.Cascade);

        // Avoid second cascade path from User
        builder
            .HasOne(pb => pb.User)
            .WithMany() // or .WithMany(u => u.PinBoards) if you have the nav
            .HasForeignKey(pb => pb.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}