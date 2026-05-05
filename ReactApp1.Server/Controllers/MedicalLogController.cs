using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server.Data.Models;
using ReactApp1.Server.Services;

namespace ReactApp1.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicalLogController : ControllerBase
    {
        private readonly MedicalLogService _medicalLogService;

        public MedicalLogController(MedicalLogService medicalLogService)
        {
            _medicalLogService = medicalLogService;
        }

        [HttpGet]
        public async Task<List<MedicalLog>> Get() =>
            await _medicalLogService.GetAsync();

        [HttpGet("{id:length(24)}")]
        public async Task<ActionResult<MedicalLog>> Get(string id)
        {
            var log = await _medicalLogService.GetAsync(id);

            if (log is null)
            {
                return NotFound();
            }

            return log;
        }

        [HttpPost]
        public async Task<IActionResult> Post(MedicalLog newLog)
        {
            await _medicalLogService.CreateAsync(newLog);

            return CreatedAtAction(nameof(Get), new { id = newLog.Id }, newLog);
        }
    }
}
