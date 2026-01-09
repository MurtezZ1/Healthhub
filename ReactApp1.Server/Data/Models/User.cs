using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic; // Required for List<RefreshToken>

public class User : IdentityUser
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; }

}
