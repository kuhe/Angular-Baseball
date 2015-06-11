/**
 * Console Mode!
 */

AtBat = require('../baseball/AtBat.js').AtBat;
Field = require('../baseball/Field.js').Field;
Game = require('../baseball/Game.js').Game;
Manager = require('../baseball/Manager.js').Manager;
Player = require('../baseball/Player.js').Player;
Team = require('../baseball/Team.js').Team;
Umpire = require('../baseball/Umpire.js').Umpire;

Animator = require('../services/Animator.js').Animator;
Distribution = require('../services/Distribution.js').Distribution;
Iterator = require('../services/Iterator.js').Iterator;
Mathinator = require('../services/Mathinator.js').Mathinator;

text = require('../utility/primary/text.js');
mode = text.mode;
text = text.text;

data = require('../utility/data.js').data;
helper = require('../utility/helper.js').helper;
Log = require('../utility/Log.js').Log;

log = function() {
    console.log.apply(console, arguments);
};

stat = function(n) {
    return Math.floor(n*1000)/1000;
};

Game.prototype.console = true;
Game.prototype.humanControl = 'none';
Game.prototype.quickMode = true;
Animator.console = true;

game = new Game();
game.gamesIntoSeason = 144;
p = player = new Player(game.teams.home);
game.teams.home.lineup = [p,p,p,p,p,p,p,p,p];

logPlayer = function() {
    log(
        'PA ' + stat(player.stats.batting.pa),
        'AV ' + stat(player.stats.batting.getBA()),
        'H '  + stat(player.stats.batting.h),
        '2B ' + stat(player.stats.batting['2b']),
        '3B ' + stat(player.stats.batting['3b']),
        'HR ' + stat(player.stats.batting.hr)
    );
};

logPlayer();
var pa = player.stats.batting.pa;
do {
    game.simulateInput(function(callback) {
        typeof callback == 'function' && callback();
    });
    if (game.stage == 'end') {
        game.inning = 1;
        game.half = 'top';
        game.stage = 'pitch';
    }
} while (player.stats.batting.pa < pa * 2);

// game.debugOut();
//log('last contact result', game.debug[game.debug.length - 1]);

logPlayer();
do {
    game.simulateInput(function(callback) {
        typeof callback == 'function' && callback();
    });
    if (game.stage == 'end') {
        game.inning = 1;
        game.half = 'top';
        game.stage = 'pitch';
    }
} while (player.stats.batting.pa < pa * 3);
logPlayer();