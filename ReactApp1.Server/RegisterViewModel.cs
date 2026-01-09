using System;
using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server
{
    public class RegisterViewModel {


        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }
        [Required]
        public string Username { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public DateTime Ditelindja { get; set; }
    }
}
