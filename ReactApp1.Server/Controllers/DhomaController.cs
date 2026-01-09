using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs; // Ensure this namespace is added
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ReactApp1.Server.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class DhomaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DhomaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Dhoma
        [HttpGet]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<IEnumerable<DhomaDTO>>> GetDhoma()
        {
            var dhomat = await _context.Dhomat.Include(d => d.DhomaPacienteve).ToListAsync();

            // Map to DhomaDTO
            var dhomaDTOs = dhomat.Select(d => new DhomaDTO
            {
                Id = d.Id.ToString(),
                NrDhomes = d.NrDhomes,
                Lloji_Dhomes = d.Lloji_Dhomes,
                Kapaciteti = d.Kapaciteti,
                Available = d.Available
            }).ToList();

            return dhomaDTOs;
        }

        // GET: api/Dhoma/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<DhomaDTO>> GetDhoma(string id)
        {
            var dhoma = await _context.Dhomat.Include(d => d.DhomaPacienteve).FirstOrDefaultAsync(d => d.Id.Equals(id));

            if (dhoma == null)
            {
                return NotFound();
            }

            // Map to DhomaDTO
            var dhomaDTO = new DhomaDTO
            {
                Id = dhoma.Id,
                NrDhomes = dhoma.NrDhomes,
                Lloji_Dhomes = dhoma.Lloji_Dhomes,
                Kapaciteti = dhoma.Kapaciteti,
                Available = dhoma.Available
            };

            return dhomaDTO;
        }

        // PUT: api/Dhoma/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> PutDhoma(string id, DhomaDTO dhomaDTO)
        {
            if (!(id.Equals(dhomaDTO.Id)))
            {
                return BadRequest();
            }

            // Map DhomaDTO to Dhoma entity
            var dhoma = await _context.Dhomat.FindAsync(id);
            if (dhoma == null)
            {
                return NotFound();
            }
            dhoma.Id = dhomaDTO.Id;
            dhoma.NrDhomes = dhomaDTO.NrDhomes;
            dhoma.Lloji_Dhomes = dhomaDTO.Lloji_Dhomes;
            dhoma.Kapaciteti = dhomaDTO.Kapaciteti;
            dhoma.Available = dhomaDTO.Available;

            _context.Entry(dhoma).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DhomaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Dhoma
        [HttpPost]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<DhomaDTO>> PostDhoma(DhomaDTO dhomaDTO)
        {
            // Generate a new GUID for the Id if not provided
            if (string.IsNullOrEmpty(dhomaDTO.Id))
            {
                dhomaDTO.Id = Guid.NewGuid().ToString();
            }

            // Map DhomaDTO to Dhoma entity
            var dhoma = new Dhoma
            {
                Id = dhomaDTO.Id,
                NrDhomes = dhomaDTO.NrDhomes,
                Lloji_Dhomes = dhomaDTO.Lloji_Dhomes,
                Kapaciteti = dhomaDTO.Kapaciteti,
                Available = dhomaDTO.Available
            };

            _context.Dhomat.Add(dhoma);
            await _context.SaveChangesAsync();

            // Map the saved Dhoma entity back to DhomaDTO
            dhomaDTO.Id = dhoma.Id;

            return CreatedAtAction("GetDhoma", new { id = dhoma.Id }, dhomaDTO);
        }

        // DELETE: api/Dhoma/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> DeleteDhoma(string id)
        {
            var dhoma = await _context.Dhomat.FindAsync(id);
            if (dhoma == null)
            {
                return NotFound();
            }

            _context.Dhomat.Remove(dhoma);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DhomaExists(string id)
        {
            return _context.Dhomat.Any(e => e.Id.Equals(id));
        }
    }
}
