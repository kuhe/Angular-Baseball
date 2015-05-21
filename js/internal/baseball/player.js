var Player = function(team) {
    this.init(team);
    var offense = this.skill.offense;
    var defense = this.skill.defense;
    var randBetween = function(a, b, skill) {
        if (offense[skill]) skill = offense[skill];
        if (defense[skill]) skill = defense[skill];
        if (isNaN(skill)) skill = 50;
        skill = Math.sqrt(0.2 + Math.random()*0.8)*skill;
        return Math.floor((skill/100) * (b - a) + a);
    };
    // let's just say we're about X games into the season
    var gamesIntoSeason = this.team.game.gamesIntoSeason;
    var IP, ER, GS, W, L;
    if (this.skill.pitching > 65) {
        IP = (this.skill.pitching - 65)*gamesIntoSeason/20;
        ER = (IP/9)*randBetween(800, 315, this.skill.pitching)/100;
        if (IP > gamesIntoSeason) {
            //starter
            GS = Math.floor(gamesIntoSeason/5);
            W = randBetween(0, GS*0.6, this.skill.pitching/1.2);
            L = randBetween((GS - W), 0, this.skill.pitching/3);
        } else {
            //reliever
            GS = Math.floor(gamesIntoSeason/40);
            W = randBetween(0, GS*0.6, this.skill.pitching);
            L = randBetween((GS - W), 0, this.skill.pitching);
        }
    }
    var pa = randBetween(gamesIntoSeason*3, gamesIntoSeason*5, 'speed');
    var paRemaining = pa;
    var bb = Math.floor(randBetween(3, 18, 'eye')*paRemaining/100);
    paRemaining -= bb;
    var ab = paRemaining;
    var so = Math.floor(randBetween(33, 2, 'eye')*paRemaining/100);
    paRemaining -= so;
    var h = Math.floor(randBetween(97, 372, 'eye')*paRemaining/1000);
    paRemaining -= h;

    var doubles = randBetween(0, h/4, 'power');
    var triples = randBetween(0, h/12, 'speed');
    var hr = Math.max(0, randBetween(-h/5, h/5, 'power'));
    var r = randBetween(0, (h + bb)/4, 'speed') + hr;
    var rbi = randBetween(0, h/3, 'power') + hr;
    var hbp = randBetween(0, gamesIntoSeason/25);
    var sf = randBetween(0, gamesIntoSeason/5, 'eye');

    var chances = randBetween(0, gamesIntoSeason*10, 'fielding');
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
            getERA : function() {
                return 9 * this.ER / Math.max(1/3, this.IP[0] + this.IP[1]/3)
            },
            ERA : null,
            ER : ER,
            H : 0, // in game
            HR : 0, // in game
            BB : 0, // in game
            IP : [IP,0]
        },
        batting : {
            getBA : function() {
                return this.h / (Math.max(1, this.ab))
            },
            ba : null,
            getOBP : function() {
                return (h + bb + hbp)/(ab + bb + hbp + sf);
            },
            obp : null,
            getSLG : function() {
                return ((h - doubles - triples - hr) + 2*doubles + 3*triples + 4*hr)/ab
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
            hbp : hbp
        },
        fielding : {
            E : E,
            PO : PO, // should depend on position
            A : Math.floor(Math.random()*5) + 1 // ehh should depend on position
        }
    };
    this.stats.pitching.ERA = this.stats.pitching.getERA();
    this.stats.batting.ba = this.stats.batting.getBA();
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
        this.randomizeSkills(Math.random() > 0.9);
        var surnameKey = Math.floor(Math.random()*data.surnames.length),
            nameKey = Math.floor(Math.random()*data.names.length);

        this.name = data.surnames[surnameKey] + ' ' + data.names[nameKey];
        var jSurname = data.surnamesJ[surnameKey],
            jGivenName = data.namesJ[nameKey];
        if (jSurname.length == 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length == 1 && jSurname.indexOf('・') < 0) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.atBats = [];
    },
    randomizeSkills : function(hero) {
        this.hero = hero;
        var giraffe = this;
        var randValue = function(isPitching) {
            var value = Math.floor(Math.pow(Math.random(), 0.75)*80 + Math.random()*20);
            if (hero) {
                value += Math.floor((100 - value)*Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
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
        return mode == 'n' ? this.nameJ[0] : this.name.split(' ')[0];
    },
    getName : function() {
        return mode == 'n' ? this.nameJ : this.name;
    },
    name : '',
    number : 0,
    position : '',
    atBats : []
};