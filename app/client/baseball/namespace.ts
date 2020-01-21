import { AtBat } from './Model/AtBat';
import { Field } from './Model/Field';
import { Game } from './Model/Game';
import { Manager } from './Model/Manager';
import { Player } from './Model/Player';
import { Team } from './Model/Team';
import { Umpire } from './Model/Umpire';

import { text, Log } from './Utility/_utils';
import { abbreviatePosition } from './Utility/text';
import { Distribution } from './Services/Distribution';
import { Mathinator } from './Services/Mathinator';
import { Animator } from './Services/Animator';
import { Iterator } from './Services/Iterator';

import { Provider } from './Teams/Provider';
import { samurai } from './Teams/TeamJapan';

const Baseball = {
    Game,
    Player,
    Team,
    Field,
    Manager,
    Umpire,
    model: {
        Game,
        Player,
        Team,
        Field,
        Manager,
        Umpire
    },
    service: {
        Animator,
        Distribution,
        Iterator,
        Mathinator
    },
    util: {
        text: Object.assign(text, { abbreviatePosition }),
        Log
    },
    teams: {
        Provider,
        Japan: samurai
    }
};

export default Baseball;
export { Baseball };

export { Game, Player, Team, AtBat, Field, Manager, Umpire };
export { Animator, Distribution, Iterator, Mathinator };
export { text, abbreviatePosition, Log };
export { Provider };
