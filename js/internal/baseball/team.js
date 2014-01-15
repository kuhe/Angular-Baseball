define(function(){
    var Team = function(baseball) {
        this.init(baseball);
    };

    Team.prototype = {
        init : function(baseball) {
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
                this.bench.push(new baseball.Player(this));
            }
            this.manager = new baseball.Manager(this);
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
    return Team;
});