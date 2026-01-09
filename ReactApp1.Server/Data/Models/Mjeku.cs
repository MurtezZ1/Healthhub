namespace ReactApp1.Server.Data.Models
{
    public class Mjeku
    {
        public string Id { get; set; }

        public string Specializimi { get; set; }
        public string NumriLicences { get; set; }

        // Foreign key from User
        public string? UserId { get; set; }
        public User User { get; set; } 


        public List<Termini> Terminet { get; set; }
        public List<Historiku> Historiqet { get; set; }
    }

}
