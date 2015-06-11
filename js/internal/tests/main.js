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

Game.prototype.console = true;
Game.prototype.humanControl = 'none';
Game.prototype.quickMode = true;
Animator.console = true;

game = new Game();
var n = 0;
do {
    n++;
    game.simulateInput(function(callback) {
        typeof callback == 'function' && callback();
    });
} while (game.stage != 'end' && n < 3000);
game.debugOut();

//log('last contact result', game.debug[game.debug.length - 1]);