using Microsoft.AspNetCore.Mvc;

namespace chatapp.Controllers
{
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
