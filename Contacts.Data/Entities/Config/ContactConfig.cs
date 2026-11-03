using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Contacts.Data.Entities.Config;

class ContactConfig : IEntityTypeConfiguration<Contact>
{
    public void Configure(EntityTypeBuilder<Contact> builder)
    {
        builder.Property(e => e.FirstName)
            .IsRequired()
            .HasMaxLength(50);
        builder.Property(e => e.LastName)
            .HasMaxLength(50);
        builder.Property(e => e.Email)
            .HasMaxLength(254);
        builder.Property(e => e.Phone)
            .HasColumnType("varchar(30)");

        // For enforcement of uniqueness most of all
        builder.HasIndex(e => e.Email)
            .IsUnique()
            .HasFilter("[Email] IS NOT NULL");

        // For enforcement of uniqueness most of all
        builder.HasIndex(e => e.Phone)
            .IsUnique()
            .HasFilter("[Phone] IS NOT NULL");
    }
}