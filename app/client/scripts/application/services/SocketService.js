var SocketService = function() {
    var Service = function() {};
    var game, socket, NO_OPERATION = function() {};
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
            });
            socket.on('pitch', function(pitch) {
                console.log('receive', 'top_pitch', pitch);
                game.thePitch(0, 0, NO_OPERATION, pitch);
            });
            socket.on('swing', function(swing) {
                console.log('receive', 'top_swing', swing);
                game.theSwing(0, 0, NO_OPERATION, swing);
            });
            socket.on('partner_disconnect', function() {
                game.opponentConnected = false;
            });
            socket.on('partner_connect', function() {
                game.opponentConnected = true;
            });
        },
        off : function() {
            socket.on('register', NO_OPERATION);
        },
        register: function(data) {
            console.log(data);
            if (data === 'away') {
                game.humanControl = 'away';
            }
            socket.on('register', NO_OPERATION);
        },
        emitPitch : function(pitch) {
            console.log('emit', 'pitch');
            socket.emit('pitch', pitch);
        },
        emitSwing : function(swing) {
            console.log('emit', 'swing');
            socket.emit('swing', swing);
        },
        swing : function() {

        },
        pitch : function() {

        }
    };
    return new Service;
};