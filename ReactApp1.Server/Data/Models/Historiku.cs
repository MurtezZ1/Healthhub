using System.Numerics;

namespace ReactApp1.Server.Data.Models
{
    public class Historiku
    {
        public string Id { get; set; }

        public string MjekuId { get; set; }
        public Mjeku Mjeku { get; set; }

        public string PacientId { get; set; }
        public Pacienti Pacienti { get; set; }

        public DateTime Data { get; set; }
        public string? Anamneza_Statusi { get; set; }
        public string? Ekzaminimi { get; set; }
        public string? Diagnoza { get; set; }
        public string? Terapia { get; set; }
        public string? Perfundimi { get; set; }


    }
}
