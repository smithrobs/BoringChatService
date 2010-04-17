using System;

namespace BoringChatService.Models
{
	public class User
	{
		public DateTime loginTime { get; set; }
		public DateTime lastMsgCheck { get; set; }
		public string userName { get; set; }
		public string sessionId { get; set; }
	}
}