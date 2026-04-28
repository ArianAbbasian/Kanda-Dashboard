using Microsoft.AspNetCore.Mvc;
using Login.Models;
using Login.Data;

public class AuthController : Controller
{

    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Login(string username, string password)
    {
        var user = FakeDatabase.Users.FirstOrDefault(u =>
            u.Username == username && u.Password == password);

        if (user == null)
        {
            ViewBag.Error = "نام کاربری یا رمز اشتباه است";
            return View();
        }

        HttpContext.Session.SetString("Username", user.Username);
        HttpContext.Session.SetString("ShowWelcome", "true");
        HttpContext.Session.SetString("WelcomeName", user.FirstName ?? user.Username);

        return RedirectToAction("Profile", "User");
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Register(User user)
    {
        bool isAjax = Request.Headers["X-Requested-With"] == "XMLHttpRequest";

        // بررسی اعتبارسنجی
        if (!ModelState.IsValid)
        {
            if (isAjax)
            {
                // استخراج تمام خطاها (شامل خطاهای کلی)
                var errors = new Dictionary<string, List<string>>();

                // خطاهای مربوط به فیلدها
                foreach (var state in ModelState)
                {
                    if (state.Value.Errors.Any())
                    {
                        errors[state.Key] = state.Value.Errors.Select(e => e.ErrorMessage).ToList();
                    }
                }

                // اگر خطای کلی (بدون کلید) وجود دارد، یک خطای عمومی اضافه کن
                if (!errors.Any() && !ModelState.IsValid)
                {
                    errors["General"] = new List<string> { "خطا در ثبت اطلاعات. لطفاً دوباره تلاش کنید." };
                }

                return Json(new { success = false, errors });
            }
            return View(user);
        }

        // بررسی تکراری نبودن نام کاربری
        if (FakeDatabase.Users.Any(u => u.Username == user.Username))
        {
            ModelState.AddModelError("Username", "این نام کاربری قبلاً ثبت شده است");
            if (isAjax)
            {
                var errors = new Dictionary<string, List<string>>
                {
                    ["Username"] = new List<string> { "این نام کاربری قبلاً ثبت شده است" }
                };
                return Json(new { success = false, errors });
            }
            return View(user);
        }

        // تخصیص ID جدید
        int newId = FakeDatabase.Users.Any() ? FakeDatabase.Users.Max(u => u.Id) + 1 : 1;
        user.Id = newId;
        user.UserType = "user"; // مقدار پیش‌فرض

        FakeDatabase.Users.Add(user);

        if (isAjax)
        {
            return Json(new { success = true, redirectUrl = Url.Action("Login") });
        }
        return RedirectToAction("Login");
    }
}