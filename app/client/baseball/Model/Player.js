import { data, text } from '../Utility/_utils';
import { Iterator, Mathinator, Distribution } from '../Services/_services';
import { AtBat, Team } from '../Model/_models';

var Player = function(team, hero) {
    this.init(team, hero);
    this.resetStats(this.team.game && this.team.game.gamesIntoSeason || 0);
};

Player.prototype = {
    constructor : Player,
    init : function(team, hero) {
        this.ready = false;
        this.throws = Math.random() > 0.86 ? 'left' : 'right';
        this.bats = Math.random() > 0.75 ? 'left' : 'right';
        this.team = team;
        this.skill = {};
        this.eye = {
            x: 100,
            y: 100
        };
        this.pitching = {averaging : []};
        this.number = 0;
        this.randomizeSkills(hero || (Math.random() > 0.9));
        var surnameKey = Math.floor(Math.random()*data.surnames.length),
            nameKey = Math.floor(Math.random()*data.names.length);

        this.name = data.surnames[surnameKey] + ' ' + data.names[nameKey];
        var jSurname = data.surnamesJ[surnameKey],
            jGivenName = data.namesJ[nameKey];
        this.spaceName(jSurname, jGivenName);
        this.surname = data.surnames[surnameKey];
        this.surnameJ = data.surnamesJ[surnameKey];
        this.atBats = [];
    },
    spaceName : function(jSurname, jGivenName) {
        if (jSurname.length == 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length == 1 && jSurname.indexOf('・') < 0 && jSurname.length <= 2) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.surnameJ = jSurname;
    },
    serialize : function() {
        var team = this.team;
        delete this.team;
        var data = JSON.stringify(this);
        this.team = team;
        return data;
    },
    fromData : function(data) {
        var giraffe = this;
        Iterator.each(data, function(key, value) {
            giraffe[key] = value;
        });
        delete this.atBatObjects;
        this.getAtBats();
    },
    substitute : function(player) {
        if (player.team !== this.team) return false;
        var order = player.order,
            position = player.position;
        player.team.substituted.push(player);
        player.team.positions[position] = this;
        player.team.lineup[order] = this;

        this.position = position;
        this.order = order;

        var game = this.team.game;
        if (game.pitcher === player) game.pitcher = this;
        if (game.batter === player) game.batter = this;
        if (game.deck === player) game.deck = this;
        if (game.hole === player) game.hole = this;

        var field = game.field;
        if (field.first === player) field.first = this;
        if (field.second === player) field.second = this;
        if (field.third === player) field.third = this;

        var bench = this.team.bench,
            bullpen = this.team.bullpen;
        if (bench.indexOf(this) > -1) {
            bench.splice(bench.indexOf(this), 1);
        }
        if (bullpen.indexOf(this) > -1) {
            bullpen.splice(bullpen.indexOf(this), 1);
        }
        game.log.noteSubstitution(this, player);
    },
    resetStats : function(gamesIntoSeason = 0) {
        var offense = this.skill.offense;
        var defense = this.skill.defense;
        var randBetween = function(a, b, skill) {
            var total = 0,
                count = 0;
            skill += '';
            if (!skill) skill = '';
            Iterator.each(skill.split(' '), function(key, value) {
                var skill = value;
                if (offense[skill]) skill = offense[skill];
                if (defense[skill]) skill = defense[skill];
                if (isNaN(skill)) skill = 50;
                total += skill;
                count++;
            });

            skill = Math.sqrt(0.05 + Math.random()*0.95)*(total/(count * 0.97));
            return Math.floor((skill/100) * (b - a) + a);
        };
        var IP, ER, GS, W, L;
        if (this.skill.pitching > 65) {
            IP = (this.skill.pitching - 65)*gamesIntoSeason/20;
            ER = (IP/9)*randBetween(800, 215, this.skill.pitching)/100;
            if (IP > gamesIntoSeason) {
                //starter
                GS = Math.floor(gamesIntoSeason/5);
                W = randBetween(GS * 0.1, GS * 0.8, this.skill.pitching/1.20);
                L = randBetween((GS - W), 0, this.skill.pitching/3);
            } else {
                //reliever
                GS = Math.floor(gamesIntoSeason/40);
                W = randBetween(0, GS*0.6, this.skill.pitching);
                L = randBetween((GS - W), 0, this.skill.pitching);
            }
        }
        var pa = randBetween(gamesIntoSeason*3, gamesIntoSeason*5, 'speed eye');
        var paRemaining = pa;
        var bb = Math.floor(randBetween(0, 18, 'power eye')*paRemaining/100);
        paRemaining -= bb;
        var ab = paRemaining;
        var so = Math.floor(randBetween(25, 2, 'eye')*paRemaining/100);
        paRemaining -= so;
        var h = Math.floor(randBetween(185, 372, 'eye power speed')*paRemaining/1000);
        paRemaining -= h;
        var sb = randBetween(0, (h + bb)/6, 'speed') | 0;
        var cs = randBetween(sb, 0, 'speed eye') | 0;

        var doubles = randBetween(0, h/4, 'power speed');
        var triples = randBetween(0, h/12, 'speed');
        var hr = Math.max(0, randBetween(-h/20, h/5, 'power eye'));
        var r = randBetween(h/8, (h + bb)/3, 'speed') + hr;
        var rbi = randBetween(h/8, (h)/2, 'power eye') + hr;
        var hbp = randBetween(0, gamesIntoSeason/25);
        var sac = randBetween(0, gamesIntoSeason/5, 'eye');

        var chances = randBetween(gamesIntoSeason * 5, pa - bb - so - hr, 'fielding');
        var E = randBetween(chances/10, 0, 'fielding');
        var PO = chances - E;

        this.stats = {
            pitching : {
                pitches : 0, // in game
                GS : GS,
                W: W,
                L: L,
                strikes : 0, // in game
                K : 0, // in game
                getK9 : function() {
                    return this.K / (this.IP[0]/9);
                },
                getERA : function() {
                    return 9 * this.ER / Math.max(1/3, this.IP[0] + this.IP[1]/3);
                },
                ERA : null,
                ER : ER,
                H : 0, // in game
                HR : 0, // in game
                BB : 0, // in game
                IP : [IP,0],
                WHIP : 0,
                getWHIP : function() {
                    return (this.H + this.BB)/(this.IP[0] ? this.IP[0] : 1);
                }
            },
            batting : {
                getBA : function() {
                    return this.h / (Math.max(1, this.ab));
                },
                getBABIP : function() {
                    return (this.h - this.hr) / (this.ab - this.so - this.hr + this.sac);
                },
                ba : null,
                getOBP : function() {
                    return (this.h + this.bb + this.hbp)/(this.ab + this.bb + this.hbp + this.sac);
                },
                obp : null,
                getSLG : function() {
                    return ((this.h - this['2b'] - this['3b'] - this.hr) + 2*this['2b'] + 3*this['3b'] + 4*this.hr)/this.ab;
                },
                getSlash : function() {
                    this.slash = this.slash || [this.getBA(), this.getOBP(), this.getSLG()].map(x => {
                        if (x < 1) return (x+'0000').slice(1, 5);
                        return (x+'0000').slice(0, 5);
                    }).join('/');
                    return this.slash;
                },
                slg : null,
                pa : pa,
                ab : ab,
                so : so,
                bb : bb,
                h : h,
                '2b' : doubles,
                '3b' : triples,
                hr : hr,
                r : r,
                rbi : rbi,
                hbp : hbp,
                sac : sac,
                sb : sb,
                cs : cs
            },
            fielding : {
                E : E,
                PO : PO, // should depend on position
                A : Math.floor(Math.random()*5) + 1 // ehh should depend on position
            }
        };
        this.stats.pitching.ERA = this.stats.pitching.getERA();
        this.stats.pitching.K9 = this.stats.pitching.getK9();
        this.stats.pitching.WHIP = this.stats.pitching.getWHIP();
        this.stats.batting.ba = this.stats.batting.getBA();
    },
    atBatObjects : [],
    getAtBats : function() {
        if (this.atBats.length > this.atBatObjects.length) {
            this.atBatObjects = this.atBats.map(function(item) {
                return new AtBat(item);
            });
        }
        return this.atBatObjects;
    },
    recordRBI : function() {
        this.atBats[this.atBats.length - 1] += AtBat.prototype.RBI_INDICATOR;
    },
    recordInfieldHit : function() {
        this.atBats[this.atBats.length - 1] += AtBat.prototype.INFIELD_HIT_INDICATOR;
    },
    getBaseRunningTime : function() {
        return Mathinator.baseRunningTime(this.skill.offense.speed);
    },
    attemptSteal : function(game, base) {
        var pitch = game.pitchInFlight;
        var success = Distribution.stealSuccess(pitch, game.pitcher.team.positions.catcher,
                                                this, base, this.team.stealAttempt === Team.RUNNERS_DISCRETION);
        if (success) {
            game.swingResult.stoleABase = this;
            game.swingResult.caughtStealing = null;
        } else {
            game.swingResult.stoleABase = null;
            game.swingResult.caughtStealing = this;
        }
        switch (base) {
            case 1:
                base = '1st';
                break;
            case 2:
                base = '2nd';
                break;
            case 3:
                base = '3rd';
                break;
            case 4:
                base = 'Home';
        }
        game.swingResult.attemptedBase = base;
        return this;
    },
    defensiveAverage : function() {
        var _this = this.skill.defense;
        return (_this.speed + _this.fielding + _this.throwing) / 3
    },
    randomizeSkills : function(hero, allPitches) {
        this.hero = hero;
        var giraffe = this;
        var randValue = function(isPitching) {
            var value = Math.floor(Math.pow(Math.random(), 0.75)*80 + Math.random()*20);
            if (hero) {
                value += Math.floor((100 - value)*Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value;
        };
        this.skill.offense = {
            eye : randValue(),
            power : randValue(),
            speed : randValue()
        };
        this.skill.defense = {
            catching : randValue(),
            fielding : randValue(),
            speed : randValue(),
            throwing : randValue()
        };
        this.pitching.averaging = [];
        this.pitching['4-seam'] = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        this.pitching.slider = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        if (Math.random() < 0.17 || allPitches) {
            // can pitch!
            if (Math.random() > 0.6 || allPitches) {
                this.pitching['2-seam'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() < 0.18 || allPitches) {
                this.pitching.fork = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() > 0.77 || allPitches) {
                this.pitching.cutter = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() < 0.21 || allPitches) {
                this.pitching.sinker = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }

            if (Math.random() < 0.4 || allPitches) {
                this.pitching.curve = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }

            if (Math.random() < 0.9 || allPitches) {
                this.pitching.change = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
        }
        this.skill.pitching = Math.floor((this.pitching.averaging.reduce(function(prev, current) {
            return prev + current;
        }))/this.pitching.averaging.length+this.pitching.averaging.length*3);
        delete this.pitching.averaging;
    },
    getSurname : function() {
        return text.mode == 'n' ? this.surnameJ : this.surname;
    },
    getName : function() {
        return text.mode == 'n' ? this.nameJ : this.name;
    },
    getUniformNumber : function() {
        return text('#') + this.number;
    },
    getOrder : function() {
        return text([' 1st', ' 2nd', ' 3rd', ' 4th', ' 5th', ' 6th', '7th', ' 8th', ' 9th'][this.order]);
    },
    getDefiningCharacteristic: function() {
        var o = this.skill.offense,
            d = this.skill.defense,
            pitcherRating = this.skill.pitching;
        var p = this.pitching;
        const ELITE = 90;
        const EXCELLENT = 80;
        const GOOD = 60;

        var skills = [o.eye, o.power, o.speed, d.fielding, d.speed, d.throwing, pitcherRating];
        var offense = [o.eye, o.power, o.speed];
        var defense = [d.fielding, d.speed, d.throwing];

        var sum = x => x.reduce((a,b) => a + b);

        var pitching =  [0, 0, 0]; // control, speed, break
        var pitchingKeys = Object.keys(p);
        pitchingKeys.map(x => {
            pitching[0] += p[x].control;
            pitching[1] += p[x].velocity;
            pitching[2] += p[x].break;
        });
        var pitches = pitchingKeys.length;
        pitching = pitching.map(x => x/pitches | 0);

        if (pitcherRating > 90) {
            if (pitcherRating > 105) {
                return text('Ace');
            }
            if (pitching[0] > EXCELLENT) {
                return text('Control pitcher');
            }
            if (pitching[1] > EXCELLENT) {
                return text('Flamethrower');
            }
            if (pitching[2] > EXCELLENT) {
                return text('Breaking ball');
            }
        } else {
            if (sum(offense) > sum(defense)) {
                if (sum(offense) > ELITE * 3) {
                    return text('Genius batter');
                }
                if (offense[0] > EXCELLENT) {
                    return text('Contact');
                }
                if (offense[1] > EXCELLENT) {
                    return text('Power hitter');
                }
                if (offense[2] > EXCELLENT) {
                    return text('Speedster');
                }
            } else {
                if (sum(defense) > EXCELLENT * 3) {
                    return text('Defensive wizard');
                }
                if (defense[0] > EXCELLENT) {
                    return text('Glove');
                }
                if (defense[1] > EXCELLENT) {
                    return text('Range');
                }
                if (defense[2] > EXCELLENT) {
                    return text('Strong throw');
                }
            }
        }
        return '';
    },
    /**
     * to ease comparison in Angular (?)
     */
    toString : function() {
        return this.name + ' #' + this.number;
    },
    eye : {},
    fatigue : 0,
    name : '',
    number : 0,
    position : '',
    atBats : []
};

export { Player }