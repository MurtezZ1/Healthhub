namespace ReactApp1.Server.DTOs
{
    public class FaturaDTO
    {
        public string? Id { get; set; }
        public string PacientId { get; set; }
        public string SherbimiId { get; set; }
        public decimal Shuma { get; set; }
        public DateTime Data { get; set; }
        public bool? Paguar { get; set; }
    }
}
