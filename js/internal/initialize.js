require([
            'utility/log',
            'utility/renderer',
            'utility/helper',
            'baseball/game',
            'baseball/field',
            'baseball/team',
            'baseball/player',
            'baseball/manager',
            'baseball/umpire'
        ], function(
            Log,
            Renderer,
            Helper,
            Game, Field, Team, Player, Manager, Umpire
        ) {
    var baseball = {
        utility : {
            Log : Log,
            Renderer : Renderer,
            Helper : Helper
        },
        instance : {

        },
        Game : Game,
        Field : Field,
        Team : Team,
        Player : Player,
        Manager : Manager,
        Umpire : Umpire
    };
    var match;
    jQ(function() {
        //domready
    });
    match = new Game(baseball);
    window.y = match;
});