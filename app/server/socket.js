var io = require('socket.io')(64321);

var clients = {};

io.on('connection', function (socket) {
    socket.on('message', function () { });

    socket.on('register', function(key) {
        console.log('preparing field', key);
        if (!clients[key]) {
            clients[key] = {};
        }
        var client = clients[key];
        if (!client.home && client.away) {
            client.home = socket;
            socket._key = key;
            socket._partner = client.away;
            client.away._partner = socket;
            socket._side = 'home';
            socket.emit('register', 'home');
            socket._partner.emit('partner_connect');
            socket.emit('partner_connect');
            socket._partner.emit('opponent_taking_field');
        } else if (client.home && !client.away) {
            client.away = socket;
            socket._key = key;
            socket._partner = client.home;
            client.home._partner = socket;
            socket._side = 'away';
            socket.emit('register', 'away');
            socket._partner.emit('partner_connect');
            socket.emit('partner_connect');
            socket._partner.emit('opponent_taking_field');
        } else if (!client.home && !client.away) {
            client.home = socket;
            socket._key = key;
            socket._side = 'home';
            socket.emit('register', 'home');
        } else {
            socket.emit('field_in_use');
        }
    });

    socket.on('game_data', function(game) {
        socket._partner.emit('game_data', game);
    });

    socket.on('disconnect', function () {
        if (socket._key && clients[socket._key]) {
            delete clients[socket._key][socket._side];
        }
        if (socket._partner) {
            socket._partner.emit('partner_disconnect', true);
        }
        socket = null;
    });

    socket.on('pitch', function(pitch) {
        socket._partner.emit('pitch', pitch);
    });

    socket.on('swing', function(swing) {
        socket._partner.emit('swing', swing);
    });

});