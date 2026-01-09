using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ReactApp1.Server.Data.Models
{
    public class Pacienti
    {
        [Key]
        public string Id { get; set; }
        public string? UserId { get; set; }
        public User User { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public DateTime Ditelindja { get; set; }

        public List<Termini> Terminet { get; set; }
        public List<Historiku> Historiks { get; set; }

        [JsonIgnore]
        public List<Fatura> Faturat { get; set; }
        public List<DhomaPacientit> DhomaPacienteve { get; set; }

    }
}
