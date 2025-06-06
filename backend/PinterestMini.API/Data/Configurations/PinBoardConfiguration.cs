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
            .HasForeignKey(pb => pb.BoardId);

        builder.HasOne(pb => pb.Pin)
            .WithMany(p => p.PinBoards)
            .HasForeignKey(pb => pb.PinId);
        
        builder
            .HasOne(pb => pb.User)
            .WithMany()
            .HasForeignKey(pb => pb.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}