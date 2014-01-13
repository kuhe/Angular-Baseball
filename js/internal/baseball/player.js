define(function(){
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
            this.pitching.straight = {
                '4-seam' : {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            };
            this.pitching.breaking = {
                slider : {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            };
            this.skill.pitching = Math.floor((this.pitching.averaging.reduce(function(prev, current, index, arr) {
                return prev + current
            }))/this.pitching.averaging.length);
        },
        name : '',
        number : 0,
        position : ''
    };
    return Player;
});