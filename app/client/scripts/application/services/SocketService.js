var SocketService = function() {
    var Service = function() {};
    var game, socket, nope = function() {};
    Service.prototype = {
        socket : {},
        game : {},
        connected : false,
        start : function() {
            game = this.game;
            socket = this.socket;
            game.opponentService = this;
            this.connected = socket.connected;
            var key = 15;
            this.on();
            socket.emit('register', key);
        },
        on : function() {
            var giraffe = this;
            socket.on('register', this.register);
            socket.on('connect reconnect', function() {
                giraffe.connected = true;
            });
            socket.on('disconnect', function() {
                giraffe.connected = false;
            })
        },
        off : function() {
            socket.on('register', nope);
        },
        register: function(data) {
            console.log(data)
        },
        logPitch : function(pitch, half) {
            socket.emit(half + '_pitch', pitch);
        },
        logSwing : function(swing, half) {
            socket.emit(half + '_swing', swing);
        }
    };
    return new Service;
};