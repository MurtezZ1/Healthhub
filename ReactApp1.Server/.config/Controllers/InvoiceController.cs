using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace ReactApp1.Server.Controllers

{
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public InvoiceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("{Id}/Invoice")]

        [Authorize(Roles = "Doctor,Administrator")]
        public async Task<IActionResult> GetInvoice(string Id)
        {
            // Fetch patient with their invoices (Faturat) and related Records (Sherbimi)
            var patient = await _context.Pacientet
                .Include(p => p.Faturat) // Include invoices
                    .ThenInclude(f => f.Sherbimi) // Include linked Records
                .Include(p => p.Historiks) // Include medical history
                .FirstOrDefaultAsync(p => p.Id == Id);

            if (patient == null)
            {
                return NotFound(new { message = "Patient not found." });
            }

            // Extract Records from Faturat
            var Records = patient.Faturat.Select(f => new
            {
                Emri_Sherbimit = f.Sherbimi.Emri_Sherbimit,
                Pershkrimi = f.Sherbimi.Pershkrimi,
                Cmimi = f.Sherbimi.Cmimi,
                Quantity = 1 // Default quantity, you can modify based on your logic
            }).ToList();

            // Calculate invoice totals
            var subTotal = Records.Sum(s => s.Cmimi * s.Quantity);
            var discount = 0; // Placeholder for discount logic
            var tax = subTotal * 0.18m; // Example: 18% tax
            var grandTotal = subTotal - discount + tax;

            // Map Historiku data
            var historikuData = patient.Historiks.Select(h => new
            {
                Data = h.Data.ToString("yyyy-MM-dd"),
                Diagnoza = h.Diagnoza,
                Perfundimi = h.Perfundimi
            }).ToList();

            // Build invoice data
            var invoiceData = new
            {
                Patient = new
                {
                    Name = patient.Name,
                    Surname = patient.Surname,
                    Ditelindja = patient.Ditelindja
                },
                Records = Records,
                Historiku = historikuData,
                SubTotal = subTotal,
                Discount = discount,
                Tax = tax,
                GrandTotal = grandTotal,
                Date = DateTime.Now.ToString("yyyy-MM-dd"),
                DueDate = DateTime.Now.AddDays(7).ToString("yyyy-MM-dd")
            };

            return Ok(invoiceData);
        }


    }
}
