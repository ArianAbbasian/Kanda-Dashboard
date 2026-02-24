using Login.Data;
using Microsoft.AspNetCore.Mvc;
using Login.Data;

public class UserController : Controller
{
    public IActionResult Profile()
    {
        var username = HttpContext.Session.GetString("Username");

        if (username == null)
            return RedirectToAction("Login", "Auth");

        var user = FakeDatabase.Users
            .FirstOrDefault(u => u.Username == username);

        return View(user);
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Login", "Auth");
    }
}
