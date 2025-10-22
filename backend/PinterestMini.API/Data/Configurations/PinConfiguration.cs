using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations
{
    public class PinConfiguration : IEntityTypeConfiguration<Pin>
    {
        public void Configure(EntityTypeBuilder<Pin> builder)
        {
            // Primary key
            builder.HasKey(p => p.Id);

            // Relationships
            builder.HasOne(p => p.Owner)
                   .WithMany(u => u.Pins)
                   .HasForeignKey(p => p.OwnerId)
                   // BREAKS cascade loop between Users → Pins → Comments/Likes
                   .OnDelete(DeleteBehavior.NoAction);

            // One-to-many relationships
            builder.HasMany(p => p.Comments)
                   .WithOne(c => c.Pin)
                   .HasForeignKey(c => c.PinId)
                   .OnDelete(DeleteBehavior.NoAction); // Delete comments when pin is deleted

            builder.HasMany(p => p.Likes)
                   .WithOne(l => l.Pin)
                   .HasForeignKey(l => l.PinId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(p => p.PinBoards)
                   .WithOne(pb => pb.Pin)
                   .HasForeignKey(pb => pb.PinId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(p => p.PinTags)
                   .WithOne(pt => pt.Pin)
                   .HasForeignKey(pt => pt.PinId)
                   .OnDelete(DeleteBehavior.NoAction);

            builder.HasMany(p => p.SavedPins)
                   .WithOne(sp => sp.Pin)
                   .HasForeignKey(sp => sp.PinId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
