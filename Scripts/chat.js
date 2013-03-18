"use strict";

// don't cache responses (that means you, IE)
$.ajaxSetup({
    cache: false
});

var ChatHelper = (function (window, undefined) {
    var _basePath,
        sessionId = undefined,
        isLoggedIn = false,
        flickrUrlRegex = /http:\/\/www.flickr.com\/photos\/(?:.*)\/([0-9]*)\/.*/,
        imgurUrlRegex = /http:\/\/imgur.com\/gallery\/([a-zA-Z0-9]*).*/,
        cmdRegex = /@(.*)\((.*)\)/;

    // Gets a list of logged-in users and displays it in the connectedUsers div.
    var getUsers = function () {
        $.getJSON(_basePath + "api/User",
            function (data) {
                var userList = $("#connectedUsers");
                userList.text("");
                if (data.length == 0) {
                    userList.text("None");
                }
                else {
                    for (var i = 0; i < data.length; i++) {
                        var u = data[i];
                        userList.append(u.userName + "<br/>");
                    }
                }
            });
    };
    // polling fn to constantly update connected user list.
    var refreshUsers = function () {
        getUsers();
        setTimeout(refreshUsers, 5000);
    };
    // Gets any new messages since the last poll and deals with them appropriately.
    var refreshMsgs = function () {
        if (isLoggedIn) {
            $.getJSON(_basePath + "api/Message/" + sessionId,
                function (data) {
                    if (data != "") {
                        var msgLog = $("#messageLog #msgSpace");

                        for (var i = 0; i < data.length; i++) {
                            var m = data[i];

                            // check for command
                            var cmd = m.msg.match(cmdRegex);
                            if (cmd) {
                                switch (cmd[1]) {
                                    case "flickrshow":
                                        FlickrHelper.addPhoto(cmd[2], m.userName);
                                        break;
                                    case "imgurshow":
                                        FlickrHelper.addImgurPhoto(cmd[2], m.userName);
                                        break;
                                    case "mapmark":
                                        var latlng = cmd[2].split(',');
                                        LeafletMapProvider.map_placeMarker(new L.LatLng(latlng[0], latlng[1]));
                                        break;
                                }
                            } else {
                                // not a command, just post the message
                                var msgDiv = document.createElement("div");
                                $(msgDiv).text(m.userName + ": " + $('<div/>').html(m.msg).text());
                                msgLog.append(msgDiv);
                                msgLog[0].scrollTop = msgLog[0].scrollHeight;
                            }
                        }
                    }
                    setTimeout(refreshMsgs, 1000);
                });
        } else {
            setTimeout(refreshMsgs, 5000);
        }
    };
    // alter the UI after a successful login.
    var performLogin = function () {
        isLoggedIn = true;
        $("span #usernameDisplay").text($.cookie('uid'));
        $("#notLoggedIn").hide();
        $("#msgSpace").text("");
        $("#messageLog").show();
        $('#loginPanel').hide();
        $('#logoutPanel').show();
    };
    // Grab the login cookie and set the browser state to logged in if needed
    var readSessionCookie = function () {
        var sid = $.cookie('sid');
        if (sid != null) {
            sessionId = sid;
            performLogin();
        }
    };
    // Send a login request to the server and update the UI
    var doLogin = function () {
        var usr = $('#username').val();
        $.cookie('uid', usr);
        $.post(_basePath + "api/User",
            {
                act: 'login',
                name: usr,
            },
            function (data) {
                sessionId = data;
                $.cookie('sid', data);
                performLogin();
                // refresh users quickly so that the newly logged in user shows up immediately
                getUsers();
            });
    };
    var enterPressed = function(event, fn) {
        // prob should overload keypress somehow
        if (event.keyCode == '13')
            fn();
    };
    
    return {
        init: function (basePath) {
            _basePath = basePath;
            
            // stuff to do when document is onready:
            //   see if the user is logged in via stored cookie
            //   start polling for users and messages
            //   set up events:
            //   >  login button causes login (duh!)
            //   >  pressing enter while in username textbox causes login
            //   >  pressing enter while in message textbox causes message to be posted
            //   >  clicking on a line in the logout panel (only one link there...) causes logout
            $(function () {
                readSessionCookie();

                setTimeout(refreshUsers, 5000);
                setTimeout(refreshMsgs, 1000);

                //////////

                $('#login:button').click(doLogin);

                $('#username:text').keypress(function (event) {
                    enterPressed(event, function () {
                        doLogin();
                    });
                });

                $('#talkbox').keypress(function (event) {
                    enterPressed(event, function () {
                        var msg = $('#talkbox').val();
                        ChatHelper.PostMessage(msg,
                                function () {
                                    $('#talkbox').val("");
                                });
                    });
                });

                $('#logoutPanel a').click(function () {
                    isLoggedIn = false;
                    $('#notLoggedIn').show();
                    $('#messageLog').hide();

                    $('#loginPanel').show();
                    $('#logoutPanel').hide();

                    $.post(_basePath + "api/User",
                                {
                                    act: 'logout',
                                    name: sessionId
                                });

                    $.removeCookie('uid');
                    $.removeCookie('sid');
                });
            });
        },
        PostMessage: function (msg, fn) {
            if (isLoggedIn) {
                //check for flickr link
                var flickrMatch = msg.match(flickrUrlRegex);
                var imgurMatch = msg.match(imgurUrlRegex);
                if (flickrMatch) {
                    $.post(_basePath + "api/Message", { id: sessionId, msg: "@flickrshow(" + flickrMatch[1] + ")" }, fn);
                }
                else if (imgurMatch) {
                    $.post(_basePath + "api/Message", { id: sessionId, msg: "@imgurshow(" + imgurMatch[1] + ")" }, fn);
                }
                else {
                    $.post(_basePath + "api/Message", { id: sessionId, msg: $('<div/>').text(msg).html() }, fn);
                }
            }
            else {
                alert("Message not sent. You must be logged in to send messages.");
            }
        }
    };
}(this));