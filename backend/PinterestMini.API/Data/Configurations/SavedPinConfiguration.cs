using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations;

public class SavedPinConfiguration : IEntityTypeConfiguration<SavedPin>
{
    public void Configure(EntityTypeBuilder<SavedPin> builder)
    {
        builder.HasKey(sp => new { sp.UserId, sp.PinId });

        builder.HasOne(sp => sp.User)
            .WithMany(u => u.SavedPins)
            .HasForeignKey(sp => sp.UserId)
            .OnDelete(DeleteBehavior.NoAction); // avoid extra cascade from User

        builder.HasOne(sp => sp.Pin)
            .WithMany(p => p.SavedPins) // <-- ensure Pin has ICollection<SavedPin> SavedBy
            .HasForeignKey(sp => sp.PinId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}