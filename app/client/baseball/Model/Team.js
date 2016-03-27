import { Player } from '../Model/Player';
import { Manager } from '../Model/Manager';

import { data, text } from '../Utility/_utils';

var Team = function(game, heroRate) {
    this.init(game, heroRate);
};

Team.RUNNERS_DISCRETION = 'runnersDiscretion';
Team.RUNNER_GO = 'go';
Team.RUNNER_HOLD = 'hold';

Team.prototype = {
    constructor : Team,
    init : function(game, heroRate) {
        this.sub = this.noSubstituteSelected;
        heroRate = heroRate || 0.10;
        this.substituted = [];
        this.pickName();
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
        this.manager = new Manager(this);
        if (game !== 'no init') {
            this.game = game;
            for (var j = 0; j < 20; j++) {
                this.bench.push(new Player(this, Math.random() < heroRate));
            }
            if (this.bench.length == 20) {
                this.manager.makeLineup();
            }
        }
    },
    pickName : function() {
        var teamNameIndex = Math.floor(Math.random()*data.teamNames.length);
        this.name = data.teamNames[teamNameIndex];
        this.nameJ = data.teamNamesJ[teamNameIndex];
    },
    getName : function() {
        return text.mode == 'n' ? this.nameJ : this.name;
    },
    stealAttempt : Team.RUNNERS_DISCRETION,
    lineup : [],
    positions : {},
    manager : null,
    bench : [],
    bullpen : [],
    nowBatting : 0,
    expanded : 'Player&',
    noSubstituteSelected : {
        toString : function() { return ''; },
        toValue : function() { return false; }
    }
};

export { Team }