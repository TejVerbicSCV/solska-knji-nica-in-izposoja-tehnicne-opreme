using Microsoft.AspNetCore.Mvc;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KnjigeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public KnjigeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetKnjiga(int id)
    {
        var knjiga = await _context.Knjige.FindAsync(id);
        if (knjiga == null) return NotFound();
        return Ok(knjiga);
    }

    [HttpPost]
    public async Task<IActionResult> AddKnjiga([FromBody] Knjige knjiga)
    {
        _context.Knjige.Add(knjiga);
        await _context.SaveChangesAsync();
        return Ok(knjiga);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateKnjiga(int id, [FromBody] Knjige knjiga)
    {
        if (id != knjiga.Id) return BadRequest();
        _context.Entry(knjiga).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
        
        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
        {
            if (!_context.Knjige.Any(k => k.Id == id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteKnjiga(int id)
    {
        var knjiga = await _context.Knjige.FindAsync(id);
        if (knjiga == null) return NotFound();

        var avtorKnjiga = _context.AvtorKnjiga.Where(ak => ak.KnjigeId == id);
        _context.AvtorKnjiga.RemoveRange(avtorKnjiga);

        var rezervacije = _context.Rezervacije.Where(r => r.KnjigeId == id);
        _context.Rezervacije.RemoveRange(rezervacije);

        var izposoje = _context.Izposoje.Where(i => i.KnjigeId == id);
        var izposojeIds = izposoje.Select(i => i.Id);
        var poskodbe = _context.Poskodba.Where(p => izposojeIds.Contains(p.IzposojeId));
        
        _context.Poskodba.RemoveRange(poskodbe);
        _context.Izposoje.RemoveRange(izposoje);

        _context.Knjige.Remove(knjiga);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
