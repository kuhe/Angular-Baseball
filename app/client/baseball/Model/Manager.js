import { Iterator } from '../Services/_services';
import { Player } from './Player';

const Manager = function(team) {
    this.init(team);
};

Manager.prototype = {
    constructor : Manager,
    init(team) {
        this.team = team;
    },
    makeLineup() {
        let jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        if (!this.team.positions.pitcher.number) {
            this.team.positions.pitcher.number = jerseyNumber++;
        }
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], 'right');
        this.team.positions.catcher.position = 'catcher';
        if (!this.team.positions.catcher.number) {
            this.team.positions.catcher.number = jerseyNumber++;
        }
        Iterator.each(this.team.bench, (key, player) => {
            if (!player.number) {
                jerseyNumber += 1 + (Math.random() * 5 | 0);
                player.number = jerseyNumber;
            }
        });
        this.team.positions.short = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'left');
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
    selectForSkill(pool, skillset, requiredThrowingHandedness) {
        if (this.team.bench.length || pool === this.team.positions) {
            let selection = this.team.bench[0];
            let rating = 0;
            let index = 0;
            Iterator.each(pool, (key, player) => {
                const skills = skillset.slice();
                let cursor = player.skill;
                let property = skills.shift();
                while (property) {
                    cursor = cursor[property];
                    property = skills.shift();
                }
                if (!(player.order+1) && cursor >= rating && (!requiredThrowingHandedness || player.throws === requiredThrowingHandedness)) {
                    rating = cursor;
                    selection = player;
                    index = key;
                }
            });
            if (pool === this.team.bench) {
                delete this.team.bench[index];
                this.team.bench = this.team.bench.filter(player => player instanceof selection.constructor);
            }
            return selection;
        }
        return 'no players available';
    },
    /**
     * used by the AI to substitute a fatigued pitcher
     * @param {Number} fatigueAllowed
     * only execute if the pitcher's fatigue is greater than this number
     */
    checkPitcherFatigue(fatigueAllowed = 120) {
        const team = this.team;
        const pitcher = team.positions.pitcher;

        const sub = this.selectForSkill(team.bench, ['pitching']);
        if (!(sub instanceof Player)) {
            return;
        }

        const replace = pitcher.fatigue - pitcher.skill.pitching;
        const remain = fatigueAllowed - sub.skill.pitching;

        if (replace > remain) {
            sub.substitute(pitcher);
        } else {
            team.bench.push(sub);
        }
    }
};

export { Manager }