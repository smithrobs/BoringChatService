using System;

namespace BoringChatService.Models
{
	public class Message
	{
		public DateTime posted { get; set; }
		public string userName { get; set; }
		public string msg { get; set; }
	}
}