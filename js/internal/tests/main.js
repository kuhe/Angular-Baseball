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
    n = '' + Math.floor(n*1000)/1000;
    while (n.indexOf('.') > -1 && n.length < 5) n += '0';
    return n;
};

Game.prototype.console = true;
Game.prototype.humanControl = 'none';
Game.prototype.quickMode = true;
Animator.console = true;

game = new Game();
game.gamesIntoSeason = 144;
player = new Player(game.teams.home, false);
p = player;
game.teams.home.lineup = [p,p,p,p,p,p,p,p,p];

//offense = {
//    eye: 65,
//    power: 35,
//    speed: 45
//};
offense = player.skill.offense;
player.skill.offense = offense;

logPlayer = function() {
    log(
        'PA ' + stat(player.stats.batting.pa),
        ' | AV ' + stat(player.stats.batting.getBA()),
        ' | H '  + stat(player.stats.batting.h),
        ' | 2B ' + stat(player.stats.batting['2b']),
        ' | 3B ' + stat(player.stats.batting['3b']),
        ' | HR ' + stat(player.stats.batting.hr),
        ' | BB ' + stat(player.stats.batting.bb),
        ' | K  ' + stat(player.stats.batting.so),
        ' | SAC ' + stat(player.stats.batting.sac),
        ' | RBI ' + stat(player.stats.batting.rbi),
        ' | OBP ' + stat(player.stats.batting.getOBP()),
        ' | SLG ' + stat(player.stats.batting.getSLG()),
        ' | OPS ' + stat(player.stats.batting.getOBP() + player.stats.batting.getSLG())
    );
};

logPlayer();
console.log('------');
var pa = player.stats.batting.pa;

runSeason = function(n) {
    var x = 5000;
    game.gamesIntoSeason = 0;
    player = new Player(game.teams.home, false);
    p = player;
    game.teams.home.lineup = [p,p,p,p,p,p,p,p,p];

    player.skill.offense = offense;

    do {
        game.simulateInput(function(callback) {
            typeof callback == 'function' && callback();
        });
        if (game.stage == 'end') {
            game.teams.away = new Team(game);
            game.inning = 1;
            game.half = 'top';
            game.stage = 'pitch';
        }
        if (player.stats.batting.pa % 10 == 0) {
            game.teams.away.positions.pitcher = new Player(game.teams.away, true);
        }
    } while (player.stats.batting.pa < 704 && x--);
    logPlayer();
    player.skill.offense.eye += 2;
    player.skill.offense.speed -= 2;
    player.skill.offense.power += 2;
};

runSeason(2);
runSeason(3);
runSeason(4);
runSeason(5);
runSeason(6);
runSeason(7);
runSeason(8);
runSeason(9);

log(player.skill.offense, player.fatigue);

//game.debugOut();
//log('last contact result', game.debug[game.debug.length - 1]);