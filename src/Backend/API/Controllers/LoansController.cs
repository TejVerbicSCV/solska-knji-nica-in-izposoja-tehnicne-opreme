using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LoansController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LoansController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLoans()
    {
        var loans = await _context.Izposoje.ToListAsync();
        var knjige = await _context.Knjige.ToDictionaryAsync(k => k.Id);
        var oprema = await _context.Oprema.ToDictionaryAsync(o => o.Id);
        var uporabniki = await _context.Uporabniki.ToDictionaryAsync(u => u.Id);

        var result = loans.Select(l => new
        {
            l.Id,
            DatumIzposoje = l.DatumIzposoje.ToString("yyyy-MM-dd"),
            DatumVrnitve = l.DatumVrnitve?.ToString("yyyy-MM-dd") ?? "-",
            l.Status,
            l.PoskodbaOpis,
            ItemName = l.KnjigeId.HasValue && knjige.TryGetValue(l.KnjigeId.Value, out var k) ? k.Naslov 
                      : l.OpremaId.HasValue && oprema.TryGetValue(l.OpremaId.Value, out var o) ? o.Ime 
                      : "Neznan predmet",
            StudentName = l.DijakiId.HasValue && uporabniki.TryGetValue(l.DijakiId.Value, out var u) 
                         ? $"{u.Ime} {u.Priimek}" : "Neznan dijak",
            StudentId = l.DijakiId?.ToString()
        });

        return Ok(result);
    }

    [HttpPut("{id}/return")]
    public async Task<IActionResult> ReturnItem(int id, [FromBody] ReturnRequest request)
    {
        var loan = await _context.Izposoje.FindAsync(id);
        if (loan == null)
            return NotFound("Izposoja ni bila najdena");

        loan.DatumVrnitve = DateTime.UtcNow;
        loan.Status = "vrnjeno";
        // Legacy fields (optional)
        loan.PoskodbaOpis = request.PoskodbaOpis ?? string.Empty;
        loan.PoskodbaSlikaUrl = request.PoskodbaSlikaUrl ?? string.Empty;

        if (!string.IsNullOrEmpty(request.PoskodbaOpis))
        {
            var poskodba = new Poskodba
            {
                Datum = DateTime.UtcNow,
                Opis = request.PoskodbaOpis,
                SlikaUrl = request.PoskodbaSlikaUrl,
                IzposojeId = loan.Id,
                DijakiId = loan.DijakiId
            };
            _context.Poskodba.Add(poskodba);
        }

        await _context.SaveChangesAsync();
        return Ok(loan);
    }

    public record ReturnRequest(string? PoskodbaOpis, string? PoskodbaSlikaUrl);
}
