using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;

namespace SolskaKnjiznica.Infrastructure.Persistence;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Uporabnik> Uporabniki { get; set; }
    public DbSet<Dijaki> Dijaki { get; set; }
    public DbSet<Kategorija> Kategorije { get; set; }
    public DbSet<Jezik> Jeziki { get; set; }
    public DbSet<Knjige> Knjige { get; set; }
    public DbSet<Oprema> Oprema { get; set; }
    public DbSet<Izposoje> Izposoje { get; set; }
    public DbSet<Rezervacije> Rezervacije { get; set; }
    public DbSet<Poskodba> Poskodba { get; set; }
    public DbSet<Avtor> Avtorji { get; set; }
    public DbSet<AvtorKnjiga> AvtorKnjiga { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Uporabnik>().ToTable("uporabniki");
        modelBuilder.Entity<Dijaki>().ToTable("dijaki");
        modelBuilder.Entity<Kategorija>().ToTable("kategorije");
        modelBuilder.Entity<Jezik>().ToTable("jeziki");
        modelBuilder.Entity<Knjige>().ToTable("knjige");
        modelBuilder.Entity<Oprema>().ToTable("oprema");
        modelBuilder.Entity<Izposoje>().ToTable("izposoje");
        modelBuilder.Entity<Rezervacije>().ToTable("rezervacije");
        modelBuilder.Entity<Poskodba>().ToTable("poskodbe");
        modelBuilder.Entity<Avtor>().ToTable("avtorji");
        modelBuilder.Entity<AvtorKnjiga>().ToTable("avtor_knjiga");

        modelBuilder.Entity<Uporabnik>().Property(u => u.Id).HasColumnName("id");
        modelBuilder.Entity<Uporabnik>().Property(u => u.Email).HasColumnName("email");
        modelBuilder.Entity<Uporabnik>().Property(u => u.GesloHash).HasColumnName("geslo_hash");
        modelBuilder.Entity<Uporabnik>().Property(u => u.Ime).HasColumnName("ime");
        modelBuilder.Entity<Uporabnik>().Property(u => u.Priimek).HasColumnName("priimek");
        modelBuilder.Entity<Uporabnik>().Property(u => u.UstvarjenOb).HasColumnName("ustvarjen_ob").HasColumnType("timestamp without time zone");
        modelBuilder.Entity<Uporabnik>().Property(u => u.Vloga).HasColumnName("vloga");

        modelBuilder.Entity<Dijaki>().Property(d => d.Id).HasColumnName("id");
        modelBuilder.Entity<Dijaki>().Property(d => d.Ime).HasColumnName("ime");
        modelBuilder.Entity<Dijaki>().Property(d => d.Priimek).HasColumnName("priimek");
        modelBuilder.Entity<Dijaki>().Property(d => d.Email).HasColumnName("email");
        modelBuilder.Entity<Dijaki>().Property(d => d.IndetifikacijskaSt).HasColumnName("indetifikacijska_st");

        modelBuilder.Entity<Knjige>().Property(k => k.Id).HasColumnName("id");
        modelBuilder.Entity<Knjige>().Property(k => k.Naslov).HasColumnName("naslov");
        modelBuilder.Entity<Knjige>().Property(k => k.Isbn).HasColumnName("isbn");
        modelBuilder.Entity<Knjige>().Property(k => k.Leto).HasColumnName("leto");
        modelBuilder.Entity<Knjige>().Property(k => k.Stevilo).HasColumnName("stevilo");
        modelBuilder.Entity<Knjige>().Property(k => k.SlikaUrl).HasColumnName("slika_url");
        modelBuilder.Entity<Knjige>().Property(k => k.JezikiId).HasColumnName("jeziki_id");

        modelBuilder.Entity<Oprema>().Property(o => o.Id).HasColumnName("id");
        modelBuilder.Entity<Oprema>().Property(o => o.Ime).HasColumnName("ime");
        modelBuilder.Entity<Oprema>().Property(o => o.SerijskaSt).HasColumnName("serijska_st");
        modelBuilder.Entity<Oprema>().Property(o => o.Opis).HasColumnName("opis");
        modelBuilder.Entity<Oprema>().Property(o => o.Stevilo).HasColumnName("stevilo");
        modelBuilder.Entity<Oprema>().Property(o => o.SlikaUrl).HasColumnName("slika_url");
        modelBuilder.Entity<Oprema>().Property(o => o.KategorijeId).HasColumnName("kategorije_id");

        modelBuilder.Entity<Izposoje>().Property(i => i.Id).HasColumnName("id");
        modelBuilder.Entity<Izposoje>().Property(i => i.DatumIzposoje).HasColumnName("datum_izposoje").HasColumnType("timestamp without time zone");
        modelBuilder.Entity<Izposoje>().Property(i => i.DatumVrnitve).HasColumnName("datum_vrnitve").HasColumnType("timestamp without time zone");
        modelBuilder.Entity<Izposoje>().Property(i => i.Status).HasColumnName("status");
        modelBuilder.Entity<Izposoje>().Property(i => i.PoskodbaOpis).HasColumnName("poskodba_opis");
        modelBuilder.Entity<Izposoje>().Property(i => i.PoskodbaSlikaUrl).HasColumnName("poskodba_slika_url");
        modelBuilder.Entity<Izposoje>().Property(i => i.KnjigeId).HasColumnName("knjige_id");
        modelBuilder.Entity<Izposoje>().Property(i => i.DijakiId).HasColumnName("dijaki_id");
        modelBuilder.Entity<Izposoje>().Property(i => i.OpremaId).HasColumnName("oprema_id");

        modelBuilder.Entity<Rezervacije>().Property(r => r.Id).HasColumnName("id");
        modelBuilder.Entity<Rezervacije>().Property(r => r.DatumRezervacije).HasColumnName("datum_rezervacije").HasColumnType("timestamp with time zone");
        modelBuilder.Entity<Rezervacije>().Property(r => r.DatumOd).HasColumnName("datum_od").HasColumnType("timestamp with time zone");
        modelBuilder.Entity<Rezervacije>().Property(r => r.DatumDo).HasColumnName("datum_do").HasColumnType("timestamp with time zone");
        modelBuilder.Entity<Rezervacije>().Property(r => r.Status).HasColumnName("status");
        modelBuilder.Entity<Rezervacije>().Property(r => r.KnjigeId).HasColumnName("knjige_id");
        modelBuilder.Entity<Rezervacije>().Property(r => r.OpremaId).HasColumnName("oprema_id");
        modelBuilder.Entity<Rezervacije>().Property(r => r.DijakiId).HasColumnName("dijaki_id");

        modelBuilder.Entity<Poskodba>().Property(p => p.Id).HasColumnName("id");
        modelBuilder.Entity<Poskodba>().Property(p => p.Datum).HasColumnName("datum").HasColumnType("timestamp without time zone");
        modelBuilder.Entity<Poskodba>().Property(p => p.Opis).HasColumnName("opis");
        modelBuilder.Entity<Poskodba>().Property(p => p.SlikaUrl).HasColumnName("slika_url");
        modelBuilder.Entity<Poskodba>().Property(p => p.IzposojeId).HasColumnName("izposoje_id");
        modelBuilder.Entity<Poskodba>().Property(p => p.DijakiId).HasColumnName("dijaki_id");

        modelBuilder.Entity<Avtor>().Property(a => a.Id).HasColumnName("id");
        modelBuilder.Entity<Avtor>().Property(a => a.Ime).HasColumnName("ime");
        modelBuilder.Entity<Avtor>().Property(a => a.Priimek).HasColumnName("priimek");

        modelBuilder.Entity<AvtorKnjiga>().Property(ak => ak.Id).HasColumnName("id");
        modelBuilder.Entity<AvtorKnjiga>().Property(ak => ak.AvtorjiId).HasColumnName("avtorji_id");
        modelBuilder.Entity<AvtorKnjiga>().Property(ak => ak.KnjigeId).HasColumnName("knjige_id");
    }
}
