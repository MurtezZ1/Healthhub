using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Doctor")]
    [Route("api/[controller]")]
    [ApiController]
    public class HistorikuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HistorikuController> _logger;

        public HistorikuController(ApplicationDbContext context, ILogger<HistorikuController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Historiku
        [HttpGet]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetHistoriku()
        {
            try
            {
                var historikuList = await _context.Historiks
                    .Include(h => h.Mjeku)
                    .Include(h => h.Pacienti)
                    .ToListAsync();

                return Ok(historikuList.Select(h => new HistorikuDTO {
                    Id = h.Id,
                    MjekuId = h.MjekuId,
                    PacientId = h.PacientId,
                    Data = h.Data,
                    Anamneza_Statusi = h.Anamneza_Statusi,
                    Ekzaminimi = h.Ekzaminimi,
                    Diagnoza = h.Diagnoza,
                    Terapia = h.Terapia,
                    Perfundimi = h.Perfundimi
                }).ToList());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching Historiku data");
                return StatusCode(500, "Internal server error");
            }
        }

        // GET: api/Historiku/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetHistoriku(string id)
        {
            try
            {
                var historiku = await _context.Historiks
                    .Include(h => h.Mjeku)
                    .Include(h => h.Pacienti)
                    .FirstOrDefaultAsync(h => h.Id == id);

                if (historiku == null)
                {
                    return NotFound();
                }

                return Ok(historiku);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while fetching Historiku data");
                return StatusCode(500, "Internal server error");
            }
        }

        // POST: api/Historiku
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> PostHistoriku(HistorikuDTO historikuDTO)
        {
            try
            {
                // Validation checks for MjekuId and PacientId
                if (string.IsNullOrEmpty(historikuDTO.MjekuId) || string.IsNullOrEmpty(historikuDTO.PacientId))
                {
                    return BadRequest("MjekuId and PacientId cannot be null or empty.");
                }

                // Check if the Mjeku (Doctor) exists in the Mjeket table
                var mjekuExists = await _context.Mjeket.AnyAsync(m => m.Id == historikuDTO.MjekuId);

                // Check if the Pacienti (Patient) exists in the Pacientet table
                var pacientExists = await _context.Pacientet.AnyAsync(p => p.Id == historikuDTO.PacientId);

                if (!mjekuExists || !pacientExists)
                {
                    return BadRequest("Mjeku or Pacient does not exist.");
                }

                // Create a new Historiku entity and map the data from HistorikuDTO
                var historiku = new Historiku
                {
                    Id = Guid.NewGuid().ToString(),  // Generate new GUID for the Id
                    MjekuId = historikuDTO.MjekuId,
                    PacientId = historikuDTO.PacientId,
                    Data = historikuDTO.Data,
                    Anamneza_Statusi = historikuDTO.Anamneza_Statusi,
                    Ekzaminimi = historikuDTO.Ekzaminimi,
                    Diagnoza = historikuDTO.Diagnoza,
                    Terapia = historikuDTO.Terapia,
                    Perfundimi = historikuDTO.Perfundimi
                };

                // Add the new Historiku entity to the database
                _context.Historiks.Add(historiku);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetHistoriku), new { id = historiku.Id }, historiku);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while adding Historiku");
                return StatusCode(500, "Internal server error");
            }
        }

        // PUT: api/Historiku/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> PutHistoriku(string id, HistorikuDTO historikuDTO)
        {
            try
            {
                if (id != historikuDTO.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var historiku = await _context.Historiks.FindAsync(id);

                if (historiku == null)
                {
                    return NotFound();
                }

                // Map updated fields from HistorikuDTO
                historiku.MjekuId = historikuDTO.MjekuId;
                historiku.PacientId = historikuDTO.PacientId;
                historiku.Data = historikuDTO.Data;
                historiku.Anamneza_Statusi = historikuDTO.Anamneza_Statusi;
                historiku.Ekzaminimi = historikuDTO.Ekzaminimi;
                historiku.Diagnoza = historikuDTO.Diagnoza;
                historiku.Terapia = historikuDTO.Terapia;
                historiku.Perfundimi = historikuDTO.Perfundimi;

                _context.Entry(historiku).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating Historiku");
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/Historiku/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> DeleteHistoriku(string id)
        {
            try
            {
                var historiku = await _context.Historiks.FindAsync(id);
                if (historiku == null)
                {
                    return NotFound();
                }

                _context.Historiks.Remove(historiku);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while deleting Historiku");
                return StatusCode(500, "Internal server error");
            }
        }

        private bool HistorikuExists(string id)
        {
            return _context.Historiks.Any(e => e.Id == id);
        }
    }
}
