using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class DhomaPacientitController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DhomaPacientitController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/DhomaPacientit
        [HttpGet]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<IEnumerable<DhomaPacientitDTO>>> GetDhomaPacientit()
        {
            var dhomaPacienteve = await _context.DhomaPacienteve
                .Include(dp => dp.Pacienti)
                .Include(dp => dp.Dhoma)
                .ToListAsync();

            return dhomaPacienteve.Select(dp => new DhomaPacientitDTO
            {
                Id = dp.Id,
                PacientId = dp.PacientId,
                DhomaId = dp.DhomaId,
                CheckInDate = dp.CheckInDate,
                CheckOutDate = dp.CheckOutDate
            }).ToList();
        }

        // GET: api/DhomaPacientit/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<DhomaPacientitDTO>> GetDhomaPacientit(string id)
        {
            var dhomaPacientit = await _context.DhomaPacienteve
                .Include(dp => dp.Pacienti)
                .Include(dp => dp.Dhoma)
                .FirstOrDefaultAsync(dp => dp.Id.Equals(id));

            if (dhomaPacientit == null)
            {
                return NotFound();
            }

            return new DhomaPacientitDTO
            {
                PacientId = dhomaPacientit.PacientId,
                DhomaId = dhomaPacientit.DhomaId,
                CheckInDate = dhomaPacientit.CheckInDate,
                CheckOutDate = dhomaPacientit.CheckOutDate
            };
        }

        // PUT: api/DhomaPacientit/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> PutDhomaPacientit(string id, DhomaPacientitDTO dhomaPacientitDTO)
        {
/*            if (id != dhomaPacientitDTO.DhomaId)
            {
                return BadRequest("ID mismatch.");
            }*/

            var dhomaPacientit = await _context.DhomaPacienteve.FindAsync(id);
            if (dhomaPacientit == null)
            {
                return NotFound();
            }

            dhomaPacientit.PacientId = dhomaPacientitDTO.PacientId;
            dhomaPacientit.DhomaId = dhomaPacientitDTO.DhomaId;
            dhomaPacientit.CheckInDate = dhomaPacientitDTO.CheckInDate;
            dhomaPacientit.CheckOutDate = dhomaPacientitDTO.CheckOutDate;

            _context.Entry(dhomaPacientit).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DhomaPacientitExists(id))
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

        // POST: api/DhomaPacientit
        [HttpPost]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<DhomaPacientitDTO>> PostDhomaPacientit([FromBody] DhomaPacientitDTO dhomaPacientitDTO)
        {
            // Log the received request for debugging
            Console.WriteLine($"Received Data: {System.Text.Json.JsonSerializer.Serialize(dhomaPacientitDTO)}");

            if (dhomaPacientitDTO == null)
            {
                return BadRequest("Invalid data received.");
            }

            if (string.IsNullOrEmpty(dhomaPacientitDTO.PacientId) || string.IsNullOrEmpty(dhomaPacientitDTO.DhomaId))
            {
                return BadRequest("PacientId and DhomaId are required.");
            }

            // Check if the room already has 3 patients
            if (await IsRoomFull(dhomaPacientitDTO.DhomaId))
            {
                return BadRequest("This room already has the maximum allowed number of patients (3).");
            }

            var dhomaPacientit = new DhomaPacientit
            {
                Id = Guid.NewGuid().ToString(),
                PacientId = dhomaPacientitDTO.PacientId,
                DhomaId = dhomaPacientitDTO.DhomaId,
                CheckInDate = dhomaPacientitDTO.CheckInDate,
                CheckOutDate = dhomaPacientitDTO.CheckOutDate
            };

            _context.DhomaPacienteve.Add(dhomaPacientit);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDhomaPacientit", new { id = dhomaPacientit.Id }, dhomaPacientitDTO);
        }

        // DELETE: api/DhomaPacientit/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> DeleteDhomaPacientit(string id)
        {
            var dhomaPacientit = await _context.DhomaPacienteve.FindAsync(id);
            if (dhomaPacientit == null)
            {
                return NotFound();
            }

            _context.DhomaPacienteve.Remove(dhomaPacientit);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Check if the room is full (i.e., already has 3 patients)
        private async Task<bool> IsRoomFull(string dhomaId)
        {
            var currentPatientsInRoom = await _context.DhomaPacienteve
                .Where(dp => dp.DhomaId == dhomaId && dp.CheckOutDate == null)
                .CountAsync();

            return currentPatientsInRoom >= 3;
        }

        private bool DhomaPacientitExists(string id)
        {
            return _context.DhomaPacienteve.Any(e => e.Id.Equals(id));
        }
    }
}

