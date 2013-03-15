using System;
using System.Collections.Generic;
using System.Web.Http;
using BoringChatService.Models;

namespace BoringChatService.Controllers
{
    /// <summary>
    /// Handles actions related to user management.
    /// </summary>
    public class UserController : ApiController
    {
        public List<User> Get()
        {
            return MemStore.GetUsers();
        }

        public class UserRequest
        {
            public string act { get; set; }
            public string name { get; set; }
        }

        /// <summary>
        /// User Action
        /// </summary>
        public string Post([FromBody]UserRequest request)
        {
            if (request.act == "login")
            {
                var sessionId = Guid.NewGuid();
                MemStore.AddUser(new User
                    {
                        loginTime = DateTime.Now,
                        userName = request.name,
                        sessionId = sessionId.ToString()
                    });
                return sessionId.ToString();
            }

            MemStore.RemoveUser(request.name);
            return "OK";
        }




        ///// <summary>
        ///// Simple API example that returns the usernames of all logged in users.
        ///// </summary>
        ///// <returns></returns>
        //////[JsonpFilter]
        //public JsonResult apiGetUsers()
        //{
        //    return Index();
        //}
    }
}
