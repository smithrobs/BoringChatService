<%@ Page Language="C#" MasterPageFile="~/Views/Shared/Site.Master" Inherits="System.Web.Mvc.ViewPage" %>

<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Boring Chat Service
</asp:Content>

<asp:Content ID="indexContent" ContentPlaceHolderID="MainContent" runat="server">
	<script language="javascript" type="text/javascript">
	    var loc = '<%= Url.Content("~/") %>';
	</script>
	<script language="javascript" type="text/javascript" src="<%= Url.Content("~/Scripts/flickr.js") %>"></script>
	<script language="javascript" type="text/javascript" src="<%= Url.Content("~/Scripts/map.js") %>"></script>
	<script language="javascript" type="text/javascript" src="<%= Url.Content("~/Scripts/chat.js") %>"></script>
	
	<div id="loginNusers">
		<div id="loginPanel" class="dialog">
			<span>Login as:</span>
			<br />
			<div class="label">Name:</div>
			<div><input type="text" id="username" class="inputbox"/></div>
			<input type="button" id="login" value="Login" />
		</div>
		<div id="logoutPanel" style="display:none;" class="dialog">
			<span>Logged in as <span id="usernameDisplay"></span> - </span>
			<a href="#">Log out</a>
		</div>
		
		<div class="dialog" style="margin: 20px 0px 20px 0px">
			Connected Users:<br />
			<div id="connectedUsers">
			Loading...
			</div>
		</div>
	</div>
    <div id="map_canvas"></div>

	<div id="msgsNstuff">
		<div id="notLoggedIn" class="dialog">Login required.</div>
		<div id="messageLog" style="display:none;" class="larger dialog">
			<span class="info">NOTE: You can paste Flickr and Imgur page links here! Try it!</span>
			<input type="text" id="talkbox" class="larger inputbox"/><br />
			<div id="msgSpace"></div>
		</div>
	</div>
</asp:Content>
