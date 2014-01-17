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

            this.says = '';

            var result = this.game.swingResult;

            if (result.looking) {
                if (result.strike) {
                    this.count.strikes++;
                } else {
                    this.count.balls++;
                }
            } else {
                if (result.contact) {
                    if (result.caught) {
                        this.count.outs++;
                        this.newBatter(); //todo: sac fly
                    } else {
                        if (result.foul) {
                            this.count.strikes++;
                            if (this.count.strikes > 2) this.count.strikes = 2;
                        } else {
                            if (result.thrownOut) {
                                this.count.outs++;
                                this.newBatter(); //todo: sac
                            }
                            if (result.bases) {
                                this.game.tally[this.game.half == 'top' ? 'away' : 'home']['H']++;
                                var bases = result.bases;
                                var onBase = false;
                                while (bases > 0) {
                                    bases -= 1;
                                    this.advanceRunners();
                                    if (!onBase) {
                                        this.reachBase();
                                        onBase = true;
                                    }
                                }
                                this.newBatter();
                            }
                        }
                    }
                } else {
                    this.count.strikes++;
                }
            }

            this.says = (this.count.balls + ' and ' + this.count.strikes);

            if (this.count.strikes > 2) {
                this.count.outs++;
                this.count.balls = this.count.strikes = 0;
                this.says = 'Strike three. Batter out.';
                this.newBatter();
            }
            if (this.count.balls > 3) {
                this.says = 'Ball four.';
                this.count.balls = this.count.strikes = 0;
                this.game.field.first = this.game.batter;
                this.advanceRunners().reachBase().newBatter();
            }
            if (this.count.outs > 2) {
                this.says = 'Three outs, change.';
                this.count.outs = this.count.balls = this.count.strikes = 0;
                this.changeSides();
            }
        },
        reachBase : function() {
            this.game.field.first = this.game.batter;
            return this;
        },
        advanceRunners : function() {
            if (this.game.field.third instanceof this.game.batter.constructor) {
                // run scored
                this.game.scoreboard[this.game.half == 'top' ? 'away' : 'home'][this.game.inning]++;
                this.game.tally[this.game.half == 'top' ? 'away' : 'home']['R']++;
            }
            this.game.field.third = this.game.field.second;
            this.game.field.second = this.game.field.first;
            this.game.field.first = null;
            return this;
        },
        newBatter : function() {
            this.game.log.notePlateAppearanceResult(this.game);
            var team = this.game.half == 'bottom' ? this.game.teams.home : this.game.teams.away;
            this.game.batter = team.lineup[(team.nowBatting + 1)%9];
            this.game.deck = team.lineup[(team.nowBatting + 2)%9];
            this.game.hole = team.lineup[(team.nowBatting + 3)%9];
            team.nowBatting = (team.nowBatting + 1)%9;
            if (this.count.outs < 3) {
                this.game.log.noteBatter(this.game.batter);
            }
        },
        changeSides : function() {
            var offense, defense;
            this.game.field.first = null;
            this.game.field.second = null;
            this.game.field.third = null;
            if (this.game.half == 'top') {
                this.game.half = 'bottom';
            } else {
                this.game.half = 'top';
                this.game.inning++;
                if (this.game.inning > 9) {
                    this.game.end();
                }
            }
            offense = this.game.half == 'top' ? 'away' : 'home';
            defense = this.game.half == 'top' ? 'home' : 'away';
            this.game.log.note((this.game.half == 'top' ? 'Top' : 'Bottom')+' '+this.game.inning);
            this.game.batter = this.game.teams[offense].lineup[this.game.teams[offense].nowBatting];
            this.game.pitcher = this.game.teams[defense].positions.pitcher;
            this.game.log.noteBatter(this.game.batter);
        },
        says : 'Play ball!',
        game : null
    };
    return Umpire;
});