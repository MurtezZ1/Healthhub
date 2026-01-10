using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic; // Required for List<RefreshToken>

public class User : IdentityUser
{
   public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public List<RefreshToken> RefreshTokens { get; set; }

}
