using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KategorijeController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public KategorijeController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetKategorije()
    {
        var kategorije = await _context.Kategorije.ToListAsync();
        return Ok(kategorije);
    }
}
