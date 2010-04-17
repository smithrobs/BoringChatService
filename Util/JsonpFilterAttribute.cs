﻿using System;
using System.Web.Mvc;

namespace BoringChatService
{
	// ripped from http://blogorama.nerdworks.in/entry-EnablingJSONPcallsonASPNETMVC.aspx
	public class JsonpFilterAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuted(ActionExecutedContext filterContext)
		{
			if (filterContext == null)
				throw new ArgumentNullException("filterContext");

			//
			// see if this request included a "callback" querystring parameter
			//
			string callback = filterContext.HttpContext.Request.QueryString["jsoncallback"];
			if (!string.IsNullOrEmpty(callback))
			{
				//
				// ensure that the result is a "JsonResult"
				//
				JsonResult result = filterContext.Result as JsonResult;
				if (result == null)
				{
					throw new InvalidOperationException("JsonpFilterAttribute must be applied only " +
						"on controllers and actions that return a JsonResult object.");
				}

				filterContext.Result = new JsonpResult
				{
					ContentEncoding = result.ContentEncoding,
					ContentType = result.ContentType,
					Data = result.Data,
					Callback = callback
				};
			}
		}
	}
}