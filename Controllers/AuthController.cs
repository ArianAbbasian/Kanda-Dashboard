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
        if (!ModelState.IsValid)
        {
            return View(user);
        }

        if (FakeDatabase.Users.Any(u => u.Username == user.Username))
        {
            ModelState.AddModelError("Username", "این نام کاربری قبلاً ثبت شده است");
            return View(user);
        }

        int newId = FakeDatabase.Users.Any() ? FakeDatabase.Users.Max(u => u.Id) + 1 : 1;
        user.Id = newId;

        FakeDatabase.Users.Add(user);
        return RedirectToAction("Login");
    }


}