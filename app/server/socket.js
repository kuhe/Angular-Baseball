var io = require('socket.io')(64321);

var clients = {};

io.on('connection', function (socket) {
    socket.on('message', function () { });

    socket.on('register', function(key) {
        if (!clients[key]) {
            clients[key] = {};
        }
        var client = clients[key];
        if (!client.home) {
            client.home = socket;
            socket._key = key;
            socket.emit('register', 'home');
        } else {
            client.away = socket;
            socket.emit('register', 'away');
            socket._key = key;
            socket._partner = client.home;
            client.home._partner = socket;
        }
    });

    socket.on('disconnect', function () {
        clients[socket._key] = {};
        socket = null;
    });

    socket.on('top_pitch', function(pitch) {
        socket._partner.emit('top_pitch', pitch);
    });
    socket.on('bottom_pitch', function(pitch) {
        socket._partner.emit('bottom_pitch', pitch);
    });

    socket.on('top_swing', function(swing) {
        socket._partner.emit('top_swing', swing);
    });
    socket.on('bottom_swing', function(swing) {
        socket._partner.emit('bottom_swing', swing);
    });

});