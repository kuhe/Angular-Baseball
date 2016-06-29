import assert from "assert";
import colors from 'colors';

import { Baseball } from '../baseball';
import { Animator } from '../Services/Animator';
import { Iterator } from '../Services/Iterator';

import { text } from '../Utility/text';
text.mode = 'n';

import { samurai } from '../Teams/TeamJapan';

const seasons = 10;

describe('Game', () => {

    const Game = Baseball.Game;
    const Player = Baseball.Player;
    const Team = Baseball.Team;

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
    Animator.console = true;

    const game = new Game();
    game.gamesIntoSeason = 144;
    let player, p;
    player = new Player(game.teams.home, false);
    //player = samurai.lineup[Math.random() * 9 | 0];
    const asPitcher = Math.random() > 0.96;
    p = player;

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


    const teams = [1,2,3,4,5,6,7].map(() => {
        const team = new Team(game);
        team.wins = 0;
        team.losses = 0;
        team.ties = 0;
        return team;
    });
    let schedule = [];
    const createSchedule = () => {
        for (let i = 0; i < 7; i++) {
            for (let j = i + 1; j < 7; j++) {
                schedule = schedule.concat([
                    {home: i, away: j}
                ]);
            }
        }
    };
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map( _ => createSchedule());
    let scheduleIndex = 0;
    const getTeams = () => ({
        home: teams[schedule[scheduleIndex].home],
        away: teams[schedule[scheduleIndex].away]
    });

    let year = new Date().getFullYear() - seasons;

    logPlayer((++year, 'Rkie'));
    log(asPitcher ? player.skill.pitching : player.skill.offense, player.skill.defense);
    log('------');

    const runSeason = n => {
        game.teams.away = getTeams().away;
        game.teams.home = getTeams().home;
        let x = 15000;
        game.gamesIntoSeason = 0;
        p = player;
        if (asPitcher) {
            game.teams.home.positions.pitcher = p;
            game.teams.away.positions.pitcher = p;
            p.resetStats();
        } else {
            player.resetStats();
            game.teams.home.lineup = [p,p,p,p,p,p,p,p,p];
            game.teams.away.lineup = [p,p,p,p,p,p,p,p,p];
            vary(player);
        }

        let games = 0;
        do {
            game.simulateInput(callback => {
                typeof callback == 'function' && callback();
            });
            if (game.stage == 'end') {

                if (game.tally.away.R > game.tally.home.R) {
                    game.teams.away.wins++;
                    game.teams.home.losses++;
                } else if (game.tally.away.R < game.tally.home.R) {
                    game.teams.home.wins++;
                    game.teams.away.losses++;
                } else {
                    game.teams.home.ties++;
                    game.teams.away.ties++;
                }

                game.teams.away = getTeams().away;
                p.fatigue = 0;
                Iterator.each(game.teams.away.positions, (key, player) => {
                    if (key != 'pitcher' && Math.random() > 0) {
                        game.teams.away.positions[key] = p;
                        game.teams.home.positions[key] = p;
                    }
                });
                game.teams.home = getTeams().home;
                if (asPitcher) {
                    game.teams.home.positions.pitcher = p;
                }
                game.inning = 1;
                game.half = 'top';
                game.stage = 'pitch';
                game.resetTally();
                games++;
                scheduleIndex++
            }
            //if (!asPitcher && game.batter !== player) {
            //    game.umpire.changeSides();
            //}
            if (!asPitcher && player.stats.batting.pa % 6 == 0) {
                game.teams.away.positions.pitcher = new Player(game.teams.away, true);
            }
        } while (games < 144/9 && x--);
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

    log(asPitcher ? player.skill.pitching : player.skill.offense, player.skill.defense);

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
                    `${year}`,
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
                    `${year}`,
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

    const byWins = (a, b) => {
        a = a.wins * 10000 - a.losses * 100 - a.ties;
        b = b.wins * 10000 - b.losses * 100 - b.ties;
        if (a > b) return -1;
        if (b > a) return 1;
        return 0;
    };

    const lpad = (s, len) => {
        if (!len) len = 2;
        s = `${s}`;
        while (s.length < len) {
            s = ` ${s}`;
        }
        return s;
    };

    //game.debugOut();
    it('running times', () => {
        times = times.map((x, k) => times[k] - (times[k-1] || 0));
        times.shift();
        log(`${times.join('ms, ')}ms`);
        const avg = times.reduce((a, b) => a + b)/(seasons - 1) | 0;
        log('average: ', avg, 'ms/year');
        log('');
        teams.sort(byWins);
        teams.map(t => log(`${lpad(t.name, 12)}: ${lpad(t.wins)} - ${lpad(t.losses)} - ${lpad(t.ties)}`));
        log('');
    });
    it('このシーズンで、終わってしまうかもしれない', () => {
        assert(300 < player.stats.batting.ab || 50 < player.stats.pitching.IP[0]);
    });
    it(`    - ${player.getName()} (${player.name})`, () => {
        assert(true);
    });
});