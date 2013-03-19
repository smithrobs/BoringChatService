var express = require('express')
    , app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

server.listen(3000);
console.log('Listening on port 3000');

app.use("/", express.static(__dirname + '/public'));

var users = [];
var messageStore = [];

io.sockets.on('connection', function (socket) {
    var removeCurrentUser = function() {
        // todo - check correctness (blocking/race condition?)
        var newUsers = [];
        users.forEach(function (i){
            if (i.id != socket.id)
                newUsers.push(i);
        });
        users = newUsers;
    };

    socket.on('users', function (fn) {
        fn(users);
    });

    socket.on('login', function (name, fn) {
        // don't need to create guid as sockets are user-specific
        users.push({id: socket.id, userName: name});
        socket.set('nickname', name, function () {
            fn({st:'OK',id:socket.id});
        });
        io.sockets.emit('users', users);
        socket.emit('msg', messageStore);
    });

    socket.on('logout', function () {
        removeCurrentUser();
        io.sockets.emit('users', users);
    });

    socket.on('msg', function (message) {
        socket.get('nickname', function (err, name) {
            var msgObj = {userName: name, msg: message, posted: new Date()};
            messageStore.push(msgObj);
            //socket.broadcast
            io.sockets.emit('msg', [msgObj]);
            console.log(messageStore.length);
        });
    });

    socket.on('disconnect', function (socket) {
        console.log('user disconnected');
        removeCurrentUser();
        io.sockets.emit('users', users);
    });
});
