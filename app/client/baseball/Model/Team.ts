import { Player } from './Player';
import { Manager } from './Manager';
import { Game } from './Game';

import { data, text } from '../Utility/_utils';

import { fielder_short_name_t } from '../Api/fielderShortName';

class Team {
    public static readonly RUNNERS_DISCRETION = 'runnersDiscretion';
    public static readonly RUNNER_GO = 'go';
    public static readonly RUNNER_HOLD = 'hold';
    public stealAttempt: string = Team.RUNNERS_DISCRETION;
    public lineup: Player[] = [];
    public positions: Record<fielder_short_name_t, Player>;
    public game: Game = (null as unknown) as Game;
    public manager: Manager = new Manager(this);
    public bench: Player[] = [];
    public bullpen: Player[] = [];
    public nowBatting = 0;
    public substituted: Player[] = [];
    public sub: { toString(): string; toValue?(): boolean };
    public expanded: Player = (null as unknown) as Player;

    public name: string = '';
    public nameJ: string = '';

    public noSubstituteSelected = {
        toString() {
            return '';
        },
        toValue() {
            return false;
        }
    };

    constructor(game: Game | 'no init', heroRate: number = 0.1) {
        this.sub = this.noSubstituteSelected;
        this.substituted = [];
        this.pickName();
        this.lineup = [];
        this.bench = [];
        this.bullpen = [];
        this.positions = {
            pitcher: (null as unknown) as Player,
            catcher: (null as unknown) as Player,
            first: (null as unknown) as Player,
            second: (null as unknown) as Player,
            short: (null as unknown) as Player,
            third: (null as unknown) as Player,
            left: (null as unknown) as Player,
            center: (null as unknown) as Player,
            right: (null as unknown) as Player
        };
        if (game !== 'no init') {
            this.game = game;
            for (let j = 0; j < 20; j++) {
                this.bench.push(new Player(this, Math.random() < heroRate));
            }
            if (this.bench.length === 20) {
                this.manager.makeLineup();
            }
        }
    }

    pickName() {
        const teamNameIndex = Math.floor(Math.random() * data.teamNames.length);
        this.name = data.teamNames[teamNameIndex];
        this.nameJ = data.teamNamesJ[teamNameIndex];
    }
    getName() {
        return text.mode === 'n' ? this.nameJ : this.name;
    }
}

export { Team };
