using ReactApp1.Server.Data.Models;

namespace ReactApp1.Server.DTOs
{
    public class TerminiDTO
    {
        public string Id { get; set; }
        public string DoktorId { get; set; }
        public string PacientId { get; set; }
        public DateTime DataTerminit { get; set; }
        public string Statusi { get; set; }

      

    }
}
