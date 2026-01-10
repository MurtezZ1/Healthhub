// using System.ComponentModel.DataAnnotations;
// using System.Text.Json.Serialization;

// namespace ReactApp1.Server.Data.Models
// {
//     public class Pacienti
//     {
//         [Key]
//         public string Id { get; set; }
//         public string? UserId { get; set; }
//         public User User { get; set; }
//         public string Name { get; set; }
//         public string Surname { get; set; }
//         public DateTime Ditelindja { get; set; }

//         public List<Termini> Terminet { get; set; }
//         public List<Historiku> Historiks { get; set; }

//         [JsonIgnore]
//         public List<Fatura> Faturat { get; set; }
//         public List<DhomaPacientit> DhomaPacienteve { get; set; }

//     }
// }
using System;
using System.Collections.Generic;

namespace ReactApp1.Server.Data.Models
{
    public class Pacienti
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public DateTime Ditelindja { get; set; }

        // Foreign key from User
        public string? UserId { get; set; }
        public User? User { get; set; }

        // Relationships
        public List<Termini> Terminet { get; set; } = new List<Termini>();
        public List<Historiku> Historiks { get; set; } = new List<Historiku>();
        public List<Fatura> Faturat { get; set; } = new List<Fatura>();
        public List<DhomaPacientit> DhomaPacienteve { get; set; } = new List<DhomaPacientit>();
    }
}
