var SocketService = function() {
    var Service = function() {};
    Service.prototype = {
        socket : {},
        game : {},
        start : function() {
            var game, socket;
            game = this.game;
            socket = this.socket;
            var key = 15;
            this.on();
            socket.emit('register', key);
        },
        on : function() {
            socket.on('register', this.register);
        },
        off : function() {
            socket.on('register', function() {});
        },
        register: function(data) {
            console.log(data)
        }
    };
    return new Service;
};