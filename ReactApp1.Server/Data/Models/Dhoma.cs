using System.ComponentModel.DataAnnotations;

namespace ReactApp1.Server.Data.Models
{
    public class Dhoma
    {
        [Key]
        public string Id { get; set; }
        public string NrDhomes { get; set; }
        public string Lloji_Dhomes { get; set; }
        public int Kapaciteti { get; set; }
        public bool Available { get; set; }

        public List<DhomaPacientit> DhomaPacienteve { get; set; }//

    }
}
