using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using PinterestMini.API.Models;

namespace PinterestMini.API.Data.Configurations;

public class PinTagConfiguration : IEntityTypeConfiguration<PinTag>
{
    public void Configure(EntityTypeBuilder<PinTag> builder)
    {
        builder.HasKey(pt => new { pt.PinId, pt.TagId });

        builder.HasOne(pt => pt.Pin)
            .WithMany(p => p.PinTags)
            .HasForeignKey(pt => pt.PinId);

        builder.HasOne(pt => pt.Tag)
            .WithMany(t => t.PinTags)
            .HasForeignKey(pt => pt.TagId);
    }
}