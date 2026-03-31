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

    [HttpPost]
    public async Task<IActionResult> AddKnjiga([FromBody] Knjige knjiga)
    {
        _context.Knjige.Add(knjiga);
        await _context.SaveChangesAsync();
        return Ok(knjiga);
    }
}
