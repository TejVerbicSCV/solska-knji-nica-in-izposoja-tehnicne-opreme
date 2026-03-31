namespace SolskaKnjiznica.Core.Entities;

public class Izposoje
{
    public int Id { get; set; }
    public DateTime DatumIzposoje { get; set; }
    public DateTime? DatumVrnitve { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PoskodbaOpis { get; set; } = string.Empty;
    public string PoskodbaSlikaUrl { get; set; } = string.Empty;
    public int? KnjigeId { get; set; }
    public int? DijakiId { get; set; } 
    public int? OpremaId { get; set; }
}
