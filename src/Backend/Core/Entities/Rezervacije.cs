namespace SolskaKnjiznica.Core.Entities;

public class Rezervacije
{
    public int Id { get; set; }
    public DateTime? DatumRezervacije { get; set; }
    public DateTime? DatumOd { get; set; }
    public DateTime? DatumDo { get; set; }
    public string Status { get; set; } = "aktivna";
    
    public int? KnjigeId { get; set; }
    public int? OpremaId { get; set; }
    public int? DijakiId { get; set; }
}
