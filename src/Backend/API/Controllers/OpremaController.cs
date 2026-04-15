using Microsoft.AspNetCore.Mvc;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OpremaController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public OpremaController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetOprema(int id)
    {
        var oprema = await _context.Oprema.FindAsync(id);
        if (oprema == null) return NotFound();
        return Ok(oprema);
    }

    [HttpPost]
    public async Task<IActionResult> AddOprema([FromBody] Oprema oprema)
    {
        _context.Oprema.Add(oprema);
        await _context.SaveChangesAsync();
        return Ok(oprema);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOprema(int id, [FromBody] Oprema oprema)
    {
        if (id != oprema.Id) return BadRequest();
        _context.Entry(oprema).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateConcurrencyException)
        {
            if (!_context.Oprema.Any(o => o.Id == id)) return NotFound();
            else throw;
        }

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOprema(int id)
    {
        var oprema = await _context.Oprema.FindAsync(id);
        if (oprema == null) return NotFound();

        var rezervacije = _context.Rezervacije.Where(r => r.OpremaId == id);
        _context.Rezervacije.RemoveRange(rezervacije);

        var izposoje = _context.Izposoje.Where(i => i.OpremaId == id);
        var izposojeIds = izposoje.Select(i => i.Id);
        var poskodbe = _context.Poskodba.Where(p => izposojeIds.Contains(p.IzposojeId));
        
        _context.Poskodba.RemoveRange(poskodbe);
        _context.Izposoje.RemoveRange(izposoje);

        _context.Oprema.Remove(oprema);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
