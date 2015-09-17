var io = require('socket.io')(64321);

io.on('connection', function (socket) {
    socket.on('message', function () { });

    socket.on('register', function(key) {
        socket.emit('register', 'registered ' + key);
    });

    socket.on('disconnect', function () { });
});