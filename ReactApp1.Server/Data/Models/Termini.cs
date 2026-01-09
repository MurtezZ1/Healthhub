
using System.Numerics;

namespace ReactApp1.Server.Data.Models
{
    public class Termini
    {
        public string Id { get; set; }


        public DateTime DataTerminit { get; set; }
        public string Statusi { get; set; } 

        public string DoktorId { get; set; }
        public Mjeku Mjeku { get; set; }

        public string PacientId { get; set; }
        public Pacienti Pacienti { get; set; }
    }
}
