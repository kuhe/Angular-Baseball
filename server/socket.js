var io = require('socket.io')(3000);

io.on('connection', function(socket){
    console.log('+socket');
});


