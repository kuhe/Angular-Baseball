const Baseball = {};

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

Baseball.model = {};
Baseball.model.Game = Baseball.Game = Game;
Baseball.model.Player = Baseball.Player = Player;
Baseball.model.Team = Baseball.Team = Team;

Baseball.service = {};
Baseball.service.Animator = Animator;
Baseball.service.Distribution = Distribution;
Baseball.service.Iterator = Iterator;
Baseball.service.Mathinator = Mathinator;

Baseball.util = {};
Baseball.util.text = text;
Baseball.util.Log = Log;
Baseball.util.text.abbreviatePosition = abbreviatePosition;

Baseball.teams = {};
Baseball.teams.Provider = Provider;

export default Baseball;
export { Baseball }

export { Game, Player, Team, AtBat, Field, Manager, Umpire }
export { Animator, Distribution, Iterator, Mathinator }
export { text, abbreviatePosition, Log }
export { Provider }
