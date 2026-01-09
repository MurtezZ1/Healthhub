using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactApp1.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerminiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TerminiController(ApplicationDbContext context)
        {
            _context = context;



        }

        // GET: api/Termini
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TerminiDTO>>> GetTerminet()
        {
            return await _context.Terminet
                .Select(t => new TerminiDTO
                {
                    Id = t.Id,
                    DoktorId = t.DoktorId,
                    PacientId = t.PacientId,
                    DataTerminit = t.DataTerminit,
                    Statusi = t.Statusi
                })
                .ToListAsync();
        }

        // GET: api/Termini/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TerminiDTO>> GetTermini(string id)
        {
            var termini = await _context.Terminet.FindAsync(id);

            if (termini == null)
            {
                return NotFound();
            }

            return new TerminiDTO
            {
                Id = termini.Id,
                DoktorId = termini.DoktorId,
                PacientId = termini.PacientId,
                DataTerminit = termini.DataTerminit,
                Statusi = termini.Statusi
            };
        }

        // GET: api/Termini/byPacient/{pacientId}
        [HttpGet("byPacient/{pacientId}")]
        public async Task<ActionResult<IEnumerable<TerminiDTO>>> GetTerminetByPacient(string pacientId)
        {
            return await _context.Terminet
                .Where(t => t.PacientId == pacientId)
                .Select(t => new TerminiDTO
                {
                    Id = t.Id,
                    DoktorId = t.DoktorId,
                    PacientId = t.PacientId,
                    DataTerminit = t.DataTerminit,
                    Statusi = t.Statusi
                })
                .ToListAsync();
        }

        // GET: api/Termini/byDoctor/{doctorId}
        [HttpGet("byDoctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<TerminiDTO>>> GetTerminetByDoctor(string doctorId)
        {
            return await _context.Terminet
                .Where(t => t.DoktorId == doctorId)
                .Select(t => new TerminiDTO
                {
                    Id = t.Id,
                    DoktorId = t.DoktorId,
                    PacientId = t.PacientId,
                    DataTerminit = t.DataTerminit,
                    Statusi = t.Statusi
                })
                .ToListAsync();
        }

        // POST: api/Termini
        [HttpPost]
        public async Task<ActionResult<TerminiDTO>> PostTermini([FromBody] TerminiDTO terminiDto)
        {
            try
            {
                if (string.IsNullOrEmpty(terminiDto.PacientId))
                    return BadRequest("Pacienti është i detyrueshëm");

                if (terminiDto.DataTerminit == default)
                    return BadRequest("Data e terminit është e detyrueshme");

                // Log the PacientId to the console
                Console.WriteLine($"Adding appointment for PacientId: {terminiDto.PacientId}");

                var termini = new Termini
                {
                    Id = Guid.NewGuid().ToString(),
                    DoktorId = terminiDto.DoktorId,
                    PacientId = terminiDto.PacientId,
                    DataTerminit = terminiDto.DataTerminit,
                    Statusi = terminiDto.Statusi ?? "I planifikuar"
                };

                _context.Terminet.Add(termini);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTermini), new { id = termini.Id }, terminiDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Gabim në server: {ex.Message}");
            }
        }

        // DELETE: api/Termini/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTermini(string id)
        {
            var termini = await _context.Terminet.FindAsync(id);
            if (termini == null)
            {
                return NotFound();
            }

            _context.Terminet.Remove(termini);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TerminiExists(string id)
        {
            return _context.Terminet.Any(e => e.Id == id);
        }
        // PUT: api/Termini/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTermini(string id, [FromBody] TerminiDTO terminiDto)
        {
            if (id != terminiDto.Id)
            {
                return BadRequest("ID mismatch");
            }

            var termini = await _context.Terminet.FindAsync(id);
            if (termini == null)
            {
                return NotFound();
            }

            try
            {
                termini.DoktorId = terminiDto.DoktorId;
                termini.PacientId = terminiDto.PacientId;
                termini.DataTerminit = terminiDto.DataTerminit;
                termini.Statusi = terminiDto.Statusi;

                _context.Entry(termini).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TerminiExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}