using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ReactApp1.Server.DTOs;
using ReactApp1.Server.Migrations;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ReactApp1.Server.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class PacientiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PacientiController(ApplicationDbContext context)
        {
            _context = context;
        }




        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Pacienti>>> GetPacientet()
        {
            return await _context.Pacientet
                .Include(p => p.User)
                .ToListAsync();
        }





        [HttpGet("Get-Specific-Patient")]
        [Authorize(Roles = "Doctor")]
        public async Task<ActionResult<Pacienti>> GetPacienti(string id)
        {
            var pacienti = await _context.Pacientet
                .Include(p => p.User)
                .Include(p => p.Terminet)
                .Include(p => p.Historiks)
                .FirstOrDefaultAsync(p => p.Id.Equals(id));

            if (pacienti == null)
            {
                return NotFound();
            }

            return Ok(pacienti);
        }



        [HttpPost("Update-Pacienti")]
        [Authorize]
        public async Task<IActionResult> PutPacienti(string id, PacientDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest("The ID in the URL does not match the ID in the request body.");
            }

            var existingPacienti = await _context.Pacientet.FindAsync(id);
            if (existingPacienti == null)
            {
                return NotFound($"No patient found with ID: {id}");
            }

            existingPacienti.Name = request.Name;
            existingPacienti.Surname = request.Surname;
            existingPacienti.Ditelindja = request.Ditelindja;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PacientiExists(id))
                {
                    return NotFound($"No patient found with ID: {id}");
                }
                else
                {
                    throw;
                }
            }

            return Ok("User updated succesfully");
        }

        private bool PacientiExists(string id)
        {
            throw new NotImplementedException();
        }

        [HttpPost("Add-Patient")]
        [Authorize]
        public async Task<ActionResult<Pacienti>> PostPacienti(PacientDTO request)
        {
            try
            {
                var pacienti = new Pacienti
                {
                    Id = request.Id,
                    Name = request.Name,
                    Surname = request.Surname,
                    Ditelindja = request.Ditelindja
                };

                _context.Pacientet.Add(pacienti);
                await _context.SaveChangesAsync();

                return CreatedAtAction("GetPacienti", new { id = pacienti.Id }, pacienti);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePacienti(string id)
        {
            var pacienti = await _context.Pacientet
            .Include(p => p.Terminet)
            .Include(p => p.Historiks)
            .FirstOrDefaultAsync(p => p.Id == id);


            if (pacienti == null)
            {
                return NotFound("Pacienti with the specified ID was not found.");
            }


            if (pacienti.Terminet.Any() || pacienti.Historiks.Any())
            {
                return BadRequest("Cannot delete this pacienti as they have associated appointments or history.");
            }

            try
            {
                _context.Pacientet.Remove(pacienti);
                await _context.SaveChangesAsync();

                return Ok($"Pacienti was successfully deleted. UserId: {pacienti.Id}, Name: {pacienti.Name}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetPatientsBatch")]
        public async Task<ActionResult<IEnumerable<Pacienti>>> GetPatientsBatch([FromQuery] string ids)
        {
            if (string.IsNullOrEmpty(ids))
            {
                return BadRequest("No patient IDs provided");
            }

            var patientIds = ids.Split(',').ToList();
            var patients = await _context.Pacientet
                .Where(p => patientIds.Contains(p.Id))
                .Include(p => p.User)
                .Select(p => new {
                    id = p.Id,
                    name = p.Name,
                    surname = p.Surname
                })
                .ToListAsync();

            if (patients == null || !patients.Any())
            {
                return NotFound("No patients found with the provided IDs");
            }

            return Ok(patients);
        }

        [HttpGet("byUserId/{userId}")]
        public async Task<IActionResult> GetByUserId(string userId)
        {
            var pacient = await _context.Pacientet.FirstOrDefaultAsync(p => p.UserId == userId);
            if (pacient == null)
                return NotFound();
            return Ok(pacient);
        }
    }
}
