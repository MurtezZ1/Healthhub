namespace ReactApp1.Server.Data.Models
{
    public class Sherbimi
    {
        public string Id { get; set; }
        public string Emri_Sherbimit { get; set; }
        public string Pershkrimi { get; set; }
        public decimal Cmimi { get; set; }

        public List<Fatura> Faturat { get; set; }

    }
}
