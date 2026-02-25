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
    public IActionResult GetUsers(int page = 1, int pageSize = 10)
    {
        pageSize = 6;
        var users = FakeDatabase.Users
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(u => {
                var province = FakeDatabase.Provinces.FirstOrDefault(p => p.Id == u.ProvinceId);
                var city = FakeDatabase.Cities.FirstOrDefault(c => c.Id == u.CityId);

                return new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Username,
                    u.Email,
                    u.Phone,
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
}