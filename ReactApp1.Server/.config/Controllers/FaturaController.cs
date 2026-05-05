using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ReactApp1.Server.Controllers
{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class FaturaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FaturaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Fatura
        [HttpGet]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<IEnumerable<Fatura>>> GetFaturas()
        {
            var faturas = await _context.Faturat
                .Include(f => f.Pacienti)  // Include related Pacienti
                .ToListAsync();

            return Ok(faturas);
        }

        // GET: api/Fatura/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<Fatura>> GetFatura(string id)
        {
            var fatura = await _context.Faturat
                .Include(f => f.Pacienti)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (fatura == null)
            {
                return NotFound();
            }

            return Ok(fatura);
        }

        // POST: api/Fatura
        [HttpPost]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<ActionResult<Fatura>> PostFatura(FaturaDTO request)
        {
            if (string.IsNullOrEmpty(request.Id))
            {
                request.Id = Guid.NewGuid().ToString();
            }
            var fatura = new Fatura
            {
                Id = request.Id,
                PacientId = request.PacientId,
                SherbimiId = request.SherbimiId,
                Shuma = request.Shuma,
                Data = request.Data,
                Paguar = request.Paguar ?? false
            };
            _context.Faturat.Add(fatura);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetFatura), new { id = fatura.Id }, fatura);
        }

        // PUT: api/Fatura/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> PutFatura(string id, FaturaDTO request)
        {
            if (id != request.Id)
            {
                return BadRequest("ID mismatch between route and request body.");
            }

            var existingFatura = await _context.Faturat.FindAsync(id);
            if (existingFatura == null)
            {
                return NotFound();
            }
            existingFatura.Id = request.Id;
            existingFatura.PacientId = request.PacientId;
            existingFatura.SherbimiId = request.SherbimiId;
            existingFatura.Shuma = request.Shuma;
            existingFatura.Data = request.Data;
            existingFatura.Paguar = request.Paguar ?? false;

            _context.Entry(existingFatura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FaturaExists(id))
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

        // DELETE: api/Fatura/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> DeleteFatura(string id)
        {
            var fatura = await _context.Faturat.FindAsync(id);
            if (fatura == null)
            {
                return NotFound();
            }

            _context.Faturat.Remove(fatura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FaturaExists(string id)
        {
            return _context.Faturat.Any(e => e.Id == id);
        }
    }
}
