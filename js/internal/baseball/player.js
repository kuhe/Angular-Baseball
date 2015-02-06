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
        var surnamekey = Math.floor(Math.random()*data.surnames.length),
            nameKey = Math.floor(Math.random()*data.names.length);

        this.name = data.surnames[surnamekey] + ' ' + data.names[nameKey];
        this.nameJ = data.surnamesJ[surnamekey] + data.namesJ[nameKey];
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
        return mode == 'n' ? this.nameJ[0] : this.name.split(' ')[0];
    },
    getName : function() {
        return mode == 'n' ? this.nameJ : this.name;
    },
    stats : {
        pitching : {
            pitches : 0,
            strikes : 0,
            K : 0,
            ERA : 0,
            H : 0,
            BB : 0
        },
        batting : {
            ba : 0,
            pa : 0,
            ab : 0,
            so : 0,
            bb : 0,
            h : 0,
            '2b' : 0,
            '3b' : 0,
            hr : 0,
            rbi : 0,
            hbp : 0
        }
    },
    name : '',
    number : 0,
    position : '',
    atBats : []
};