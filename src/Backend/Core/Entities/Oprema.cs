namespace SolskaKnjiznica.Core.Entities;

public class Oprema
{
    public int Id { get; set; }
    public string Ime { get; set; } = string.Empty;
    public string SerijskaSt { get; set; } = string.Empty;
    public string Opis { get; set; } = string.Empty;
    public int Stevilo { get; set; }
    public string SlikaUrl { get; set; } = string.Empty;
    public int KategorijeId { get; set; }
}
