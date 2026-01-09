using Microsoft.AspNetCore.Mvc;
using ReactApp1.Server;
using ReactApp1.Server.Data.Models;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IUserService _userService;

    public AuthController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("token")]
    public async Task<IActionResult> GetTokenAsync(TokenRequestModel model)
    {
        var result = await _userService.GetTokenAsync(model);

        if (!string.IsNullOrEmpty(result.RefreshToken))
        {
            SetRefreshTokenInCookie(result.RefreshToken);
        }

        return Ok(result);
    }


    // Sign up endpoint
    [HttpPost("register")]
    public async Task<ActionResult> RegisterAsync(RegisterViewModel model)
    {
        var result = await _userService.RegisterAsync(model);
        return Ok(result); // Adjust the response as needed
    }

    // Login endpoint (providing access and refresh tokens)
    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync(LogInViewModel model)
    {
        var result = await _userService.LoginUserAsync(model);
        if (!result.isSucces)
        {
            return BadRequest(result);
        }

        SetRefreshTokenInCookie(result.RefreshToken);
        return Ok(result);
    }

    // Token refresh endpoint
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        var response = await _userService.RefreshTokenAsync(refreshToken);

        if (!string.IsNullOrEmpty(response.RefreshToken))
            SetRefreshTokenInCookie(response.RefreshToken);

        return Ok(response);
    }

    // Private helper to set the refresh token in the cookie
    private void SetRefreshTokenInCookie(string refreshToken)
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Expires = DateTime.UtcNow.AddDays(10),
        };
        Response.Cookies.Append("refreshToken", refreshToken, cookieOptions);
    }
}
