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
    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Nobena datoteka ni bila izbrana." });
        }

        if (file.Length > 2 * 1024 * 1024) // Limit to 2MB for base64 storage
        {
            return BadRequest(new { message = "Slika je prevelika (omejitev je 2MB)." });
        }

        try
        {
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                var fileBytes = ms.ToArray();
                var base64String = Convert.ToBase64String(fileBytes);
                var contentType = file.ContentType;
                
                // Return as Data URI (e.g., data:image/jpeg;base64,...)
                var dataUri = $"data:{contentType};base64,{base64String}";
                
                return Ok(new { url = dataUri });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Napaka pri pretvorbi: {ex.Message}" });
        }
    }
}
