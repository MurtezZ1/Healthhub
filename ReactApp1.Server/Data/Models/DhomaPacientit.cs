using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Data.Models
{
    public class DhomaPacientit
    {
        [Key]
        public string Id { get; set; }

        // Foreign key for Patient
        public string PacientId { get; set; }
        public Pacienti Pacienti { get; set; }

        // Foreign key for Room
        public string DhomaId { get; set; }
        public Dhoma Dhoma { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
    }
}
