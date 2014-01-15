define(function(){
    var Umpire = function(game) {
        this.init(game);
    };

    Umpire.prototype = {
        init : function(game) {
            this.game = game;
            this.playBall();
        },
        count : {
            strikes : 0,
            balls : 0,
            outs : 0
        },
        playBall : function() {
            this.game.half = 'top';
            this.game.inning = 1;
            this.game.batter = this.game.teams.away.lineup[0];
            this.game.deck = this.game.teams.away.lineup[1];
            this.game.hole = this.game.teams.away.lineup[2];
            this.game.pitcher = this.game.teams.home.positions.pitcher;
            this.game.log.note(
                'Top 1, '+this.game.teams.away.name+' offense vs. '+this.game.teams.home.positions.pitcher.name+' starting for '+this.game.teams.home.name
            );
            this.game.log.noteBatter(
                this.game.batter
            );
        },
        makeCall : function() {
            if (this.game.log.pitchRecord.length > 12) {
                this.game.log.pitchRecord = [];
            }

            var result = this.game.swingResult;

            if (result.contact) {
                if (result.caught) {
                    this.says = 'Batter out.'
                } else {

                }
            } else {
                if (!result.looking) { //swung no contact
                    this.count.strikes++;
                } else { // looking
                    if (result.strike) {
                        this.count.strikes++;
                    } else {
                        this.count.balls++;
                    }
                }
            }

            if (this.count.strikes > 2) {
                this.outs++;
                this.says = 'Strike three. Batter out.';
            }
            if (this.count.balls > 3) {
                this.says = 'Ball four.';
            }
            if (this.outs > 2) {
                this.says = 'Three outs, change.';
            }
        },
        says : 'Play ball!',
        game : null
    };
    return Umpire;
});