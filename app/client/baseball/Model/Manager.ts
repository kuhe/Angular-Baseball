import { Iterator } from '../Services/Iterator';
import { Team } from './Team';
import { Player } from './Player';
import { handedness_t } from '../Api/handedness';
import { fielder_short_name_t } from '../Api/fielderShortName';

/**
 * Doesn't do all that much in our context, but this models
 * the coach of a baseball team.
 */
class Manager {
    constructor(public team: Team) {}

    /**
     * Build an offensive lineup out of the players on the bench of the team.
     */
    public makeLineup(): void {
        let jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        if (!this.team.positions.pitcher.number) {
            this.team.positions.pitcher.number = jerseyNumber++;
        }
        this.team.positions.catcher = this.selectForSkill(
            this.team.bench,
            ['defense', 'catching'],
            'right'
        );
        this.team.positions.catcher.position = 'catcher';
        if (!this.team.positions.catcher.number) {
            this.team.positions.catcher.number = jerseyNumber++;
        }
        Iterator.each(this.team.bench, (key, player) => {
            if (!player.number) {
                jerseyNumber += 1 + ((Math.random() * 5) | 0);
                player.number = jerseyNumber;
            }
        });
        this.team.positions.short = this.selectForSkill(
            this.team.bench,
            ['defense', 'fielding'],
            'right'
        );
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(
            this.team.bench,
            ['defense', 'fielding'],
            'right'
        );
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(
            this.team.bench,
            ['defense', 'fielding'],
            'right'
        );
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(
            this.team.bench,
            ['defense', 'fielding'],
            'left'
        );
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
    }

    /**
     * Select a player from a pool (bench or positions) based on a skillset.
     * @param pool - when selecting from the bench, the player is removed from the bench upon selection.
     *               when selecting lineup from positions, the player must not be in the lineup.
     * @param skillset
     * @param requiredThrowingHandedness - e.g. lefty for 1B.
     */
    public selectForSkill(
        pool: Player[] | Record<fielder_short_name_t, Player>,
        skillset: string[],
        requiredThrowingHandedness?: handedness_t
    ): Player {
        if (pool === this.team.positions) {
            pool = Object.keys(this.team.positions).map(
                (pos) => this.team.positions[pos as fielder_short_name_t]
            );
        }

        const _pool: Player[] = pool as Player[];

        if (_pool.length) {
            let selection = this.team.bench[0];
            let rating = 0;
            let index = 0;
            let selectedIndex = 0;
            for (const player of _pool) {
                const skills = skillset.slice();
                let cursor: any = player.skill;
                let property = skills.shift();
                while (property) {
                    cursor = cursor[property];
                    property = skills.shift();
                }
                if (
                    player.order === -1 &&
                    cursor >= rating &&
                    (!requiredThrowingHandedness || player.throws === requiredThrowingHandedness)
                ) {
                    rating = cursor;
                    selection = player;
                    selectedIndex = index;
                }
                index += 1;
            }
            if (pool === this.team.bench) {
                delete this.team.bench[selectedIndex];
                this.team.bench = this.team.bench.filter((player) => player instanceof Player);
            }
            return selection;
        }
        throw new Error('no players available');
    }

    /**
     * used by the AI to substitute a fatigued pitcher
     * @param fatigueAllowed
     * only execute if the pitcher's fatigue is greater than this number
     */
    public checkPitcherFatigue(fatigueAllowed = 120): void {
        const team = this.team;
        const pitcher = team.positions.pitcher;

        const sub = this.selectForSkill(team.bench, ['pitching']);
        if (!(sub && sub.substitute)) {
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
}

export { Manager };
