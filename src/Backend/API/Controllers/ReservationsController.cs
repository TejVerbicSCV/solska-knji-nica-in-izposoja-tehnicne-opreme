using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReservationsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReservationsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetReservations()
    {
        var reservations = await _context.Rezervacije.ToListAsync();
        var knjige = await _context.Knjige.ToDictionaryAsync(k => k.Id);
        var oprema = await _context.Oprema.ToDictionaryAsync(o => o.Id);
        var uporabniki = await _context.Uporabniki.ToDictionaryAsync(u => u.Id);

        var result = reservations.Select(r => new
        {
            r.Id,
            r.DatumRezervacije,
            DatumOd = r.DatumOd?.ToString("yyyy-MM-dd") ?? "-",
            DatumDo = r.DatumDo?.ToString("yyyy-MM-dd") ?? "-",
            r.Status,
            ItemName = r.KnjigeId.HasValue && knjige.TryGetValue(r.KnjigeId.Value, out var k) ? k.Naslov 
                      : r.OpremaId.HasValue && oprema.TryGetValue(r.OpremaId.Value, out var o) ? o.Ime 
                      : "Neznan predmet",
            StudentName = r.DijakiId.HasValue && uporabniki.TryGetValue(r.DijakiId.Value, out var u) 
                         ? $"{u.Ime} {u.Priimek}" : "Neznan dijak"
        });

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationRequest request)
    {
        var reservation = new Rezervacije
        {
            DatumRezervacije = DateTime.UtcNow,
            DatumOd = DateTime.Parse(request.DatumOd).ToUniversalTime(),
            DatumDo = DateTime.Parse(request.DatumDo).ToUniversalTime(),
            Status = "aktivna"
        };

        if (request.ItemId.StartsWith("k-"))
            reservation.KnjigeId = int.Parse(request.ItemId.Substring(2));
        else if (request.ItemId.StartsWith("o-"))
            reservation.OpremaId = int.Parse(request.ItemId.Substring(2));

        reservation.DijakiId = int.Parse(request.UserId);

        _context.Rezervacije.Add(reservation);
        await _context.SaveChangesAsync();

        return Ok(reservation);
    }

    // Status update endpoint removed — buttons kept in UI but non-functional

    public record ReservationRequest(string ItemId, string UserId, string DatumOd, string DatumDo);
}
