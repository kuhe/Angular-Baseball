import { samurai } from './TeamJapan';

class Provider {
    assignTeam(game, team, side) {
        var special = this.teams[team];
        special.game = game;
        game.teams[side] = special;
    }
}

Provider.prototype.teams = {
    TeamJapan: samurai
};

export { Provider }