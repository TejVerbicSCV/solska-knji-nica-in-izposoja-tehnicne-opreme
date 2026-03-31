namespace SolskaKnjiznica.Core.Entities;

public class Knjige
{
    public int Id { get; set; }
    public string Naslov { get; set; } = string.Empty;
    public string Isbn { get; set; } = string.Empty;
    public int Leto { get; set; }
    public int Stevilo { get; set; }
    public string SlikaUrl { get; set; } = string.Empty;
    public int JezikiId { get; set; }
}
