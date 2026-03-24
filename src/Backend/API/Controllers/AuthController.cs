using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SolskaKnjiznica.Core.Entities;
using SolskaKnjiznica.Infrastructure.Persistence;
using BCrypt.Net;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AuthController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var user = await _context.Uporabniki
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.GesloHash))
            return Unauthorized("Neveljaven e-poštni naslov ali geslo");

        return Ok(new
        {
            id = user.Id.ToString(),
            email = user.Email,
            ime = user.Ime,
            priimek = user.Priimek,
            vloga = user.Vloga
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // Check if user already exists
        if (await _context.Uporabniki.AnyAsync(u => u.Email == request.Email))
            return BadRequest("Uporabnik s tem e-poštnim naslovom že obstaja");

        var user = new Uporabnik
        {
            Email = request.Email,
            GesloHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Ime = request.Ime,
            Priimek = request.Priimek,
            Vloga = request.Vloga,
            UstvarjenOb = DateTime.UtcNow
        };

        _context.Uporabniki.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            id = user.Id.ToString(),
            email = user.Email,
            ime = user.Ime,
            priimek = user.Priimek,
            vloga = user.Vloga
        });
    }

    public record LoginRequest(string Email, string Password);
    public record RegisterRequest(string Email, string Password, string Ime, string Priimek, string Vloga);
}
