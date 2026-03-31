namespace SolskaKnjiznica.Core.Entities;

public class Poskodba
{
    public int Id { get; set; }
    public DateTime Datum { get; set; }
    public string Opis { get; set; } = string.Empty;
    public string? SlikaUrl { get; set; }
    public int IzposojeId { get; set; }
    public int? DijakiId { get; set; }
}
