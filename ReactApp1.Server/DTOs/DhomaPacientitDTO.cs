using ReactApp1.Server.Data.Models;

namespace ReactApp1.Server.DTOs
{
    public class DhomaPacientitDTO
    {
        public string Id { get; set; }
        public string PacientId { get; set; }
        public string DhomaId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
    }
}
