using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server;
using ReactApp1.Server.Data.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly ApplicationDbContext _context;

    public UserController(IUserService userService, UserManager<User> userManager, RoleManager<IdentityRole> roleManager, ApplicationDbContext context)
    {
        _userService = userService;
        _userManager = userManager;
        _roleManager = roleManager;
        _context = context;
    }

    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync(RegisterViewModel model)
    {
        var result = await _userService.RegisterAsync(model);
        return Ok(result);
    }

    private void SetRefreshTokenInCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(10),
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }

    [HttpPost("token")]
    public async Task<IActionResult> GetTokenAsync(TokenRequestModel model)
    {
        var result = await _userService.GetTokenAsync(model);
        SetRefreshTokenInCookie(result.RefreshToken);
        return Ok(result);
    }

    [HttpPost("addrole")]
    public async Task<IActionResult> AddRoleAsync(AddRoleModel model)
    {
        var result = await _userService.AddRoleAsync(model);
        return Ok(result);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var response = await _userService.RefreshTokenAsync(refreshToken);
        if (!string.IsNullOrEmpty(response.RefreshToken))
            SetRefreshTokenInCookie(response.RefreshToken);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("tokens/{id}")]
    public IActionResult GetRefreshTokens(string id)
    {
        var user = _userService.GetById(id);
        return Ok(user.RefreshTokens);
    }

    [HttpPost("revoke-token")]
    public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest model)
    {
        var token = model.Token ?? Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(token))
            return BadRequest(new { message = "Token is required" });

        var response = _userService.RevokeToken(token);

        if (!response)
            return NotFound(new { message = "Token not found" });

        return Ok(new { message = "Token revoked" });
    }

    // Method to view all users
    [HttpGet]
    //[Authorize(Roles = "Administrator")]
    public async Task<ActionResult<IEnumerable<User>>> GetAllUsersAsync()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();

            if (users == null)
            {
                return NotFound("No users found.");
            }

            // Get roles for each user
            var usersWithRoles = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new
                {
                    user.Id,
                    user.FirstName,
                    user.LastName,
                    user.Email,
                    user.PhoneNumber,
                    user.EmailConfirmed,
                    user.RefreshTokens,
                    Roles = roles
                });
            }

            return Ok(usersWithRoles);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Get user by ID
    [HttpGet("{id}")]
    //[Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> GetUserById(string id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var userWithRoles = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Email,
                user.PhoneNumber,
                user.EmailConfirmed,
                user.RefreshTokens,
                Roles = roles
            };

            return Ok(userWithRoles);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Update user
    [HttpPut("{id}")]
    //[Authorize(Roles = "Administrator")]
    public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserModel model)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update user properties
            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.Email = model.Email;

            var result = await _userManager.UpdateAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "User updated successfully." });
            }
            else
            {
                return BadRequest(new { message = "Failed to update user.", errors = result.Errors });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Delete user
    [HttpDelete("{id}")]
    //[Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteUser(string id)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if user is associated with any doctor or patient records
            var doctorRecord = await _context.Mjeket.FirstOrDefaultAsync(m => m.UserId == id);
            var patientRecord = await _context.Pacientet.FirstOrDefaultAsync(p => p.UserId == id);

            if (doctorRecord != null)
            {
                // Check if doctor has any appointments or history records
                var hasAppointments = await _context.Terminet.AnyAsync(t => t.DoktorId == doctorRecord.Id);
                var hasHistory = await _context.Historiks.AnyAsync(h => h.MjekuId == doctorRecord.Id);

                if (hasAppointments || hasHistory)
                {
                    return BadRequest(new { message = "Cannot delete user. Doctor has associated appointments or medical history records." });
                }

                // Remove doctor record
                _context.Mjeket.Remove(doctorRecord);
            }

            if (patientRecord != null)
            {
                // Check if patient has any appointments, history, invoices, or room assignments
                var hasAppointments = await _context.Terminet.AnyAsync(t => t.PacientId == patientRecord.Id);
                var hasHistory = await _context.Historiks.AnyAsync(h => h.PacientId == patientRecord.Id);
                var hasInvoices = await _context.Faturat.AnyAsync(f => f.PacientId == patientRecord.Id);
                var hasRoomAssignments = await _context.DhomaPacienteve.AnyAsync(dp => dp.PacientId == patientRecord.Id);

                if (hasAppointments || hasHistory || hasInvoices || hasRoomAssignments)
                {
                    return BadRequest(new { message = "Cannot delete user. Patient has associated appointments, medical history, invoices, or room assignments." });
                }

                // Remove patient record
                _context.Pacientet.Remove(patientRecord);
            }

            // Save changes to remove related records
            await _context.SaveChangesAsync();

            // Now delete the user
            var result = await _userManager.DeleteAsync(user);
            if (result.Succeeded)
            {
                return Ok(new { message = "User deleted successfully." });
            }
            else
            {
                return BadRequest(new { message = "Failed to delete user.", errors = result.Errors });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Get all available roles
    [HttpGet("roles")]
    //[Authorize(Roles = "Administrator")]
    public async Task<ActionResult<IEnumerable<string>>> GetAllRoles()
    {
        try
        {
            var roles = _roleManager.Roles.Select(r => r.Name).ToList();
            return Ok(roles);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    // Change user role
    [HttpPost("changerole")]
    //[Authorize(Roles = "Administrator")]
    public async Task<IActionResult> ChangeUserRole([FromBody] ChangeRoleModel model)
    {
        try
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if role exists
            if (!await _roleManager.RoleExistsAsync(model.Role))
            {
                return BadRequest(new { message = "Role does not exist." });
            }

            // Get current roles
            var currentRoles = await _userManager.GetRolesAsync(user);
            
            // Remove current roles
            if (currentRoles.Any())
            {
                await _userManager.RemoveFromRolesAsync(user, currentRoles);
            }

            // Add new role
            var result = await _userManager.AddToRoleAsync(user, model.Role);
            if (result.Succeeded)
            {
                return Ok(new { message = $"Role changed to {model.Role} successfully." });
            }
            else
            {
                return BadRequest(new { message = "Failed to change role.", errors = result.Errors });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}

// Model for updating user
public class UpdateUserModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
}

// Model for changing user role
public class ChangeRoleModel
{
    public string Email { get; set; }
    public string Role { get; set; }
}