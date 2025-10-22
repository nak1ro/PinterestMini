using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations
{
    public class BoardConfiguration : IEntityTypeConfiguration<Board>
    {
        public void Configure(EntityTypeBuilder<Board> builder)
        {
            // Primary key
            builder.HasKey(b => b.Id);

            // Relationships
            builder.HasOne(b => b.User)
                .WithMany(u => u.Boards)
                .HasForeignKey(b => b.UserId)
                // BREAKS cascade loop between Users → Boards → PinBoards
                .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(b => b.PinBoards)
                .WithOne(pb => pb.Board)
                .HasForeignKey(pb => pb.BoardId)
                .OnDelete(DeleteBehavior.NoAction);

            // Property configs
            builder.Property(b => b.Name)
                .IsRequired();

            builder.Property(b => b.CreatedAt)
                .IsRequired();
        }
    }
}