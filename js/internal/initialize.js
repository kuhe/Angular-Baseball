require([
            'utility/renderer',
            'utility/helper',
            'baseball/game',
            'baseball/field',
            'baseball/team',
            'baseball/player',
            'baseball/manager',
            'baseball/umpire'
        ], function(
            Renderer,
            Helper,
            Game, Field, Team, Player, Manager, Umpire
        ) {
    var yakyuu = {
        utility : {
            Renderer : Renderer,
            Helper : Helper
        },
        static : {

        },
        Game : Game,
        Field : Field,
        Team : Team,
        Player : Player,
        Manager : Manager,
        Umpire : Umpire
    };
    jQ(function() {
        yakyuu.static.game = new Game(yakyuu);
    });
    window.yakyuu = yakyuu;
});