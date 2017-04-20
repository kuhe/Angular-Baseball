/**
 * @typedef {Class} Stomp
 * @property {function} over
 */

/**
 * Provides the socket.io interface to Stomp.
 * @param {Stomp} stomp
 * @param {String} key (baseball) field name.
 * @param {SocketService} service
 * @returns {Stomp}
 * @constructor
 */
var IoAdapter = function (stomp, key, service) {

    var teamToken = 'Team' + (Math.random() * 100 | 0) + key;

    stomp.subscribe('/matchmaker/' + teamToken, function (frame) {

        var data = JSON.parse(frame.body);

        service.connected = stomp.connected;

        if (data.type in reactions) {
            reactions[data.type](data);
        }

        console.log('frame received', frame);
    });

    var reactions = {};
    stomp.on = function (key, fn) {
        key.split(' ').forEach(function (k) {
            reactions[k] = fn;
        });
    };
    stomp.emit = function (event, data) {
        data.type = event;
        socket.send(event, data);
    };

    return stomp;

};


/**
 *
 * Socket service for opponent connection.
 *
 */
var SocketService = (function() {

    var SocketService = function(game) {

        var connect = 'http://georgefu.info' + ':64321';
        connect = 'http://localhost:8080/match-socks';
        var socket = new SockJS(connect);

        this.game = game;

        window.socket = this.socket = socket;
        window.stomp = this.stomp = Stomp.over(socket);

    };

    var LOG_TRAFFIC = false;
    var game, socket, NO_OPERATION = function() {},
        animator = Baseball.service.Animator;

    SocketService.prototype = {

        connected : false,

        start : function(key) {
            game = this.game;
            socket = this.socket;
            game.opponentService = this;

            var stomp = this.stomp;
            var giraffe = this;

            stomp.connect({}, function (frame) {

                console.log('---', 'Socket Open', frame);
                IoAdapter(stomp, key);

                giraffe.connected = stomp.connected;

                giraffe.on();

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
                if (LOG_TRAFFIC) console.log('receive', 'pitch', pitch);
                game.windupThen(function() {

                    game.thePitch(0, 0, NO_OPERATION, pitch);
                    var scope = window.s;
                    animator.updateFlightPath.bind(scope)();

                });
            });
            socket.on('swing', function(swing) {
                if (LOG_TRAFFIC) console.log('receive', 'swing', swing);
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
            });
            socket.on('partner_connect', function() {
                game.opponentConnected = true;
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
            if (LOG_TRAFFIC) console.log('emit', 'pitch', pitch);
            socket.emit('pitch', pitch);
        },
        emitSwing : function(swing) {
            if (LOG_TRAFFIC) console.log('emit', 'swing', swing);
            socket.emit('swing', swing);
        }
    };
    return SocketService;
}());

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