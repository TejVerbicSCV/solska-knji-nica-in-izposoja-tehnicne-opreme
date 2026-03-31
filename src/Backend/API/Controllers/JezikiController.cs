using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JezikiController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public JezikiController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetJeziki()
    {
        var jeziki = await _context.Jeziki.ToListAsync();
        return Ok(jeziki);
    }
}
