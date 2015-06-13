var Umpire = function(game) {
    this.init(game);
};

Umpire.prototype = {
    constructor : Umpire,
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
        this.game.batterRunner = this.game.teams.away.lineup[0];
        this.game.deck = this.game.teams.away.lineup[1];
        this.game.hole = this.game.teams.away.lineup[2];
        this.game.pitcher = this.game.teams.home.positions.pitcher;
        var n = '一回のオモテ、'+this.game.teams.away.getName()+'の攻撃対'+this.game.teams.home.getName()+'、ピッチャーは'+this.game.teams.home.positions.pitcher.getName()+'。',
            e = 'Top 1, '+this.game.teams.away.name+' offense vs. '+this.game.teams.home.positions.pitcher.name+' starting for '+this.game.teams.home.name;
        this.game.log.note(e, n);
        this.game.log.noteBatter(
            this.game.batter
        );
    },
    makeCall : function() {
        this.says = '';

        var result = this.game.swingResult;
        var pitcher = this.game.pitcher;
        var batter = this.game.batter;

        if (this.game.swingResult.fielder) {
            var fielder = this.game.teams[this.game.half == 'top' ? 'home' : 'away'].positions[result.fielder]
        } else {
            fielder = null;
        }

        this.game.batterRunner = this.game.batter;

        pitcher.stats.pitching.pitches++;
        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            if (result.contact) {
                if (result.caught) {
                    batter.stats.batting.pa++;
                    pitcher.stats.pitching.IP[1]++;
                    if (result.sacrificeAdvances.length && this.count.outs < 2) {
                        batter.stats.batting.sac++;
                        this.game.batter.atBats.push(Log.prototype.SACRIFICE);
                        this.advanceRunners(false, null, result.sacrificeAdvances);
                    } else {
                        batter.stats.batting.ab++;
                        if (result.flyAngle < 15) {
                            this.game.batter.atBats.push(Log.prototype.LINEOUT);
                        } else {
                            this.game.batter.atBats.push(Log.prototype.FLYOUT);
                        }
                    }
                    this.count.outs++;
                    this.newBatter();
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        pitcher.stats.pitching.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.fieldersChoice && this.count.outs < 2) {
                            result.bases = 0;
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            this.game.batter.atBats.push(Log.prototype.FIELDERS_CHOICE);
                            this.advanceRunners(false, result.fieldersChoice);
                            this.reachBase();
                            this.newBatter();
                        } else if (result.fieldersChoice) {
                            result.bases = 0;
                            result.thrownOut = true;
                        }
                        if (result.thrownOut) {
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            this.game.batter.atBats.push(Log.prototype.GROUNDOUT);
                            if (this.count.outs < 3) {
                                this.advanceRunners(false);
                            }
                            this.newBatter();
                        }
                        if (result.hitByPitch) {
                            batter.stats.batting.ab--;
                        }
                        if (result.bases) {
                            if (!result.error) {
                                this.game.tally[this.game.half == 'top' ? 'away' : 'home'][Log.prototype.SINGLE]++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    this.game.tally[this.game.half == 'top' ? 'home' : 'away'].E++;
                                    fielder.stats.fielding.E++;
                                }
                            }
                            var bases = result.bases;
                            switch (bases) {
                                case 0 :
                                    this.game.batter.atBats.push(Log.prototype.GROUNDOUT);
                                    break;
                                case 1 :
                                    if (result.error) {
                                        this.game.batter.atBats.push(Log.prototype.REACHED_ON_ERROR);
                                    } else {
                                        this.game.batter.atBats.push(Log.prototype.SINGLE);
                                        batter.stats.batting.h++;
                                    }
                                    break;
                                case 2 :
                                    this.game.batter.atBats.push(Log.prototype.DOUBLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3 :
                                    this.game.batter.atBats.push(Log.prototype.TRIPLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4 :
                                    this.game.batter.atBats.push(Log.prototype.HOMERUN);
                                    pitcher.stats.pitching.HR++;
                                    batter.stats.batting.h++;
                                    batter.stats.batting.hr++;
                                    break;
                            }
                            if (bases > 0 && bases < 4 && !result.error) {
                                if (['left', 'right', 'center'].indexOf(result.fielder) == -1) {
                                    batter.recordInfieldHit();
                                }
                            }
                            if (bases >= 1) {
                                this.advanceRunners();
                                this.reachBase();
                                bases -= 1;
                            }
                            while (bases > 0) {
                                bases -= 1;
                                this.advanceRunners();
                            }
                            this.newBatter();
                        }
                    }
                }
            } else {
                pitcher.stats.pitching.strikes++;
                this.count.strikes++;
            }
        }

        this.says = (this.count.balls + ' and ' + this.count.strikes);

        result.outs = this.count.outs;

        if (this.count.strikes > 2) {
            batter.stats.batting.pa++;
            batter.stats.batting.ab++;
            batter.stats.batting.so++;
            pitcher.stats.pitching.K++;
            this.count.outs++;
            pitcher.stats.pitching.IP[1]++;
            this.count.balls = this.count.strikes = 0;
            this.says = 'Strike three. Batter out.';
            batter.atBats.push(Log.prototype.STRIKEOUT);
            this.newBatter();
        }
        if (this.count.balls > 3) {
            batter.stats.batting.pa++;
            batter.stats.batting.bb++;
            pitcher.stats.pitching.BB++;
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            batter.atBats.push(Log.prototype.WALK);
            this.advanceRunners(true).reachBase().newBatter();
        }
        if (this.count.outs > 2) {
            this.says = 'Three outs, change.';
            this.count.outs = this.count.balls = this.count.strikes = 0;
            pitcher.stats.pitching.IP[0]++;
            pitcher.stats.pitching.IP[1] = 0;
            this.changeSides();
        }
    },
    reachBase : function() {
        this.game.field.first = this.game.batter;
        this.game.field.first.fatigue += 2;
        return this;
    },
    advanceRunners : function(isWalk, fieldersChoice, sacrificeAdvances) {
        isWalk = !!isWalk;
        var first = this.game.field.first,
            second = this.game.field.second,
            third = this.game.field.third,
            game = this.game,
            swing = this.game.swingResult;
        
        if (isWalk) {
            if (first) {
                if (second) {
                    if (third) {
                        //bases loaded
                        game.batter.recordRBI();
                        game.batter.stats.batting.rbi++;
                        third.atBats.push(Log.prototype.RUN);
                        third.stats.batting.r++;
                        game.pitcher.stats.pitching.ER++;
                        game.scoreboard[game.half == 'top' ? 'away' : 'home'][game.inning]++;
                        game.tally[game.half == 'top' ? 'away' : 'home'].R++;
                        game.field.third = second;
                        game.field.second = first;
                        first = null;
                    } else {
                        // 1st and second
                        game.field.third = second;
                        game.field.second = first;
                        game.field.first = null;
                    }
                } else {
                    if (third) {
                        // first and third
                        game.field.second = first;
                        game.field.first = null;
                    } else {
                        // first only
                        game.field.second = first;
                        game.field.first = null;
                    }
                }
            } else {
                // no one on first
            }
        } else {
            if (fieldersChoice) {
                game.field[fieldersChoice] = null;
                first = this.game.field.first;
                second = this.game.field.second;
                third = this.game.field.third;
            }
            var canAdvance = function() {return true;};
            if (sacrificeAdvances) {
                canAdvance = function(position) {
                    switch (position) {
                        case 'first':
                            return sacrificeAdvances.indexOf('first') > -1 && (canAdvance('second') || !second);
                        case 'second':
                            return sacrificeAdvances.indexOf('second') > -1 && (canAdvance('third') || !third);
                        case 'third':
                            return sacrificeAdvances.indexOf('third') > -1;
                    }
                };
            }
            if (third instanceof Player && canAdvance('third')) {
                // run scored
                game.scoreboard[game.half == 'top' ? 'away' : 'home'][game.inning]++;
                game.tally[game.half == 'top' ? 'away' : 'home'].R++;
                if (game.batter != third) {
                    game.batter.recordRBI();
                    third.atBats.push(Log.prototype.RUN);
                }
                game.batter.stats.batting.rbi++;
                third.stats.batting.r++;
                game.pitcher.stats.pitching.ER++;
            }
            if (second && canAdvance('second')) {
                game.field.third = second;
            } else {
                game.field.third = null;
            }
            if (first && canAdvance('first')) {
                game.field.second = first;
            } else {
                game.field.second = null;
            }
            game.field.first = null;
        }
        return this;
    },
    newBatter : function() {
        this.game.log.pitchRecord = {
            e: [],
            n: []
        };
        this.count.balls = this.count.strikes = 0;
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
        this.game.swingResult = {};
        this.game.swingResult.looking = true; // hide bat
        this.game.pitchInFlight.x = null; // hide ball
        this.game.pitchInFlight.y = null; // hide ball
        this.game.log.pitchRecord = {
            e: [],
            n: []
        };
        var offense, defense;
        this.game.field.first = null;
        this.game.field.second = null;
        this.game.field.third = null;
        if (this.game.half == 'top') {
            if (this.game.inning == 9 && this.game.tally.home.R > this.game.tally.away.R) {
                return this.game.end();
            }
            this.game.half = 'bottom';
        } else {
            if (this.game.inning + 1 > 9) {
                return this.game.end();
            }
            this.game.inning++;
            this.game.half = 'top';
        }
        offense = this.game.half == 'top' ? 'away' : 'home';
        defense = this.game.half == 'top' ? 'home' : 'away';
        var n = this.game.inning+'回の'+(this.game.half == 'top' ? 'オモテ' : 'ウラ')
                +'、'+this.game.teams[(this.game.half == 'top' ? 'away' : 'home')].getName()+'の攻撃。',
            e = (this.game.half == 'top' ? 'Top' : 'Bottom')+' '+this.game.inning;
        this.game.log.note(e, n);
        var team = this.game.teams[offense];
        this.game.batter = team.lineup[team.nowBatting];
        this.game.batterRunner = this.game.batter;
        this.game.deck = team.lineup[(team.nowBatting + 1)%9];
        this.game.hole = team.lineup[(team.nowBatting + 2)%9];

        this.game.pitcher = this.game.teams[defense].positions.pitcher;
        this.game.log.noteBatter(this.game.batter);
    },
    says : 'Play ball!',
    game : null
};

exports.Umpire = Umpire;