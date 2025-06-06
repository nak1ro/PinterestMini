using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Domain.Models;

namespace PinterestMini.API.Data.Configurations;

public class SavedPinConfiguration: IEntityTypeConfiguration<SavedPin>
{
    public void Configure(EntityTypeBuilder<SavedPin> builder)
    {
        builder
            .HasKey(sp => new { sp.UserId, sp.PinId });

        builder
            .HasOne(sp => sp.User)
            .WithMany(u => u.SavedPins)
            .HasForeignKey(sp => sp.UserId);

        builder
            .HasOne(sp => sp.Pin)
            .WithMany()
            .HasForeignKey(sp => sp.PinId);
    }
}