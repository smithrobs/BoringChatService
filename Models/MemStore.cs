using System;
using System.Collections.Generic;
using System.Linq;

namespace BoringChatService.Models
{
    /// <summary>
    /// Really simple in-memory storage of messages. No, no interface here. The intention of this project was to focus on the client-side.
    /// </summary>
	public static class MemStore
	{
        /// <summary>
        /// User store
        /// </summary>
		private static List<User> usermanifest = new List<User>();
        /// <summary>
        /// Message store
        /// </summary>
		private static List<Message> messages = new List<Message>();

        /// <summary>
        /// Retrieves a user from the store
        /// </summary>
        /// <param name="id">The session id of the user to retrieve.</param>
        /// <returns>The user, if any</returns>
		internal static User GetUser(string id)
		{
			return (from User u in usermanifest
			 where u.sessionId == id
			 select u).FirstOrDefault();
		}

        /// <summary>
        /// Returns all new messages given a specific start time.
        /// </summary>
        /// <param name="start">The DateTime to start at.</param>
        /// <returns></returns>
		public static IEnumerable<Message> GetNewMessagesSince(DateTime start)
		{
			return (from Message m in messages
			 where m.posted >= start
			 select m);
		}

        /// <summary>
        /// Returns any posted Flickr photos based on the flickrshow command.
        /// </summary>
        /// <returns></returns>
		public static IEnumerable<string> GetPostedPhotos()
		{
			return (from Message m in messages
					where m.msg.StartsWith("@flickrshow(")
			        select m.msg.Substring(12, m.msg.Length - 13));
		}

        /// <summary>
        /// Exposes the entire user store. Used with the sample API call.
        /// </summary>
        /// <returns></returns>
		public static List<User> GetUsers()
		{
			return usermanifest;
		}

        /// <summary>
        /// Adds a user.
        /// </summary>
        /// <param name="user">The user object to add to the collection.</param>
		public static void AddUser(User user)
		{
			usermanifest.Add(user);
		}

        /// <summary>
        /// Removes a user.
        /// </summary>
        /// <param name="id">The session id of the user to remove.</param>
		public static void RemoveUser(string id)
		{
			usermanifest = usermanifest.Where(u => u.sessionId != id).ToList();
		}

        /// <summary>
        /// Adds a message.
        /// </summary>
        /// <param name="message">The message object to add to the collection.</param>
		public static void AddMessage(Message message)
		{
			messages.Add(message);
		}

        /// <summary>
        /// Gets the username of a user given a session id
        /// </summary>
        /// <param name="id">The session id of the user.</param>
        /// <returns></returns>
		public static string GetUserName(string id)
		{
			return (from User u in usermanifest
			 where u.sessionId == id
			 select u.userName).FirstOrDefault();
		}

        /// <summary>
        /// Clears all messages.
        /// </summary>
		public static void ClearAllMessages()
		{
			messages = new List<Message>();
		}

        /// <summary>
        /// Clears all users.
        /// </summary>
		public static void ClearAllUsers()
		{
			usermanifest = new List<User>();
		}
	}
}