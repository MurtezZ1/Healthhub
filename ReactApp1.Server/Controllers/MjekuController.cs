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
    [Route("api/[controller]")]
    [ApiController]
    public class MjekuController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MjekuController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MjekuDTO>>> GetAllMjeket()
        {
            try
            {
                var doctors = await _context.Mjeket
                    .Where(m => !string.IsNullOrEmpty(m.Specializimi))  // Added missing parenthesis
                    .Where(m => !string.IsNullOrEmpty(m.NumriLicences))
                    .Select(m => new MjekuDTO
                    {
                        Id = m.Id,
                        Specializimi = m.Specializimi,
                        NumriLicences = m.NumriLicences
                    })
                    .ToListAsync();

                if (!doctors.Any())
                {
                    return NotFound(new
                    {
                        Message = "No doctors found with complete information",
                        Suggestion = "Check if Specializimi and NumriLicences are populated in database"
                    });
                }

                return Ok(doctors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "Internal server error while retrieving doctors",
                    Error = ex.Message,
                    Details = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<MjekuDTO>> GetMjeku(string id)
        {
            try
            {
                var mjeku = await _context.Mjeket
                    .FirstOrDefaultAsync(m => m.Id == id);

                if (mjeku == null)
                {
                    return NotFound(new { Message = $"Doctor with ID {id} not found" });
                }

                // Still enforce complete data for single doctor
                if (string.IsNullOrEmpty(mjeku.Specializimi) ||
                    string.IsNullOrEmpty(mjeku.NumriLicences))
                {
                    return BadRequest(new
                    {
                        Message = "Doctor record is incomplete",
                        MissingFields = new List<string> {
                            string.IsNullOrEmpty(mjeku.Specializimi) ? "Specializimi" : null,
                            string.IsNullOrEmpty(mjeku.NumriLicences) ? "NumriLicences" : null
                        }.Where(x => x != null)
                    });
                }

                return Ok(new MjekuDTO
                {
                    Id = mjeku.Id,
                    Specializimi = mjeku.Specializimi,
                    NumriLicences = mjeku.NumriLicences
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = $"Error retrieving doctor with ID {id}",
                    Error = ex.Message
                });
            }
        }

        // PUT: api/Mjeket/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMjeku(string id, MjekuDTO mjekuDto)
        {



            if (id != mjekuDto.Id)
            {
                return BadRequest();
            }

            var mjeku = await _context.Mjeket.FindAsync(id);
            if (mjeku == null)
            {
                return NotFound();
            }

            mjeku.Id = mjekuDto.Id;
            mjeku.Specializimi = mjekuDto.Specializimi;
            mjeku.NumriLicences = mjekuDto.NumriLicences;

            _context.Entry(mjeku).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MjekuExists(int.Parse(id)))
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

        // POST: api/Mjeket
        [HttpPost]
        public async Task<ActionResult<MjekuDTO>> PostMjeku(MjekuDTO mjekuDto)
        {

            var mjeku = new Mjeku
            {
                Id = mjekuDto.Id,
                Specializimi = mjekuDto.Specializimi,
                NumriLicences = mjekuDto.NumriLicences,
            };

            _context.Mjeket.Add(mjeku);
            await _context.SaveChangesAsync();


            return CreatedAtAction(nameof(GetMjeku), new { id = mjeku.Id }, mjekuDto);
        }

        // DELETE: api/Mjeket/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMjeku(string id)
        {
            var mjeku = await _context.Mjeket.FindAsync(id);
            if (mjeku == null)
            {
                return NotFound();
            }

            _context.Mjeket.Remove(mjeku);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MjekuExists(int id)
        {
            return _context.Mjeket.Any(e => e.Id.Equals(id));
        }


        [HttpPost("Regjistro-Pacientin")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> RegisterSimplePatient([FromBody] PacientDTO dto)
        {
            var pacienti = new Pacienti
            {
                Id = dto.Id,
                Name = dto.Name,
                Surname = dto.Surname,
                Ditelindja = dto.Ditelindja
            };

            _context.Pacientet.Add(pacienti);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Patient registered successfully!", PatientId = pacienti.Id });
        }



        [HttpGet("Get-Pacientat")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> GetPatients()
        {
            var patients = await _context.Pacientet
                .Select(p => new
                {
                    Id = p.Id,
                    FullName = $"{p.Name} {p.Surname}"
                })
                .ToListAsync();

            return Ok(patients);
        }





        [HttpPost("Shto-Detajet-Pacientit")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddPatientDetails([FromBody] PatientDetailsDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pacienti = await _context.Pacientet
    .Include(p => p.Terminet)
    .Include(p => p.Historiks)
    .Include(p => p.DhomaPacienteve)
    .FirstOrDefaultAsync(p => p.Id == request.Patient.Id);


            if (pacienti == null)
            {
                return NotFound(new { Message = "Patient not found." });
            }


            foreach (var historiku in request.Historiku)
            {
                var historikuEntity = new Historiku
                {
                    Id = historiku.Id,
                    MjekuId = historiku.MjekuId,
                    PacientId = pacienti.Id,
                    Data = historiku.Data,
                    Anamneza_Statusi = historiku.Anamneza_Statusi,
                    Ekzaminimi = historiku.Ekzaminimi,
                    Diagnoza = historiku.Diagnoza
                };
                _context.Historiks.Add(historikuEntity);
            }

            if (request.DhomaPacienteve != null)
            {
                foreach (var dhoma in request.DhomaPacienteve)
                {
                    var dhomaPacientiEntity = new DhomaPacientit
                    {
                        DhomaId = dhoma.DhomaId,
                        CheckInDate = dhoma.CheckInDate,
                        CheckOutDate = dhoma.CheckOutDate,
                        PacientId = pacienti.Id
                    };
                    _context.DhomaPacienteve.Add(dhomaPacientiEntity);
                }
            }



            await _context.SaveChangesAsync();

            return Ok(new { Message = "Patient details updated successfully!", PatientId = pacienti.Id });
        }



        [HttpPost("Shto-Faturen")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> AddInvoice([FromBody] FaturaDTO request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var pacienti = await _context.Pacientet
                .FirstOrDefaultAsync(p => p.Id == request.PacientId);

            if (pacienti == null)
            {
                return NotFound(new { Message = "Patient not found." });
            }

            var fatura = new Fatura
            {
                Id = request.Id,
                SherbimiId = request.SherbimiId,
                Shuma = request.Shuma,
                Data = request.Data,
                Paguar = request.Paguar,
                PacientId = pacienti.Id
            };

            _context.Faturat.Add(fatura);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Invoice added successfully!", InvoiceId = fatura.Id });
        }

        [HttpGet("CountAllPatients")]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CountPatients()
        {
            try
            {
                var totalPatientCount = await _context.Pacientet.CountAsync();
                return Ok(new { TotalPatientCount = totalPatientCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Message = "An error occurred while counting all patients.",
                    Error = ex.Message
                });
            }
        }
        // [Other methods remain exactly the same...]
        // PUT, POST, DELETE and other endpoints stay unchanged
        // ...
    }
}