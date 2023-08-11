using System.Drawing;

namespace staj.Models.Entities
{
    public class Parsel
    {
        public Guid Id { get; set; }

        public string ilParsel { get; set; } 
        
        public string ilceParsel { get; set; }

        public string mahalleParsel { get; set; }
        public string wkt { get; set; }
    }
}
