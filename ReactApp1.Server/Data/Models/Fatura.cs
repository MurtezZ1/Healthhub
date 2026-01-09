using System.Text.Json.Serialization;

namespace ReactApp1.Server.Data.Models
{
    public class Fatura
    {
        public string Id { get; set; }

        // Foreign key for Patient

        public string PacientId { get; set; }
        [JsonIgnore]
        public Pacienti Pacienti { get; set; }

        // Foreign key for Service
        public string SherbimiId { get; set; }
        public Sherbimi Sherbimi { get; set; }

        public decimal Shuma { get; set; }
        public DateTime Data { get; set; }
        public bool? Paguar { get; set; }
    }
}
