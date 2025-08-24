using System.ComponentModel.DataAnnotations;


namespace chatapp.Models
{
    public class Chatapp
    {
        [Key]

        public string Employee { get; set; } = string.Empty;

        public string Message_sent { get; set; } = string.Empty;

        public DateTime Time { get; set; } = DateTime.Now;

        public decimal Session_id { get; set; } = decimal.Zero;

    }
}
