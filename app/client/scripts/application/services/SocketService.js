var SocketService = function() {
    var Service = function() {};
    var game, socket, NO_OPERATION = function() {},
        animator = Baseball.service.Animator;
    Service.prototype = {
        socket : {},
        game : {},
        connected : false,
        start : function(key) {
            game = this.game;
            socket = this.socket;
            game.opponentService = this;
            this.connected = socket.connected;
            this.on();
            socket.emit('register', key);
            socket.on('connect_failed reconnect_failed', function() {
                console.log('connection unavailable');
            });
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
                //console.log('receive', 'pitch', pitch);
                game.thePitch(0, 0, NO_OPERATION, pitch);
                var scope = window.s;
                animator.updateFlightPath.bind(scope)();
            });
            socket.on('swing', function(swing) {
                //console.log('receive', 'swing', swing);
                game.theSwing(0, 0, NO_OPERATION, swing);
                var scope = window.s;
                animator.updateFlightPath.bind(scope)(function() {
                    if (swing.contact) {
                        animator.animateFieldingTrajectory(game);
                    }
                });
            });
            socket.on('partner_disconnect', function() {
                console.log('The opponent has disconnected');
                var scope = window.s;
                game.opponentConnected = false;
                game.batter.ready = false;
                if (game.stage === 'pitch' && game.humanBatting()) {
                    game.onBatterReady = function() {
                        game.autoPitch(function(callback) {
                            scope.updateFlightPath(callback);
                        });
                    };
                    game.batterReady();
                }
                if (game.stage === 'swing' && game.humanPitching()) {
                    game.autoSwing(-20, 0, function(fn) {
                        fn();
                    });
                }
                //scope.$digest();
            });
            socket.on('partner_connect', function() {
                game.opponentConnected = true;
                var scope = window.s;
                //scope.$digest();
            });
            socket.on('opponent_taking_field', function() {
                console.log('A challenger has appeared! Sending game data.');
                socket.emit('game_data', game.toData());
            });
            socket.on('game_data', function(data) {
                game.fromData(data);
            });
            socket.on('field_in_use', function() {
                game.opponentConnected = false;
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
            //console.log('emit', 'pitch', pitch);
            socket.emit('pitch', pitch);
        },
        emitSwing : function(swing) {
            //console.log('emit', 'swing', swing);
            socket.emit('swing', swing);
        },
        swing : function() {

        },
        pitch : function() {

        }
    };
    return Service;
};

SocketService = SocketService();

//(function(app) {
//
//    app.SocketService = ng.core
//        .Class({
//            constructor: function() {
//                for (var i in SocketService.prototype) { if (SocketService.prototype.hasOwnProperty(i)) {
//                    this[i] = SocketService.prototype[i];
//                }}
//                SocketService.bind(this)();
//            }
//        });
//
//})(window.app || (window.app = {}));