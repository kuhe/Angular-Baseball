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