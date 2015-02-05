var app = angular.module('YakyuuAikoukai', []);

var Field = function(game) {
    this.init(game);
};

Field.prototype = {
    constructor : Field,
    init : function(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    determineSwingContactResult : function(swing) {
        if (typeof swing == 'undefined') swing = this;
        var x = swing.x, y = swing.y;
        var splayAngle = 90 - 1.5*x;
        var flyAngle = -3*y;
        var power = this.game.batter.skill.offense.power;
        var landingDistance = (50 + Math.random()*300 + (power/100)*75) * (1 - Math.abs(flyAngle - 30)/60);

        if (Math.abs(90 - splayAngle) > 50) swing.foul = true;

        swing.fielder = this.findFielder(splayAngle, landingDistance);
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        swing.splay = splayAngle - 90;
        swing.foul = false;

        if (swing.fielder) {
            var fielder = (this.game.half == top ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder]);

            var fieldingEase = fielder.skill.defense.fielding/100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel*1.65;
            if (interceptRating > 0 && flyAngle > -10) {
                //caught cleanly?
                if ((100-fielder.skill.defense)*0.08 > Math.random()) { //error
                    fieldingEase *= 0.5;
                    this.game.tally[this.game.half == 'top' ? 'home' : 'away']['E']++;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                }
            } else {
                swing.caught = false;
            }
            if (!swing.caught) {
                if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] != 1 && (interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase
                       -this.game.batter.skill.offense.speed > -75) {
                    swing.thrownOut = true;
                } else {
                    swing.thrownOut = false;
                    swing.bases = 1;
                    var fieldingReturnDelay = -1*((interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase - this.game.batter.skill.offense.speed);
                    log('fielder return delay', fieldingReturnDelay, interceptRating, fielder.skill.defense);
                    while (fieldingReturnDelay - 100 > 0) {
                        swing.bases++;
                        fieldingReturnDelay  -= 80;
                    }
                }
            }
        } else {
            if (Math.abs(90 - splayAngle) < 45 && landingDistance > 300) {
                swing.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }

        return swing;
    },
    findFielder : function(splayAngle, landingDistance) {
        if (Math.abs(90 - splayAngle) > 50) return false;
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 66 && Math.abs(90 - splayAngle) < 5) {
            return 'pitcher';
        }
        if (landingDistance > 20 && landingDistance + (Math.abs(90 - splayAngle))/90*37 < 155) {
            if (splayAngle < 45 + 23) {
                return 'third';
            } else if (splayAngle < 45 + 23 + 23) {
                return 'short';
            } else if (splayAngle < 45 + 23 + 23 + 23) {
                return 'second';
            } else {
                return 'first';
            }
        } else if (landingDistance > 90 && landingDistance < 310) {
            if (splayAngle < 45 + 28) {
                return 'left';
            } else if (splayAngle < 45 + 28 + 34) {
                return 'center';
            } else {
                return 'right';
            }
        } else {
            return false;
        }
    },
    positions : {
        pitcher : [90, 66],
        catcher : [0, 0],
        first : [90 + 45 - 7, 98],
        second : [90 + 12.5, 130],
        short : [90 - 12.5, 130],
        third : [90 - 45 + 7, 98],
        left : [45 + 14, 280],
        center : [90, 280],
        right : [135 - 14, 280]
    },
    getPolarDistance : function(a, b) {
        return Math.sqrt(a[1]*a[1] + b[1]*b[1] - 2*a[1]*b[1]*Math.cos(a[0]*Math.PI/180 - b[0]*Math.PI/180));
    },
    fieldingTest : function() {
        var fielders = {
            pitcher : {tally : 0, distances : []},
            catcher : {tally : 0, distances : []},
            first : {tally : 0, distances : []},
            second : {tally : 0, distances : []},
            short : {tally : 0, distances : []},
            third : {tally : 0, distances : []},
            left : {tally : 0, distances : []},
            center : {tally : 0, distances : []},
            right : {tally : 0, distances : []},
            'false' : {tally : 0, distances : []}
        };
        var angle = Math.random()*90+45;
        var distance = Math.random()*320;
        var fielder = this.findFielder(angle, distance);
        var data = {};
        if (fielder) {
            var fielderCandidates = this.fielderSelectionTest(angle, distance, true);
                data.fielder = fielderCandidates[1];
                data[fielderCandidates[0]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[0]][0], this.positions[fielderCandidates[0]][1]]);
                data[fielderCandidates[1]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[1]][0], this.positions[fielderCandidates[1]][1]])
            return data;
        }
    },
    aggregateFieldingTest : function() {
        var fielders = {
            pitcher : {tally : 0, distances : []},
            catcher : {tally : 0, distances : []},
            first : {tally : 0, distances : []},
            second : {tally : 0, distances : []},
            short : {tally : 0, distances : []},
            third : {tally : 0, distances : []},
            left : {tally : 0, distances : []},
            center : {tally : 0, distances : []},
            right : {tally : 0, distances : []},
            'false' : {tally : 0, distances : []}
        };
        var selections = [];
        for (var i = 0; i < 1000; i++) {
            var angle = Math.random()*90+45;
            var distance = Math.random()*320;
            var fielder = this.findFielder(angle, distance);
            fielders[fielder].tally++;
            if (fielder) {
                fielders[fielder].distances.push(this.getPolarDistance([angle, distance], [this.positions[fielder][0], this.positions[fielder][1]]));
            }
            selections.push([angle, distance]);
            selections.push(this.fielderSelectionTest(angle, distance, true));
        }
        return [fielders, selections];
    },
    fielderSelectionTest : function(angle, distance, returnFielder) {
        var distances = [];
        var minDistance = 300;
        var giraffe = this;
        var fielder = false;
        jQ.each(this.positions, function(position, spot) {
            var thisDistance = giraffe.getPolarDistance([angle, distance], spot);
            distances[thisDistance] = position;
            if (minDistance > thisDistance) {
                minDistance = thisDistance;
                fielder = position;
            }
        });
        return returnFielder ? [fielder, this.findFielder(angle, distance)] : distances;
    }
};
var Game = function(baseball) {
    this.init(baseball);
};

Game.prototype = {
    constructor : Game,
    init : function() {
        this.field = new Field(this);
        this.teams.away = new Team();
        this.teams.home = new Team();
        this.log = new Log();
        this.helper = helper;
        while (this.teams.away.name == this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.renderer = new Renderer(this);
        this.umpire = new Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        } else {
            this.autoPitch();
        }
    },
    humanBatting : function() {
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'away';
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
        }
    },
    humanPitching : function() {
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'away';
                break;
        }
    },
    end : function() {
        this.stage = 'end';
        this.log.note(this.tally.home.R > this.tally.away.R ? 'Home team wins!' : (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!'));
    },
    stage : 'pitch', //pitch, swing
    humanControl : 'home', //home, away, both
    receiveInput : function(x, y) {
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch') {
            this.thePitch(x, y);
        } else if (this.stage == 'swing') {
            this.theSwing(x, y);
        }
    },
    autoPitchSelect : function() {
        var pitchName = this.helper.selectRandomPitch();
        while (!this.pitcher.pitching.hasOwnProperty(pitchName)) {
            pitchName = this.helper.selectRandomPitch();
        }
        var pitch = this.pitcher.pitching[pitchName];
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    },
    autoPitch : function() {
        if (this.stage == 'pitch') {
            this.autoPitchSelect();
            var x = 100 + Math.floor(Math.random()*100) - Math.floor(Math.random()*100);
            var y = Math.floor(Math.sqrt(Math.random()*40000));
            this.thePitch(x, y);
        }
    },
    autoSwing : function(deceptiveX, deceptiveY) {
        var x = Math.floor(Math.random()*200), y = Math.floor(Math.random()*200);
        if (100*Math.random() < this.batter.skill.offense.eye) {
            x = (this.pitchInFlight.x*(1 + 3*this.batter.skill.offense.eye/100) + x)/4;
            y = (this.pitchInFlight.y*(1 + 3*this.batter.skill.offense.eye/100) + y)/4;
        } else {
            x = (deceptiveX*(1 + 3*this.batter.skill.offense.eye/100) + x)/4;
            y = (deceptiveY*(1 + 3*this.batter.skill.offense.eye/100) + y)/4;
        }
        var swingLikelihood = 50;
        if (x < 50 || x > 150 || y < 35 || y > 165) {
            swingLikelihood = Math.min(50, (100 - (this.batter.skill.offense.eye)));
        } else {
            swingLikelihood = Math.min(50, this.batter.skill.offense.eye);
        }
        if (swingLikelihood - 10*(this.umpire.count.balls - this.umpire.count.strikes) > Math.random()*100) {
            // no swing;
            this.theSwing(-20, y);
        } else {
            this.theSwing(x, y);
        }
    },
    pitchTarget : {x : 100, y : 100},
    pitchInFlight : {
        x : 100,
        y : 100,
        breakDirection : [0, 0],
        name : 'slider',
        velocity : 50,
        break : 50,
        control : 50
    },
    swingResult : {
        x : 100, //difference to pitch location
        y : 100, //difference to pitch location
        strike : false,
        foul : false,
        caught : false,
        contact : false,
        looking : true,
        bases : 0,
        fielder : 'short',
        outs : 0
    },
    pitchSelect : function() {

    },
    thePitch : function(x, y) {
        if (this.stage == 'pitch') {
            this.pitchTarget.x = x;
            this.pitchTarget.y = y;

            this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
            this.battersEye = 'looks like: '+(Math.abs(this.pitchInFlight.breakDirection[0])+Math.abs(this.pitchInFlight.breakDirection[1]) > 40 ?
                'breaking ball' : 'fastball');

            var control = this.pitchInFlight.control;
            this.pitchTarget.x = Math.min(199.9, Math.max(0.1, this.pitchTarget.x + (50 - Math.random()*100)/(1+control/100)));
            this.pitchTarget.y = Math.min(199.9, Math.max(0.1, this.pitchTarget.y + (50 - Math.random()*100)/(1+control/100)));

            if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

            this.pitchInFlight.x = Math.floor(this.pitchTarget.x + (this.pitchInFlight.breakDirection[0]
                *((0.5+Math.random()*this.pitchInFlight.break)/100)));
            this.pitchInFlight.y = Math.floor(this.pitchTarget.y + (this.pitchInFlight.breakDirection[1]
                *((0.5+Math.random()*this.pitchInFlight.break)/100))/(0.5 + this.pitchTarget.y/200));
            this.log.notePitch(this.pitchInFlight, this.batter);

            this.stage = 'swing';
            if (this.humanControl == 'both' || this.teams[this.humanControl].lineup[this.batter.team.nowBatting] == this.batter) {

            } else {
                this.autoSwing(x, y);
            }
        }
    },
    battersEye : '',
    theSwing : function(x, y) {
        if (this.stage == 'swing') {
            this.swingResult = {};
            this.swingResult.x = (x - this.pitchInFlight.x)/(0.5+Math.random()*this.batter.skill.offense.eye/50);
            this.swingResult.y = (y - this.pitchInFlight.y)/(0.5+Math.random()*this.batter.skill.offense.eye/50);

            if (!(x < 0 || x > 200)) {
                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
                } else {
                    this.swingResult.contact = false;
                }
            } else {
                this.swingResult.strike = this.pitchInFlight.x > 50 && this.pitchInFlight.x < 150
                    && this.pitchInFlight.y > 35 && this.pitchInFlight.y < 165;
                this.swingResult.contact = false;
                this.swingResult.looking = true;
            }

            this.log.noteSwing(this.swingResult);
            this.stage = 'pitch';

            this.umpire.makeCall();

            if (this.humanControl == 'both' || this.teams[this.humanControl].positions.pitcher == this.pitcher) {

            } else {
                this.autoPitch();
            }
        }
    },
    field : null,
    teams : {
        away : null,
        home : null
    },
    log : null,
    half : 'top',
    inning : 1,
    scoreboard : {
        away : {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
            6 : 0,
            7 : 0,
            8 : 0,
            9 : 0
        },
        home : {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
            6 : 0,
            7 : 0,
            8 : 0,
            9 : 0
        }
    },
    tally : {
        away : {
            H : 0,
            R : 0,
            E : 0
        },
        home : {
            H : 0,
            R : 0,
            E : 0
        }
    }
};
var Manager = function(team) {
    this.init(team);
};

Manager.prototype = {
    constructor : Manager,
    init : function(team) {
        this.team = team;
    },
    makeLineup : function() {
        var jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        this.team.positions.pitcher.number = jerseyNumber++;
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], true);
        this.team.positions.catcher.position = 'catcher';
        this.team.positions.catcher.number = jerseyNumber++;
        jQ.each(this.team.bench, function(key, player) {
            player.number = jerseyNumber++;
        });
        this.team.positions.short = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(this.team.bench, ['defense', 'fielding']);
        this.team.positions.first.position = 'first';

        this.team.lineup[3] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[3].order = 3;
        this.team.lineup[2] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[2].order = 2;
        this.team.lineup[4] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[4].order = 4;
        this.team.lineup[0] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[0].order = 0;
        this.team.lineup[1] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[1].order = 1;
        this.team.lineup[5] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[5].order = 5;
        this.team.lineup[6] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[6].order = 6;
        this.team.lineup[7] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[7].order = 7;
        this.team.lineup[8] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[8].order = 8;
    },
    selectForSkill : function(pool, skillset, mustBeRightHanded) {
        var property;
        mustBeRightHanded = !!mustBeRightHanded;
        if (this.team.bench.length || pool == this.team.positions) {
            var selection = this.team.bench[0];
            var rating = 0;
            var index = 0;
            jQ.each(pool, function(key, player) {
                var skills = skillset.slice();
                var cursor = player.skill;
                while (property = skills.shift()) {
                    cursor = cursor[property];
                }
                if (!(player.order+1) && cursor >= rating && (!mustBeRightHanded || player.throws == 'right')) {
                    rating = cursor;
                    selection = player;
                    index = key;
                }
            });
            delete this.team.bench[index];
            if (pool == this.team.bench) {
                this.team.bench = this.team.bench.filter(function(player) {
                    return player instanceof selection.constructor;
                })
            }
            return selection;
        }
        return 'no players available';
    }
};
var Player = function(team) {
    this.init(team);
};

Player.prototype = {
    constructor : Player,
    init : function(team) {
        this.throws = Math.random() > 0.86 ? 'left' : 'right';
        this.bats = Math.random() > 0.75 ? 'left' : 'right';
        this.team = team;
        this.skill = {};
        this.pitching = {averaging : []};
        this.number = 0;
        this.randomizeSkills();
        this.name = data.surnames[Math.floor(Math.random()*data.surnames.length)] + ' ' +
            data.names[Math.floor(Math.random()*data.names.length)];
        this.atBats = [];
    },
    randomizeSkills : function() {
        var giraffe = this;
        var randValue = function(isPitching) {
            var value = Math.floor(Math.sqrt(Math.random())*100);
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value
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
        this.pitching['slider'] = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        if (Math.random() < 0.17) {
            // can pitch!
            if (Math.random() > 0.6) {
                this.pitching['2-seam'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() < 0.18) {
                this.pitching['fork'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() > 0.77) {
                this.pitching['cutter'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() < 0.21) {
                this.pitching['sinker'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }

            if (Math.random() < 0.4) {
                this.pitching['curve'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }

            if (Math.random() < 0.9) {
                this.pitching['change'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
        }
        this.skill.pitching = Math.floor((this.pitching.averaging.reduce(function(prev, current, index, arr) {
            return prev + current
        }))/this.pitching.averaging.length+this.pitching.averaging.length*3);
        delete this.pitching.averaging;
    },
    getSurname : function() {
        return this.name.split(' ')[0];
    },
    name : '',
    number : 0,
    position : '',
    atBats : []
};
var Team = function(baseball) {
    this.init(baseball);
};

Team.prototype = {
    constructor : Team,
    init : function() {
        this.lineup = [];
        this.bench = [];
        this.bullpen = [];
        this.positions = {
            pitcher : null,
            catcher : null,
            first : null,
            second : null,
            short : null,
            third : null,
            left : null,
            center : null,
            right : null
        };
        for (var j = 0; j < 20; j++) {
            this.bench.push(new Player(this));
        }
        this.manager = new Manager(this);
        this.manager.makeLineup();
        this.pickName();
    },
    pickName : function() {
        this.name = this.name = data.teamNames[Math.floor(Math.random()*data.teamNames.length)];
    },
    lineup : [],
    positions : {},
    manager : null,
    bench : [],
    bullpen : [],
    nowBatting : 0
};
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
                    this.game.batter.atBats.push('FO');
                    this.newBatter(); //todo: sac fly
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        if (result.thrownOut) {
                            this.count.outs++;
                            this.game.batter.atBats.push('GO');
                            this.newBatter(); //todo: sac
                        }
                        if (result.bases) {
                            this.game.tally[this.game.half == 'top' ? 'away' : 'home']['H']++;
                            var bases = result.bases;
                            switch (bases) {
                                case 0 :
                                    this.game.batter.atBats.push('SO');
                                    break;
                                case 1 :
                                    this.game.batter.atBats.push('H');
                                    break;
                                case 2 :
                                    this.game.batter.atBats.push('2B');
                                    break;
                                case 3 :
                                    this.game.batter.atBats.push('3B');
                                    break;
                                case 4 :
                                    this.game.batter.atBats.push('HR');
                                    break;
                            }
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
            this.game.batter.atBats.push('SO');
            this.newBatter();
        }
        if (this.count.balls > 3) {
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            this.game.batter.atBats.push('BB');
            this.advanceRunners(true).reachBase().newBatter();
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
    advanceRunners : function(isWalk) {
        isWalk = !!isWalk;

        if (isWalk) {
            if (this.game.field.first) {
                if (this.game.field.second) {
                    if (this.game.field.third) {
                        //bases loaded
                        this.game.batter.atBats.push('RBI');
                        this.game.field.third.atBats.push('R');
                        this.game.scoreboard[this.game.half == 'top' ? 'away' : 'home'][this.game.inning]++;
                        this.game.tally[this.game.half == 'top' ? 'away' : 'home']['R']++;
                        this.game.field.third = this.game.field.second;
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    } else {
                        // 1st and second
                        this.game.field.third = this.game.field.second;
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    }
                } else {
                    if (this.game.field.third) {
                        // first and third
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    } else {
                        // first only
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    }
                }
            } else {
                // no one on first
            }
        } else {
            if (this.game.field.third instanceof this.game.batter.constructor) {
                // run scored
                this.game.scoreboard[this.game.half == 'top' ? 'away' : 'home'][this.game.inning]++;
                this.game.tally[this.game.half == 'top' ? 'away' : 'home']['R']++;
                if (this.game.batter != this.game.field.third) {
                    this.game.batter.atBats.push('RBI');
                    this.game.field.third.atBats.push('R');
                }
            }
            this.game.field.third = this.game.field.second;
            this.game.field.second = this.game.field.first;
            this.game.field.first = null;
        }
        return this;
    },
    newBatter : function() {
        this.game.log.pitchRecord = [];
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
        this.game.swingResult.looking = true; // hide bat
        this.game.pitchInFlight.x = null; // hide ball
        this.game.pitchInFlight.y = null; // hide ball
        this.game.log.pitchRecord = [];
        var offense, defense;
        this.game.field.first = null;
        this.game.field.second = null;
        this.game.field.third = null;
        if (this.game.half == 'top') {
            this.game.half = 'bottom';
            if (this.game.inning == 9 && this.game.tally.home.R > this.game.tally.away.R) {
                return this.game.end();
            }
        } else {
            this.game.half = 'top';
            this.game.inning++;
            if (this.game.inning > 9) {
                return this.game.end();
            }
        }
        offense = this.game.half == 'top' ? 'away' : 'home';
        defense = this.game.half == 'top' ? 'home' : 'away';
        this.game.log.note((this.game.half == 'top' ? 'Top' : 'Bottom')+' '+this.game.inning);
        var team = this.game.teams[offense];
        this.game.batter = team.lineup[team.nowBatting];
        this.game.deck = team.lineup[(team.nowBatting + 1)%9];
        this.game.hole = team.lineup[(team.nowBatting + 2)%9];

        this.game.pitcher = this.game.teams[defense].positions.pitcher;
        this.game.log.noteBatter(this.game.batter);
    },
    says : 'Play ball!',
    game : null
};
data = {
    surnames : [
        'Satou',
        'Suzuki',
        'Takahashi',
        'Watanabe',
        'Itou',
        'Yamamoto',
        'Nakamura',
        'Kobayashi',
        'Katou',
        'Yoshida',
        'Sasaki',
        'Yamaguchi',
        'Saitou',
        'Kimura',
        'Abe',
        'Ikeda',
        'Iwasaki',
        'Kinoshita',
        'Adachi',
        'Fujiwara',
        'Haseyama'
    ],
    names : [
        'Takumi',
        'Hikaru',
        'Yuuki',
        'Shouta',
        'Ichirou',
        'Touma',
        'Ren',
        'Minato',
        'Rui',
        'Tatsuki',
        'Kenji',
        'Itsuki',
        'Haru',
        'Kouichi',
        'Sousuke',
        'Kousuke',
        'Yuuta',
        'Daiki',
        'Eita'
    ],
    teamNames : [
        'Yokohama',
        'Osaka',
        'Nagoya',
        'Sapporo',
        'Kobe',
        'Kyoto',
        'Fukuoka',
        'Kawasaki',
        'Saitama',
        'Hiroshima',
        'Sendai',
        'Chiba',
        'Niigata',
        'Hamamatsu',
        'Shizuoka',
        'Sagamihara',
        'Okayama',
        'Kumamoto',
        'Kagoshima',
        'Funabashi',
        'Kawaguchi',
        'Himeji',
        'Matsuyama',
        'Utsunomiya',
        'Matsudo',
        'Nishinomiya',
        'Kurashiki',
        'Ichikawa',
        'Fukuyama',
        'Amagasaki',
        'Kanazawa',
        'Nagasaki',
        'Yokosuka',
        'Toyama',
        'Takamatsu',
        'Machida',
        'Gifu',
        'Hirakata',
        'Fujisawa',
        'Kashiwa',
        'Toyonaka',
        'Nagano',
        'Toyohashi',
        'Ichinomiya',
        'Wakayama',
        'Okazaki',
        'Miyazaki',
        'Nara',
        'Suita',
        'Takatsuki',
        'Asahikawa',
        'Iwaki',
        'Takasaki',
        'Tokorozawa',
        'Kawagoe',
        'Akita',
        'Koshigaya',
        'Maebashi',
        'Naha',
        'Yokkaichi',
        'Aomori',
        'Kurume',
        'Kasugai',
        'Morioka',
        'Akashi',
        'Fukushima',
        'Shimonoseki',
        'Nagaoka',
        'Ichihara',
        'Hakodate',
        'Ibaraki',
        'Fukui',
        'Kakogawa',
        'Tokushima',
        'Mito',
        'Hiratsuka',
        'Sasebo',
        'Kure',
        'Hachinohe',
        'Saga',
        'Neyagawa',
        'Fuji',
        'Kasukabe',
        'Chigasaki',
        'Matsumoto',
        'Atsugi',
        'Yamato',
        'Ageo',
        'Takarazuka',
        'Tsukuba',
        'Numazu',
        'Kumagaya',
        'Isesaki',
        'Kishiwada',
        'Tottori',
        'Odawara',
        'Suzuka',
        'Matsue',
        'Hitachi',
    ]
};
helper = {
    pitchDefinitions : {
        '4-seam' :      [0, 0, 1], //x movement, y movement, speed ratio
        '2-seam' :      [20, -20, 0.90],
        'cutter' :      [-25, -20, 0.95],
        'sinker' :      [-15, -30, 0.95],

        'slider' :      [-50, -35, 0.9],
        'fork'   :      [0, -70, 0.87],
        'curve'  :      [0, -90, 0.82],

        'change' :    [0, -10, 0.88]
    },
    selectRandomPitch : function() {
        return [
            '4-seam', '2-seam', 'cutter', 'sinker',
            'slider', 'fork', 'curve',
            'change'
        ][Math.floor(Math.random()*8)]
    }
};

var Log = function() {
    this.init();
};

Log.prototype = {
    init : function() {
        this.pitchRecord = [];
    },
    note : function(note) {
        this.record.unshift(note);
        this.shortRecord = this.record.slice(0, 6);
    },
    noteBatter : function(batter) {
        var order = batter.team.nowBatting;
        order = {
            0 : ' 1st',
            1 : ' 2nd',
            2 : ' 3rd',
            3 : ' 4th',
            4 : ' 5th',
            5 : ' 6th',
            6 : ' 7th',
            7 : ' 8th',
            8 : ' 9th'
        }[order];
        var positions = this.longFormFielder;
        this.note('Now batting'+order+', '+positions[batter.position]+', '+batter.name);
    },
    getPitchLocationDescription : function(pitchInFlight, batterIsLefty) {
        var x = pitchInFlight.x, y = pitchInFlight.y, say = '';
        var noComma = false, noComma2 = false;
        var ball = false;
        if (!batterIsLefty) x = 200 - x;
        if (x < 50) {
            say += 'way outside';
            ball = true;
        } else if (x < 70) {
            say += 'outside';
        } else if (x < 100) {
            say += '';
            noComma = true;
        } else if (x < 130) {
            say += '';
            noComma = true;
        } else if (x < 150) {
            say += 'inside';
        } else {
            say += 'way inside';
            ball = true;
        }
        if (say != '') say += ', ';
        if (y < 35) {
            say += 'way low';
            ball = true;
        } else if (y < 65) {
            say += 'low';
        } else if (y < 135) {
            say += '';
            noComma2 = true;
        } else if (y < 165) {
            say += 'high';
        } else {
            say += 'way high';
            ball = true;
        }
        if (noComma || noComma2) {
            say = say.split(', ').join('');
            if (noComma && noComma2) {
                say = 'down the middle';
            }
        }
        // say = (ball ? 'Ball, ' : 'Strike, ') + say;
        say = pitchInFlight.name.charAt(0).toUpperCase() + pitchInFlight.name.slice(1) + ' ' + say + '. ';
        return say;
    },
    notePitch : function(pitchInFlight, batter) {
        this.pitchRecord.unshift(
            this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left')
        );
    },
    noteSwing : function(swingResult) {
        if (swingResult.looking) {
            if (swingResult.strike) {
                this.pitchRecord[0] += 'Strike.'
            } else {
                this.pitchRecord[0] += 'Ball.'
            }
        } else {
            if (swingResult.contact) {
                if (swingResult.foul) {
                    this.pitchRecord[0] += 'Fouled off.'
                } else {
                    if (swingResult.caught) {
                        this.pitchRecord[0] += 'In play.'
                    } else {
                        if (swingResult.thrownOut) {
                            this.pitchRecord[0] += 'In play.'
                        } else {
                            this.pitchRecord[0] += 'In play.'
                        }
                    }
                }
            } else {
                this.pitchRecord[0] += 'Swinging strike.'
            }
        }
    },
    notePlateAppearanceResult : function(game) {
        var r = game.swingResult;
        var record = '';
        var batter = game.batter.name;
        if (r.looking) {
            if (r.strike) {
                record = (batter+' struck out looking.');
            } else {
                record = (batter+' walked.');
            }
        } else {
            if (r.contact) {
                if (r.caught) {
                    if (['left', 'center', 'right'].indexOf(r.fielder) < 0) {
                        record = (batter+' popped out to '+ r.fielder + '.');
                    } else {
                        record = (batter+' flew out to '+ r.fielder + '.');
                    }
                } else {
                    if (r.foul) {
                        // not possible to end PA on foul?
                    } else {
                        if (r.thrownOut) {
                            if (Math.random() > 0.5) {
                                record = (batter+' grounded out to '+ r.fielder + '.');
                            } else {
                                record = (batter+' thrown out by '+ r.fielder + '.');
                            }
                        } else {
                            switch (r.bases) {
                                case 1:
                                    record = (batter+' reached on single to '+ r.fielder + '.');
                                    break;
                                case 2:
                                    record = (batter+' doubled past '+ r.fielder + '.');
                                    break;
                                case 3:
                                    record = (batter+' reached third on triple past '+ r.fielder + '.');
                                    break;
                                case 4:
                                    if (r.splay < -15) {
                                        record = (batter+' homered to left.');
                                    } else if (r.splay < 15) {
                                        record = (batter+' homered to center.');
                                    } else {
                                        record = (batter+' homered to right.');
                                    }
                                    break;
                            }
                        }
                    }
                }
            } else {
                record = (batter+' struck out swinging.');
            }
        }
        this.record.unshift(record);
        this.pitchRecord = ['Previous: '+record];
    },
    pointer : 0,
    pitchRecord : [],
    shortRecord : [],
    record : [],
    longFormFielder : {
        first : 'first baseman',
        second : 'second baseman',
        third : 'third baseman',
        short : 'shortstop',
        pitcher : 'pitcher',
        catcher : 'catcher',
        left : 'left fielder',
        center : 'center fielder',
        right : 'right fielder'
    }
};
var Renderer = function(game) {
    this.init(game);
};

Renderer.prototype = {
    init : function(game) {
        this.game = game;
    },
    render : function() {

    }
};
app.controller('IndexController', function($scope) {
    window.s = $scope;
    $scope.y = new Game();
    $scope.proceedToGame = function () {
        jQ('.blocking').remove();
    };
    $scope.updateFlightPath = function($event) {
        var ss = document.styleSheets;
        var animation = 'flight';
        for (var i = 0; i < ss.length; ++i) {
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == animation) {
                    var rule = ss[i].cssRules[j];
                }
            }
        }
        var keyframes = rule;
        var to = function(percent, top, left) {
            var originTop = 0;
            var originLeft = 100;
            Math.square = function(x) { return x*x };
            left = originLeft + Math.square(percent/100)*(left - originLeft);
            top = Math.square(percent/100)*(top - originTop);
            var padding = Math.max(Math.square(percent/100)*13, 2);
            var borderWidth = Math.square(percent/100)*4;
            return 'top: '+top+'px; left: '+left+'px; padding: '+padding+'px; border-width:'+borderWidth+'px';
        };
        var game = $scope.y;
        var top = 200-game.pitchTarget.y;
        var left = game.pitchTarget.x;
        var breakTop = 200-game.pitchInFlight.y,
            breakleft = game.pitchInFlight.x;
        keyframes.deleteRule('0%');
        keyframes.deleteRule('25%');
        keyframes.deleteRule('50%');
        keyframes.deleteRule('75%');
        keyframes.deleteRule('100%');
        keyframes.insertRule('0% { '+to(15, top, left)+' }');
        keyframes.insertRule('25% { '+to(20, top, left)+' }');
        keyframes.insertRule('50% { '+to(35, top, left)+' }');
        keyframes.insertRule('75% { '+to(65, top, left)+' }');
        keyframes.insertRule('100% { '+to(100, breakTop, breakleft)+' }');

        $baseballs = jQ('.baseball');
        var flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400;
        $baseballs.css('-webkit-animation', 'flight '+flightSpeed+'s 1 0s linear');
        $baseballs.removeClass('flight');
        $baseballs.addClass('flight');

        $scope.lastTimeout = setTimeout(function() {
            jQ('.baseball').removeClass('flight');
            jQ('.baseball').addClass('spin');
            var horizontalBreak = (60 - Math.abs(game.pitchTarget.x - game.pitchInFlight.x))/10;
            jQ('.baseball').css('-webkit-animation', 'spin '+horizontalBreak+'s 5 0s linear')
            $scope.allowInput = true;
        }, flightSpeed*1000);

        if (game.humanBatting()) {
            jQ('.baseball.break').addClass('hide');
        } else {
            jQ('.baseball.break').removeClass('hide');
        }
        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting()) {
                jQ('.baseball.break').addClass('hide');
            } else {
                jQ('.baseball.break').removeClass('hide');
            }
            jQ('.baseball.pitch').removeClass('hide');
        }
        jQ('.baseball.pitch').css({
            top: 200-game.pitchTarget.y,
            left: game.pitchTarget.x
        });
        jQ('.baseball.break').css({
            top: 200-game.pitchInFlight.y,
            left: game.pitchInFlight.x
        });
        $baseballs.each(function(k, item) {
            var elm = item,
                newone = elm.cloneNode(true);
            elm.parentNode.replaceChild(newone, elm);
        });
    };
    $scope.selectPitch = function(pitchName) {
        if ($scope.y.stage == 'pitch') {
            $scope.y.pitchInFlight = jQ.extend({}, $scope.y.pitcher.pitching[pitchName]);
            $scope.y.pitchInFlight.name = pitchName;
            $scope.y.swingResult.looking = true;
        }
    };
    $scope.allowInput = true;
    $scope.indicate = function($event) {
        if (!$scope.allowInput) {
            return;
        }
        $scope.allowInput = false;
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        clearTimeout($scope.lastTimeout);
        $scope.y.receiveInput(relativeOffset.x, relativeOffset.y);
        $scope.updateFlightPath($event);
    };
    $scope.rate = function(rating) {
        if (rating > 95) {
            return 'A+';
        } else if (rating > 90) {
            return 'A';
        } else if (rating > 85) {
            return 'A-';
        } else if (rating > 80) {
            return 'B+';
        } else if (rating > 70) {
            return 'B';
        } else if (rating > 60) {
            return 'C';
        } else if (rating > 50) {
            return 'C-';
        } else {
            return 'D';
        }
    };
    $scope.abbreviatePosition = function(position) {
        return {
            pitcher : 'P',
            catcher : 'C',
            first : '1B',
            second : '2B',
            short : 'SS',
            third : '3B',
            left : 'LF',
            center : 'CF',
            right : 'RF'
        }[position];
    };
});
var Catcher = function() {
    this.init();
};

Catcher.prototype = {
    init : function() {

    }
};
var Fielder = function() {
    this.init();
};

Fielder.prototype = {
    init : function() {

    }
};
var Pitcher = function() {
    this.init();
};

Pitcher.prototype = {
    init : function() {

    }
};
var Batter = function() {
    this.init();
};

Batter.prototype = {
    init : function() {

    }
};
var Runner = function() {
    this.init();
};

Runner.prototype = {
    init : function() {

    }
};