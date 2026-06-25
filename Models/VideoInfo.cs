namespace Login.Models
{
    public class VideoInfo
    {
        public int Id { get; set; }
        public string FileName { get; set; }   // نام فایل روی دیسک
        public string Title { get; set; }      // عنوان نمایشی
        public DateTime UploadDate { get; set; }
    }
}           