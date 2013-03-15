using System.Web.Mvc;
using BoringChatService.Models;

namespace BoringChatService.Controllers
{
    [HandleError]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult SecretClearMessages()
        {
            MemStore.ClearAllMessages();
            return this.Json("OK");
        }

        public JsonResult SecretClearUsers()
        {
            MemStore.ClearAllUsers();
            return this.Json("OK");
        }

        public JsonResult SecretClear()
        {
            MemStore.ClearAllMessages();
            MemStore.ClearAllUsers();
            return this.Json("OK");
        }
    }
}
