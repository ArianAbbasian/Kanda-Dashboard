using Microsoft.AspNetCore.Mvc;
using Login.Data;
using Login.Models;

public class VideoController : Controller
{
    [HttpGet]
    public IActionResult GetVideos()
    {
        var videos = FakeDatabase.Videos
            .OrderByDescending(v => v.UploadDate)
            .Select(v => new { v.Id, v.FileName, v.Title })
            .ToList();
        return Json(videos);
    }
    var videosDir = Path.Combine("wwwroot", "videos");
if (!Directory.Exists(videosDir))
    Directory.CreateDirectory(videosDir);
var filePath = Path.Combine(videosDir, fileName);

    [HttpPost]
    public async Task<IActionResult> Upload(IFormFile file, string title)
    {
        if (file == null || file.Length == 0)
            return Json(new { success = false, message = "فایلی انتخاب نشده است." });

        var allowedExtensions = new[] { ".mp4", ".webm", ".ogg" };
        var ext = Path.GetExtension(file.FileName).ToLower();
        if (!allowedExtensions.Contains(ext))
            return Json(new { success = false, message = "فرمت فایل مجاز نیست." });

        if (file.Length > 100 * 1024 * 1024) // 100 MB
            return Json(new { success = false, message = "حجم فایل نباید بیشتر از 100 مگابایت باشد." });

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine("wwwroot", "videos", fileName);
        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var newVideo = new VideoInfo
        {
            Id = FakeDatabase.Videos.Any() ? FakeDatabase.Videos.Max(v => v.Id) + 1 : 1,
            FileName = fileName,
            Title = title,
            UploadDate = DateTime.Now
        };
        FakeDatabase.Videos.Add(newVideo);

        return Json(new { success = true, message = "ویدیو با موفقیت آپلود شد." });
    }

    [HttpPost]
    public IActionResult DeleteVideo(int id)
    {
        var video = FakeDatabase.Videos.FirstOrDefault(v => v.Id == id);
        if (video == null)
            return Json(new { success = false, message = "ویدیو یافت نشد." });

        // حذف فایل از دیسک
        var filePath = Path.Combine("wwwroot", "videos", video.FileName);
        if (System.IO.File.Exists(filePath))
            System.IO.File.Delete(filePath);

        FakeDatabase.Videos.Remove(video);
        return Json(new { success = true, message = "ویدیو حذف شد." });
    }
}