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
            socket.on('top_pitch', function(pitch) {
                console.log('receive', 'top_pitch', pitch);
                game.thePitch(0, 0, NO_OPERATION, pitch);
            });
            socket.on('bottom_pitch', function(pitch) {
                console.log('receive', 'bottom_pitch', pitch);
                game.thePitch(0, 0, NO_OPERATION, pitch);
            });
            socket.on('top_swing', function(swing) {
                console.log('receive', 'top_swing', swing);
                game.theSwing(0, 0, NO_OPERATION, swing);
            });
            socket.on('bottom_swing', function(swing) {
                console.log('receive', 'bottom_swing', swing);
                game.theSwing(0, 0, NO_OPERATION, swing);
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
        emitPitch : function(pitch, half) {
            console.log('emit', half + '_pitch');
            socket.emit(half + '_pitch', pitch);
        },
        emitSwing : function(swing, half) {
            console.log('emit', half + '_swing');
            socket.emit(half + '_swing', swing);
        },
        swing : function() {

        },
        pitch : function() {

        }
    };
    return new Service;
};