using Microsoft.AspNetCore.Mvc;
using Login.Models;
using Login.Data;




public class AuthController : Controller
{
    private static List<User> users = new List<User>();

    public IActionResult Login()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Login(string username, string password)
    {
        var user = users.FirstOrDefault(u =>
            u.Username == username && u.Password == password);

        if (user == null)
        {
            ViewBag.Error = "نام کاربری یا رمز اشتباه است";
            return View();
        }

        HttpContext.Session.SetString("Username", user.Username);

        return RedirectToAction("Profile", "User");
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Register(User user)
    {
        users.Add(user);
        return RedirectToAction("Login");
    }
}
