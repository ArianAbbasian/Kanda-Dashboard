namespace Login.Models
{
    public class Province
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public double? Lat { get; set; } 
        public double? Lon { get; set; }  
        public List<City> Cities { get; set; }
    }
}