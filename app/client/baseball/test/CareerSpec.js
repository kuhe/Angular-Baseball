const B = require('./../../baseball-angular/src/public/baseball.bundle');
const Baseball = B.Baseball || B.default || B;

require('colors');

const { Animator, Iterator } = Baseball.service;
const text = Baseball.util.text;
const samurai = Baseball.teams.Japan;

text.mode = 'n';
const seasons = 10;

const Game = Baseball.model.Game;
const Player = Baseball.model.Player;
const Team = Baseball.model.Team;

const log = function() {
    console.log(...arguments);
};

const format = (n, digits) => {
    n = `${Math.floor(n*1000)/1000}`;
    while (n.indexOf('.') > -1 && n.length < 5) n += '0';
    while (n.indexOf('.') === -1 && n.length < 4) n = ` ${n}`;
    return n;
};

Game.prototype.console = true;
Game.prototype.humanControl = 'none';

const game = new Game();
game.gamesIntoSeason = 144;
let player, p;
player = new Player(game.teams.home, false);
//player = samurai.lineup[Math.random() * 9 | 0];
const asPitcher = Math.random() > 0.96;
p = player;

log(`昔話をしてあげましょう。${player.getName()}選手がその伝説の「${player.getDefiningCharacteristic() || '... なんだっけ'}」`);
log('と呼ばれて、10年間も次々の挑戦を向かってきた。');

const TERRIBAD = 5, AWFUL = 25, MEDIOCRE = 45, GOOD = 65, ELITE = 88;

//var offense = {
//    eye: MEDIOCRE,
//    power: ELITE,
//    speed: AWFUL
//};
//var defense = {
//    fielding: ELITE,
//    throwing: GOOD,
//    catching: ELITE,
//    speed: GOOD
//};
const offense = player.skill.offense;
const defense = player.skill.defense;
offense.eye += 10;
offense.power += 10;
offense.speed += 10;
defense.fielding += 10;
defense.throwing += 10;
defense.catching += 10;
defense.speed += 10;
player.skill.defense = defense;
player.skill.offense = offense;
player.resetStats(144);

const vary = player => {
    const stat = ['eye', 'power', 'speed'][Math.random() * 3 | 0];
    const o = player.skill.offense;
    o[stat] -= 6;
    o.eye += 2;
    o.power += 2;
    o.speed += 2;
};

const getStats = player => {
    return {
        pa: format(player.stats.batting.pa),
        ba: format(player.stats.batting.getBA()),
        h: format(player.stats.batting.h),
        '2b': format(player.stats.batting['2b']),
        '3b': format(player.stats.batting['3b']),
        hr: format(player.stats.batting.hr),
        bb: format(player.stats.batting.bb),
        r: format(player.stats.batting.r),
        so: format(player.stats.batting.so),
        sac: format(player.stats.batting.sac),
        rbi: format(player.stats.batting.rbi),
        obp: format(player.stats.batting.getOBP()),
        slg: format(player.stats.batting.getSLG()),
        ops: format(player.stats.batting.getOBP() + player.stats.batting.getSLG()),

        opsp : format(100 * (player.stats.batting.getOBP()/0.310 - 1 + player.stats.batting.getSLG()/0.405) | 0),
        babip : format(player.stats.batting.getBABIP()),

        sb : format(player.stats.batting.sb),
        cs : format(player.stats.batting.cs),

        fp : format(player.stats.fielding.PO / (player.stats.fielding.PO + player.stats.fielding.E)),

        W: format(player.stats.pitching.W),
        L: format(player.stats.pitching.L),
        ERA: format(player.stats.pitching.getERA()),
        IP: (player.stats.pitching.IP.join('.')),
        K: format(player.stats.pitching.K),
        H: format(player.stats.pitching.H),
        BB: format(player.stats.pitching.BB),
        HR: format(player.stats.pitching.HR),
        K9: format(player.stats.pitching.getK9()),
        WHIP: format(player.stats.pitching.getWHIP())
    }
};
const career = {};
const logPlayer = yr => {
    career[yr] = getStats(player);
};

let year = new Date().getFullYear() - seasons;

logPlayer((++year, 'Rkie'));
log(asPitcher ? player.skill.pitching : player.skill.offense, player.skill.defense);

const prepTeams = () => {

    game.teams.home = new Team(game, 0);
    game.teams.away = new Team(game, 0);

    const bench = game.teams.home.bench;

    bench[(Math.random() * bench.length) | 0] = p;
    game.teams.home.manager.makeLineup();

};

prepTeams();

const runSeason = n => {
    let x = 15000;
    game.gamesIntoSeason = 0;
    p = player;
    if (asPitcher) {
        game.teams.home.positions.pitcher = p;
        game.teams.away.positions.pitcher = p;
    } else {
        game.teams.home.lineup = [p,p,p,p,p,p,p,p,p];
        game.teams.away.lineup = [p,p,p,p,p,p,p,p,p];
        vary(player);
    }
    player.resetStats();

    let games = 0;
    do {
        game.simulateInput(callback => {
            typeof callback === 'function' && callback();
        });
        if (game.stage === 'end') {
            Iterator.each(game.teams.away.positions, (key, player) => {
                if (key != 'pitcher' && Math.random() > 0.5) {
                    game.teams.away.positions[key] = p;
                    game.teams.home.positions[key] = p;
                }
            });
            if (asPitcher) {
                game.teams.home.positions.pitcher = p;
            }
            game.inning = 1;
            game.half = 'top';
            game.stage = 'pitch';
            game.resetTally();
            games++;
        }
        if (!asPitcher && player.stats.batting.pa % 6 === 0) {
            p.fatigue = 0;
            game.teams.away.positions.pitcher = new Player(game.teams.away, true);
            game.teams.home.positions.pitcher = new Player(game.teams.home, true);
        }
    } while (games < 144/18 && x--);
    logPlayer(++year);
};

let times = [Date.now()];
runSeason(2);
times.push(Date.now());
runSeason(3);
times.push(Date.now());
runSeason(4);
times.push(Date.now());
runSeason(5);
times.push(Date.now());
runSeason(6);
times.push(Date.now());
runSeason(7);
times.push(Date.now());
runSeason(8);
times.push(Date.now());
runSeason(9);
times.push(Date.now());
runSeason(10);
times.push(Date.now());
//runSeason(10);
//runSeason(11);
//runSeason(12);
//runSeason(13);
//runSeason(14);

(function logCareer() {
    const statLines = {};
    for (var year in career) {
        if (!asPitcher || year != 'Rkie') {
            for (const stat in career[year]) {
                if (typeof statLines[stat] === 'undefined') {
                    statLines[stat] = [];
                }
                statLines[stat].push(career[year][stat]);
            }
        }
    }
    const logHeaders = () => {
        if (asPitcher) {
            log(
                `Year`,
                ' | W   ',
                ' | L   ',
                ' | ERA ',
                ' | IP  ',
                ' | K   ',
                ' | H   ',
                ' | BB  ',
                ' | WHIP ',
                ' | K9  ',
                ' | HR  '
            );
        } else {
            log(
                `Year`,
                ' | PA  ',
                ' | AV   ',
                ' | H/2B/3B/HR      ',
                ' | BB  ',
                ' | R   ',
                ' | K   ',
                ' | SAC ',
                ' | RBI ',
                ' | OBP  ',
                ' | SLG  ',
                ' | OPS  ',
                ' | OPS+',
                ' | BABIP',
                ' | SB  ',
                ' | CS  ',
                ' | F%  '
            );
        }
    };
    const logYear = function(stats) {
        let highest = stat => {
            return stats[stat] == Math.max.apply(this, statLines[stat]) ? stats[stat].toString().green : stats[stat]
        };
        let filter = stat => {
            const s = highest(stat);
            return s == Math.min.apply(this, statLines[stat]) ? s.toString().yellow : s;
        };
        if (asPitcher) {
            log(
                `${year}`,
                ` | ${filter('W')}`,
                ` | ${filter('L')}`,
                ` | ${filter('ERA')}`,
                ` | ${filter('IP')}`,
                ` | ${filter('K')}`,
                ` | ${filter('H')}`,
                ` | ${filter('BB')}`,
                ` | ${filter('WHIP')}`,
                ` | ${filter('K9')}`,
                ` | ${filter('HR')}`
            );
        } else {
            log(
                `${year}`,
                ` | ${filter('pa')}`,
                ` | ${filter('ba')}`,
                ` | ${filter('h')}${filter('2b')}${filter('3b')}${filter('hr')}`,
                ` | ${filter('bb')}`,
                ` | ${filter('r')}`,
                ` | ${filter('so')}`,
                ` | ${filter('sac')}`,
                ` | ${filter('rbi')}`,
                ` | ${filter('obp')}`,
                ` | ${filter('slg')}`,
                ` | ${filter('ops')}`,
                ` | ${filter('opsp')}`,
                ` | ${filter('babip')}`,
                ` | ${filter('sb')}`,
                ` | ${filter('cs')}`,
                ` | ${filter('fp')}`
            );
        }
    };
    logHeaders();
    logYear(career.Rkie);
    for (year in career) {
        if (year != 'Rkie') {
            const stats = career[year];
            logYear(stats);
        }
    }
    const sum = (a, b) => format(parseFloat(a) + parseFloat(b));
    const totals = {};
    Iterator.each(statLines, (k, v) => {
        totals[k] = v.reduce(sum);
    });
    year = 'All ';
    totals.ba = format(totals.ba/seasons);
    totals.obp = format(totals.obp/seasons);
    totals.slg = format(totals.slg/seasons);
    totals.ops = format(totals.ops/seasons);
    totals.opsp = format(totals.opsp/seasons | 0);
    totals.ERA = format(totals.ERA/seasons);
    totals.WHIP = format(totals.WHIP/seasons);
    totals.K9 = format(totals.K9/seasons);
    totals.babip = format(totals.babip/seasons);
    totals.fp = format(totals.fp/seasons);
    log('------');
    logYear(totals);
})();

log(asPitcher ? player.skill.pitching : player.skill.offense, player.skill.defense);

//game.debugOut();
log('running times');

times = times.map((x, k) => times[k] - (times[k-1] || 0));
times.shift();
log(`${times.join('ms, ')}ms`);
const avg = times.reduce((a, b) => a + b)/(seasons - 1) | 0;
log('average: ', avg, 'ms/year');
log('');

log('だがある日に「人は産まれる瞬間から死と言う事に近づいてくわけですから、ひょっとしたらも、このシーズンで、終わってしまうかもしれない」');
log(`    - ${player.getName()}　（${player.name}） (#${player.number} ${player.position} ${player.bats}/${player.throws})`);
log('と語り、すぐあとに引退をした。');
