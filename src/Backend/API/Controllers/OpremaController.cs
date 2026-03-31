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

    [HttpPost]
    public async Task<IActionResult> AddOprema([FromBody] Oprema oprema)
    {
        _context.Oprema.Add(oprema);
        await _context.SaveChangesAsync();
        return Ok(oprema);
    }
}
