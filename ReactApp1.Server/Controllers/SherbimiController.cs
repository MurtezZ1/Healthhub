using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs;
using ReactApp1.Server.Migrations;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SherbimiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SherbimiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sherbimi>>> GetSherbimet()
        {
            var sherbimet = await _context.Sherbimet
                .ToListAsync();

            return Ok(sherbimet);
        }

        // GET: api/Sherbimi/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sherbimi>> GetSherbimi(string id)
        {
            var sherbimi = await _context.Sherbimet
                .FirstOrDefaultAsync(s => s.Id == id);

            if (sherbimi == null)
            {
                return NotFound();
            }

            return Ok(sherbimi);
        }

        // POST: api/Sherbimi
        [HttpPost]
        public async Task<ActionResult<Sherbimi>> PostSherbimi(SherbimiDTO request)
        {
            var sherbimi = new Sherbimi
            {
                Id = request.Id,
                Emri_Sherbimit = request.Emri_Sherbimit,
                Pershkrimi = request.Pershkrimi,
                Cmimi = request.Cmimi
            };

            _context.Sherbimet.Add(sherbimi);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSherbimi), new { id = sherbimi.Id }, sherbimi);
        }

        // PUT: api/Sherbimi/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSherbimi(string id, SherbimiDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest("ID mismatch between route and request body.");
            }

            var existingSherbimi = await _context.Sherbimet.FindAsync(id);
            if (existingSherbimi == null)
            {
                return NotFound();
            }
            existingSherbimi.Id = request.Id;
            existingSherbimi.Emri_Sherbimit = request.Emri_Sherbimit;
            existingSherbimi.Pershkrimi = request.Pershkrimi;
            existingSherbimi.Cmimi = request.Cmimi;

            _context.Entry(existingSherbimi).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SherbimiExists(id))
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

        // DELETE: api/Sherbimi/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSherbimi(string id)
        {
            var sherbimi = await _context.Sherbimet.FindAsync(id);
            if (sherbimi == null)
            {
                return NotFound();
            }

            _context.Sherbimet.Remove(sherbimi);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SherbimiExists(string id)
        {
            return _context.Sherbimet.Any(e => e.Id == id);
        }
    }
}
