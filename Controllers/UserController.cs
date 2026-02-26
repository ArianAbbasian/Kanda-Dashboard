using Microsoft.AspNetCore.Mvc;
using Login.Models;
using Login.Data;
using System.Linq;

public class UserController : Controller
{
    public IActionResult Profile()
    {
        var username = HttpContext.Session.GetString("Username");
        if (string.IsNullOrEmpty(username))
            return RedirectToAction("Login", "Auth");

        var user = FakeDatabase.Users.FirstOrDefault(u => u.Username == username);
        if (user == null)
        {
            HttpContext.Session.Clear();
            TempData["Error"] = "کاربر یافت نشد. مجدداً وارد شوید.";
            return RedirectToAction("Login", "Auth");
        }
        return View(user);
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Login", "Auth");
    }

    public IActionResult AdminPanel()
    {
        var username = HttpContext.Session.GetString("Username");
        if (string.IsNullOrEmpty(username))
        {
            return RedirectToAction("Login", "Auth");
        }
        ViewBag.CurrentUsername = username;
        var users = FakeDatabase.Users.ToList();
        return View(users);
    }

    [HttpGet]
    public IActionResult GetUsers(int page = 1, int pageSize = 5)
    {
        var users = FakeDatabase.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u =>
            {
                var province = FakeDatabase.Provinces.FirstOrDefault(p => p.Id == u.ProvinceId);
                var city = FakeDatabase.Cities.FirstOrDefault(c => c.Id == u.CityId);

                return new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Username,
                    Email = u.Email ?? "ایمیل ندارد",
                    Phone = u.Phone ?? "تلفن ندارد",
                    u.ProvinceId,
                    u.CityId,
                    ProvinceName = province?.Name ?? "---",
                    CityName = city?.Name ?? "---"
                };
            })
            .ToList();

        var totalUsers = FakeDatabase.Users.Count;
        var totalPages = (int)Math.Ceiling((double)totalUsers / pageSize);

        return Json(new { users, totalPages, currentPage = page });
    }

    [HttpGet]
    public IActionResult GetUser(int id)
    {
        var user = FakeDatabase.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return Json(new { success = false, message = "کاربر یافت نشد" });

        var province = FakeDatabase.Provinces.FirstOrDefault(p => p.Id == user.ProvinceId);
        var city = FakeDatabase.Cities.FirstOrDefault(c => c.Id == user.CityId);

        return Json(new
        {
            success = true,
            user = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.Username,
                user.Email,
                user.Phone,
                user.ProvinceId,
                user.CityId,
                ProvinceName = province?.Name,
                CityName = city?.Name
            }
        });
    }

    [HttpPost]
    public IActionResult UpdateUser([FromBody] User updatedUser)
    {
        var user = FakeDatabase.Users.FirstOrDefault(u => u.Id == updatedUser.Id);
        if (user == null)
            return Json(new { success = false, message = "کاربر یافت نشد" });

        user.FirstName = updatedUser.FirstName;
        user.LastName = updatedUser.LastName;
        user.Username = updatedUser.Username;
        user.Email = updatedUser.Email;
        user.Phone = updatedUser.Phone;
        user.ProvinceId = updatedUser.ProvinceId;
        user.CityId = updatedUser.CityId;

        if (!string.IsNullOrWhiteSpace(updatedUser.Password))
            user.Password = updatedUser.Password;

        return Json(new { success = true, message = "کاربر با موفقیت ویرایش شد" });
    }

    [HttpPost]
    public IActionResult DeleteUser(int id)
    {
        var user = FakeDatabase.Users.FirstOrDefault(u => u.Id == id);
        if (user == null)
            return Json(new { success = false, message = "کاربر یافت نشد" });

        var currentUsername = HttpContext.Session.GetString("Username");
        bool selfDelete = currentUsername != null && user.Username == currentUsername;

        FakeDatabase.Users.Remove(user);

        if (selfDelete)
        {
            HttpContext.Session.Clear();
            return Json(new { success = true, selfDeleted = true, message = "حساب کاربری شما حذف شد." });
        }

        return Json(new { success = true, selfDeleted = false, message = "کاربر با موفقیت حذف شد" });
    }

    [HttpGet]
    public IActionResult GetProvinces()
    {
        var provinces = FakeDatabase.Provinces
            .Select(p => new { p.Id, p.Name })
            .OrderBy(p => p.Name)
            .ToList();
        return Json(provinces);
    }

    [HttpGet]
    public IActionResult GetCities(int provinceId)
    {
        var cities = FakeDatabase.Cities
            .Where(c => c.ProvinceId == provinceId)
            .Select(c => new { c.Id, c.Name })
            .OrderBy(c => c.Name)
            .ToList();
        return Json(cities);
    }

    [HttpGet]
public IActionResult GetFilteredUsers(string name = "", string username = "", string email = "", int? provinceId = null, int? cityId = null, int page = 1, int pageSize = 5)
{
    try
    {
        var allUsers = FakeDatabase.Users.ToList();
        var filteredUsers = allUsers.AsEnumerable();

        // اعمال فیلترها
        if (!string.IsNullOrEmpty(name))
        {
            filteredUsers = filteredUsers.Where(u =>
                (!string.IsNullOrEmpty(u.FirstName) && u.FirstName.Contains(name, StringComparison.OrdinalIgnoreCase)) ||
                (!string.IsNullOrEmpty(u.LastName) && u.LastName.Contains(name, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrEmpty(username))
        {
            filteredUsers = filteredUsers.Where(u =>
                !string.IsNullOrEmpty(u.Username) &&
                u.Username.Contains(username, StringComparison.OrdinalIgnoreCase));
        }

        if (!string.IsNullOrEmpty(email))
        {
            filteredUsers = filteredUsers.Where(u =>
                !string.IsNullOrEmpty(u.Email) &&
                u.Email.Contains(email, StringComparison.OrdinalIgnoreCase));
        }

        if (provinceId.HasValue && provinceId.Value > 0)
        {
            filteredUsers = filteredUsers.Where(u => u.ProvinceId == provinceId.Value);
        }

        if (cityId.HasValue && cityId.Value > 0)
        {
            filteredUsers = filteredUsers.Where(u => u.CityId == cityId.Value);
        }

        var filteredList = filteredUsers.ToList();
        var totalFilteredUsers = filteredList.Count;  // <--- این مهم است
        var totalPages = (int)Math.Ceiling((double)totalFilteredUsers / pageSize);

        var users = filteredList
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u =>
            {
                var province = FakeDatabase.Provinces.FirstOrDefault(p => p.Id == u.ProvinceId);
                var city = FakeDatabase.Cities.FirstOrDefault(c => c.Id == u.CityId);

                return new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Username,
                    Email = u.Email ?? "---",
                    u.Phone,
                    u.ProvinceId,
                    u.CityId,
                    ProvinceName = province?.Name ?? "---",
                    CityName = city?.Name ?? "---"
                };
            })
            .ToList();

        return Json(new
        {
            users,
            totalPages,
            currentPage = page,
            totalFilteredUsers 
        });
    }
    catch (Exception ex)
    {
        return Json(new { error = ex.Message });
    }
}

    private string GetProvinceColor(int provinceId)
    {
        var colors = new[]
        {
        "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
        "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2",
        "#F8C471", "#B03A2E", "#1E8449", "#7D3C98", "#F39C12",
        "#16A085", "#C0392B", "#8E44AD", "#2980B9", "#27AE60",
        "#D35400", "#2C3E50", "#7F8C8D", "#BDC3C7", "#95A5A6"
    };

        // انتخاب رنگ براساس Id استان (برای اینکه هر استان یه رنگ ثابت داشته باشه)
        return colors[provinceId % colors.Length];
    }
}