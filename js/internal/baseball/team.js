var Team = function(game) {
    this.init(game);
};

Team.prototype = {
    constructor : Team,
    init : function(game) {
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
        this.game = game;
        for (var j = 0; j < 20; j++) {
            this.bench.push(new Player(this));
        }
        this.manager = new Manager(this);
        this.manager.makeLineup();
        this.pickName();
    },
    pickName : function() {
        var teamNameIndex = Math.floor(Math.random()*data.teamNames.length);
        this.name = data.teamNames[teamNameIndex];
        this.nameJ = data.teamNamesJ[teamNameIndex];
    },
    getName : function() {
        return mode == 'n' ? this.nameJ : this.name;
    },
    lineup : [],
    positions : {},
    manager : null,
    bench : [],
    bullpen : [],
    nowBatting : 0
};