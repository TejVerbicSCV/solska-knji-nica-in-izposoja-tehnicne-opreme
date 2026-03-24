using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;

namespace SolskaKnjiznica.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public DbSet<Uporabnik> Uporabniki { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Uporabnik>(entity =>
        {
            entity.ToTable("uporabniki");
            entity.HasKey(u => u.Id);

            entity.Property(u => u.Id).HasColumnName("id");
            entity.Property(u => u.Email).HasColumnName("email").IsRequired();
            entity.Property(u => u.GesloHash).HasColumnName("geslo_hash").IsRequired();
            entity.Property(u => u.Ime).HasColumnName("ime").IsRequired();
            entity.Property(u => u.Priimek).HasColumnName("priimek").IsRequired();
            entity.Property(u => u.Vloga).HasColumnName("vloga").IsRequired();
            entity.Property(u => u.UstvarjenOb).HasColumnName("ustvarjen_ob").IsRequired();

            entity.HasIndex(u => u.Email).IsUnique();
        });
    }
}
