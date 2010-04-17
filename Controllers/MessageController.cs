using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using BoringChatService.Models;

namespace BoringChatService.Controllers
{
    /// <summary>
    /// Handles actions related to sending/receiving messages
    /// </summary>
    public class MessageController : Controller
    {
        /// <summary>
        /// Unused.
        /// </summary>
        /// <returns></returns>
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// POST: /Message/Get
        /// 
        /// Retrieves new messages since the last poll and converts them to JSON.
        /// </summary>
        /// <param name="id">The user's session id.</param>
        /// <returns></returns>
		public JsonResult Get(string id)
		{
			User usr = MemStore.GetUser(id);

			if (null == usr)
				return null;

			DateTime lastMsgCheck = new DateTime(usr.lastMsgCheck.Ticks);
			usr.lastMsgCheck = DateTime.Now;

			List<Message> newMessages = MemStore.GetNewMessagesSince(lastMsgCheck).ToList();

			if (newMessages.Count() > 0)
				return this.Json(newMessages);
			return null;
		}

        /// <summary>
        /// Posts a message to the store
        /// </summary>
        /// <param name="id">The posting user's session id.</param>
        /// <param name="msg">The message.</param>
        /// <returns></returns>
		public JsonResult Post(string id, string msg)
		{
			string userName = MemStore.GetUserName(id);

			if (null == userName)
				return null;

			MemStore.AddMessage(new Message
			{
				msg = msg,
				posted = DateTime.Now,
				userName = userName
			});
			return this.Json("OK");
		}



        /// <summary>
        /// Simple API example that exposes all Flickr photo IDs that have been messaged.
        /// </summary>
        /// <returns></returns>
		[JsonpFilter]
		public JsonResult apiGetPostedPhotos()
		{
			return this.Json(MemStore.GetPostedPhotos());
		}
    }
}
