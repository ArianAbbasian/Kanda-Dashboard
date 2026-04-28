using System.ComponentModel.DataAnnotations;

namespace Login.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }  

        [Required(ErrorMessage = "نام را وارد کنید")]
        [StringLength(50, ErrorMessage = "نام نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "نام خانوادگی را وارد کنید")]
        [StringLength(50, ErrorMessage = "نام خانوادگی نمی‌تواند بیشتر از ۵۰ کاراکتر باشد")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "نام کاربری را وارد کنید")]
        [StringLength(30, MinimumLength = 3, ErrorMessage = "نام کاربری باید بین ۳ تا ۳۰ کاراکتر باشد")]
        public string Username { get; set; }

        [Required(ErrorMessage = "کلمه عبور را وارد کنید")]
        [DataType(DataType.Password)]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "کلمه عبور باید حداقل ۶ کاراکتر باشد")]
        public string Password { get; set; }

        [Required(ErrorMessage = "ایمیل را وارد کنید")]
        [EmailAddress(ErrorMessage = "ایمیل معتبر وارد کنید")]
        public string Email { get; set; }

        [Required(ErrorMessage = "شماره تماس را وارد کنید")]
        [RegularExpression(@"^(\+98|0)?9\d{9}$", ErrorMessage = "شماره تماس معتبر وارد کنید")]

        public string Phone { get; set; }

        public int? ProvinceId { get; set; } 
        public int? CityId { get; set; }
        public double? Lon { get; set; } 
        public double? Lat { get; set; }
        public string UserType { get; set; }  // value: "user", "admin", "special", "plus"
    }
}