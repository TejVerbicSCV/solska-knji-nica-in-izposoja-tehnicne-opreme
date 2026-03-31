using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ItemsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetItems()
    {
        var knjige = await _context.Knjige.ToListAsync();
        var oprema = await _context.Oprema.ToListAsync();

        var items = new List<object>();

        foreach (var k in knjige)
        {
            items.Add(new
            {
                id = $"k-{k.Id}",
                naziv = k.Naslov,
                opis = k.Isbn, // Using ISBN as opis for now
                kategorija = "knjiga",
                inventarnaStevilka = k.Id.ToString(),
                lokacija = "Knjižnica A1",
                status = "na_voljo",
                slikaUrl = k.SlikaUrl
            });
        }

        foreach (var o in oprema)
        {
            items.Add(new
            {
                id = $"o-{o.Id}",
                naziv = o.Ime,
                opis = o.Opis,
                kategorija = "oprema",
                inventarnaStevilka = o.SerijskaSt,
                lokacija = "Tehnični kabinet",
                status = "na_voljo",
                slikaUrl = o.SlikaUrl
            });
        }

        return Ok(items);
    }
}
