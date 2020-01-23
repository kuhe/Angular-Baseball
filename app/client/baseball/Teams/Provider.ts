import { samurai } from './TeamJapan';
import { Game } from '../Model/Game';

class Provider {
    public teams = {
        TeamJapan: samurai
    };
    public assignTeam(game: Game, team: 'TeamJapan', side: 'home' | 'away'): void {
        const special = this.teams[team];
        special.game = game;
        game.teams[side] = special;
    }
}

export { Provider };
