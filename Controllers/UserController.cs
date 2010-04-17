using System;
using System.Web.Mvc;
using BoringChatService.Models;

namespace BoringChatService.Controllers
{
    /// <summary>
    /// Handles actions related to user management.
    /// </summary>
    public class UserController : Controller
    {
        public JsonResult Index()
        {
			return this.Json(MemStore.GetUsers());
        }

        /// <summary>
        /// Logs in a user with the specified name.
        /// </summary>
        /// <param name="name">The user name requested.</param>
        /// <returns>The given session id</returns>
		public JsonResult Login(string name)
		{
			string sessionId = this.Session.SessionID;
			MemStore.AddUser(new User
			{
				loginTime = DateTime.Now,
				userName = name,
				sessionId = sessionId
			});
			return this.Json(sessionId);
		}

        /// <summary>
        /// Removes the specified user from the store.
        /// </summary>
        /// <param name="id">The session id of the user to remove.</param>
        /// <returns></returns>
		public JsonResult Logout(string id)
		{
			MemStore.RemoveUser(id);
			return this.Json("OK");
		}



        /// <summary>
        /// Simple API example that returns the usernames of all logged in users.
        /// </summary>
        /// <returns></returns>
		[JsonpFilter]
		public JsonResult apiGetUsers()
		{
			return Index();
		}
    }
}
