// Terribly simple example of providing an external API.
// See bcs-api-usage.html for example usage.

var bcsapi = {
    applocation: "http://www.rob-it.com/chat/",
    connectedUsers: function(fn) {
        $.getJSON(this.applocation + "User/apiGetUsers?jsoncallback=?", fn);
    },
    postedPhotos: function(fn) {
        $.getJSON(this.applocation + "Message/apiGetPostedPhotos?jsoncallback=?", fn);
    }
}