using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;
using System.Threading.Tasks;

namespace SolskaKnjiznica.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;

    public UploadController(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Nobena datoteka ni bila izbrana." });
        }

        try
        {
            // Set storage path: wwwroot/uploads
            var uploadsPath = Path.Combine(_environment.ContentRootPath, "wwwroot", "uploads");

            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            // Generate unique filename to avoid overwrites
            var fileExtension = Path.GetExtension(file.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // The URL should be relative, starting with /uploads/
            // Note: In local development, you'll need the base backend URL
            return Ok(new { url = $"/uploads/{uniqueFileName}" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Napaka pri nalaganju: {ex.Message}" });
        }
    }
}
