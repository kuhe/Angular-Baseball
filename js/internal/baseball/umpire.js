define(function(){
    var Umpire = function(game) {
        this.init(game);
    };

    Umpire.prototype = {
        init : function(game) {
            this.game = game;
            this.playBall();
        },
        playBall : function() {
            this.game.half = 'top';
            this.game.inning = 1;
            this.game.battingOrder = 0;
            this.game.batter = this.game.teams.away.lineup[0];
            this.game.deck = this.game.teams.away.lineup[1];
            this.game.hole = this.game.teams.away.lineup[2];
            this.game.pitcher = this.game.teams.home.positions.pitcher;
            this.game.log.note(
                'Top 1, '+this.game.teams.away.name+' offense vs. '+this.game.teams.home.positions.pitcher.name+' starting for '+this.game.teams.home.name
            );
            this.game.log.noteBatter(
                this.game.batter, this.game.battingOrder
            );
        },
        makeCall : function() {
            if (this.game.log.pitchRecord.length > 12) {
                this.game.log.pitchRecord = [];
            }
        },
        says : 'Play ball!',
        game : null
    };
    return Umpire;
});