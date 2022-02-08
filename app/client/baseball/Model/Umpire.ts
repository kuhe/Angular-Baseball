import { Log } from '../Utility/Log';
import { Distribution } from '../Services/Distribution';
import { Game } from './Game';
import { count_t } from '../Api/count';
import { fielder_short_name_t } from '../Api/fielderShortName';
import { on_base_runner_name_t, runner_name_t } from '../Api/runnerName';
import { swing_result_t } from '../Api/swingResult';

/**
 *
 * In this version of baseball, the umpire is always right.
 * @todo make the umpire not always right.
 *
 */
class Umpire {
    /**
     * Three strikes and you're out!
     */
    public count: count_t = {
        strikes: 0,
        balls: 0,
        outs: 0
    };

    /**
     * The latest utterance of the umpire.
     */
    public says: string = 'Play ball!';

    constructor(public game: Game) {
        this.playBall();
    }

    /**
     * Starts the game by announcing it and signalling the first batter up
     */
    public playBall(): void {
        const game = this.game;
        game.half = 'top';
        game.inning = 1;
        game.batter = game.teams.away.lineup[0];
        game.batterRunner = game.teams.away.lineup[0];
        game.deck = game.teams.away.lineup[1];
        game.hole = game.teams.away.lineup[2];
        game.pitcher = game.teams.home.positions.pitcher;
        const n = `一回のオモテ、${game.teams.away.nameJ}の攻撃対${game.teams.home.nameJ}、ピッチャーは${game.teams.home.positions.pitcher.nameJ}。`,
            e = `Top 1, ${game.teams.away.name} offense vs. ${game.teams.home.positions.pitcher.name} starting for ${game.teams.home.name}`;
        game.log.note(e, n);
        game.batter.ready = true;
        game.log.noteBatter(game.batter);
    }

    /**
     * Makes the call based on the last pitch and swing (or no swing)
     * @todo add margin of error to Umpire to simulate real umpiring, haha.
     */
    public makeCall(): void {
        this.says = '';
        const game = this.game;
        const result = game.swingResult;
        const pitcher = game.pitcher;
        const batter = game.batter;
        const field = game.field;

        if (game.swingResult.fielder) {
            var fielder =
                game.teams[game.half === 'top' ? 'home' : 'away'].positions[
                    result.fielder as fielder_short_name_t
                ];
        } else {
            fielder = null;
        }

        game.batterRunner = game.batter;

        if (!isNaN(result.stoleABase as number)) {
            var thief = game.batter.team.lineup[result.stoleABase as number];
            if (thief) {
                thief.atBats.push(Log.STOLEN_BASE);
                switch (thief) {
                    case field.first:
                        field.second = thief;
                        field.first = null;
                        break;
                    case field.second:
                        field.third = thief;
                        field.second = null;
                        break;
                    case field.third:
                        field.third = null;
                        thief.stats.batting.r++;
                        thief.atBats.push(Log.RUN);
                        this.runScores();
                }
                thief.stats.batting.sb++;
            }
        }
        if (!isNaN(result.caughtStealing as number)) {
            game.teams[game.half === 'top' ? 'home' : 'away'].positions['catcher'].stats.fielding
                .PO++;
            this.count.outs++;
            thief = game.batter.team.lineup[result.caughtStealing as number];
            thief.stats.batting.cs++;
            thief.atBats.push(Log.CAUGHT_STEALING);
            switch (thief) {
                case field.first:
                    field.first = null;
                    break;
                case field.second:
                    field.second = null;
                    break;
                case field.third:
                    field.third = null;
            }
            if (this.count.outs >= 3) {
                this.says = 'Three outs, change.';
                this.count.outs = this.count.balls = this.count.strikes = 0;
                pitcher.stats.pitching.IP[0]++;
                pitcher.stats.pitching.IP[1] = 0;
                return this.changeSides();
            }
        }

        pitcher.stats.pitching.pitches++;

        const inStrikezone = Distribution.inStrikezone(game.pitchInFlight.x, game.pitchInFlight.y);

        batter.stats.batting.ps++;

        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            batter.stats.batting.swings++;
            if (inStrikezone) {
                batter.stats.batting.zSwings++;
            } else {
                batter.stats.batting.oSwings++;
            }
            pitcher.stats.pitching.strikes++;
            if (result.contact) {
                game.passMinutes(1);
                if (result.caught) {
                    batter.stats.batting.pa++;
                    pitcher.stats.pitching.IP[1]++;
                    if (result.sacrificeAdvances.length && this.count.outs < 2) {
                        batter.stats.batting.sac++;
                        game.batter.atBats.push(Log.SACRIFICE);
                        this.advanceRunners(false, null, result.sacrificeAdvances);
                    } else {
                        batter.stats.batting.ab++;
                        if (result.flyAngle < 15) {
                            game.batter.atBats.push(Log.LINEOUT);
                            game.batter.stats.batting.fo += 1;
                        } else {
                            game.batter.atBats.push(Log.FLYOUT);
                            game.batter.stats.batting.fo += 1;
                        }
                    }
                    this.count.outs++;
                    fielder.stats.fielding.PO++;
                    this.newBatter();
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.firstOut) {
                            game.field[result.firstOut as 'first' | 'second' | 'third'] = null;
                            result.additionalOuts.map((runner) => {
                                if (runner !== 'batter') {
                                    game.field[runner] = null;
                                }
                            });
                            this.count.outs += result.additionalOuts.length;
                        }
                        if (result.fieldersChoice && this.count.outs < 2) {
                            result.bases = 0;
                            this.count.outs++;
                            fielder.stats.fielding.PO++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(Log.FIELDERS_CHOICE);
                            game.batter.stats.batting.go += 1;
                            this.advanceRunners(false, result.fieldersChoice);
                            result.doublePlay && game.batter.atBats.push(Log.GIDP);
                            this.reachBase();
                            result.outs = this.count.outs as 0 | 1 | 2 | 3;
                            this.newBatter();
                        } else if (result.fieldersChoice) {
                            result.bases = 0;
                            result.thrownOut = true;
                        }
                        if (result.thrownOut) {
                            this.count.outs++;
                            fielder.stats.fielding.PO++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(Log.GROUNDOUT);
                            game.batter.stats.batting.go += 1;
                            result.doublePlay && game.batter.atBats.push(Log.GIDP);
                            if (this.count.outs < 3) {
                                this.advanceRunners(false);
                            }
                            result.outs = this.count.outs as 0 | 1 | 2 | 3;
                            this.newBatter();
                        }
                        if (result.hitByPitch) {
                            batter.stats.batting.ab--;
                        }
                        if (result.bases) {
                            if (!result.error) {
                                game.tally[game.half === 'top' ? 'away' : 'home'][Log.SINGLE]++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    game.tally[game.half === 'top' ? 'home' : 'away'].E++;
                                    fielder.stats.fielding.E++;
                                }
                            }
                            let bases = result.bases;
                            switch (bases) {
                                case 1:
                                    if (result.error) {
                                        game.batter.atBats.push(Log.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.SINGLE);
                                    batter.stats.batting.h++;
                                    break;
                                case 2:
                                    if (result.error) {
                                        game.batter.atBats.push(Log.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.DOUBLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3:
                                    if (result.error) {
                                        game.batter.atBats.push(Log.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.TRIPLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4:
                                    if (result.error) {
                                        game.batter.atBats.push(Log.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.HOMERUN);
                                    pitcher.stats.pitching.HR++;
                                    batter.stats.batting.h++;
                                    batter.stats.batting.hr++;
                                    break;
                            }
                            if (bases > 0 && bases < 4 && !result.error) {
                                if (
                                    !!~['left', 'right', 'center'].indexOf(
                                        result.fielder as fielder_short_name_t
                                    )
                                ) {
                                    batter.recordInfieldHit();
                                }
                            }
                            if (bases >= 1) {
                                this.advanceRunners();
                                this.reachBase();
                                bases -= 1;
                            }
                            while (bases > 0) {
                                bases -= 1;
                                this.advanceRunners();
                            }
                            this.newBatter();
                        }
                    }
                }
            } else {
                this.count.strikes++;
            }
        }

        this.says = `${this.count.balls} and ${this.count.strikes}`;

        result.outs = this.count.outs;

        if (this.count.strikes > 2) {
            batter.stats.batting.pa++;
            batter.stats.batting.ab++;
            batter.stats.batting.so++;
            pitcher.stats.pitching.K++;
            this.count.outs++;
            pitcher.stats.pitching.IP[1]++;
            this.count.balls = this.count.strikes = 0;
            this.says = 'Strike three. Batter out.';
            batter.atBats.push(Log.STRIKEOUT);
            this.newBatter();
        }
        if (this.count.balls > 3) {
            batter.stats.batting.pa++;
            batter.stats.batting.bb++;
            pitcher.stats.pitching.BB++;
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            batter.atBats.push(Log.WALK);
            this.advanceRunners(true)
                .reachBase()
                .newBatter();
        }
        if (this.count.outs > 2) {
            this.says = 'Three outs, change.';
            this.count.outs = this.count.balls = this.count.strikes = 0;
            pitcher.stats.pitching.IP[0]++;
            pitcher.stats.pitching.IP[1] = 0;
            this.changeSides();
        }
    }

    /**
     * awards first base to the batter
     */
    public reachBase(): Umpire {
        const game = this.game;
        game.field.first = game.batter;
        game.field.first.fatigue += 2;
        return this;
    }

    /**
     * advance the runners (ball in play or walk)
     *
     * @param isWalk
     * @param fieldersChoice \results in an out to someone other than the batter
     * @param sacrificeAdvances \advances on a sacrifice
     */
    public advanceRunners(
        isWalk?: boolean,
        fieldersChoice?: runner_name_t,
        sacrificeAdvances?: runner_name_t[]
    ): Umpire {
        isWalk = Boolean(isWalk);
        const game = this.game;
        let first = game.field.first;
        let second = game.field.second;
        let third = game.field.third;
        const swing = game.swingResult;

        if (isWalk) {
            if (first) {
                if (second) {
                    if (third) {
                        //bases loaded
                        game.batter.recordRBI();
                        game.batter.stats.batting.rbi++;
                        third.atBats.push(Log.RUN);
                        third.stats.batting.r++;
                        game.pitcher.stats.pitching.ER++;
                        this.runScores();
                        game.field.third = second;
                        game.field.second = first;
                        first = null;
                    } else {
                        // 1st and second
                        game.field.third = second;
                        game.field.second = first;
                        game.field.first = null;
                    }
                } else {
                    if (third) {
                        // first and third
                        game.field.second = first;
                        game.field.first = null;
                    } else {
                        // first only
                        game.field.second = first;
                        game.field.first = null;
                    }
                }
            } else {
                // no one on first
            }
        } else {
            if (fieldersChoice) {
                game.field[fieldersChoice as on_base_runner_name_t] = null;
                first = game.field.first;
                second = game.field.second;
                third = game.field.third;
            }
            let canAdvance = (position: unknown) => true;
            if (sacrificeAdvances) {
                canAdvance = (position) => {
                    switch (position) {
                        case 'first':
                            return !!~sacrificeAdvances.indexOf('first') && !game.field.second;
                        case 'second':
                            return !!~sacrificeAdvances.indexOf('second') && !game.field.third;
                        case 'third':
                            return !!~sacrificeAdvances.indexOf('third');
                    }
                };
            }
            let arm = 0;
            if (swing.fielder) {
                const fielder = game.pitcher.team.positions[swing.fielder];
                if (!!~['left', 'center', 'right'].indexOf(fielder.position)) {
                    arm = fielder.skill.defense.throwing;
                } else {
                    arm = fielder.skill.defense.throwing + 120; // very rare extra bases on infield BIP
                }
            }
            if (third && canAdvance('third')) {
                // run scored
                this.runScores();
                if (game.batter != third) {
                    game.batter.recordRBI();
                    third.atBats.push(Log.RUN);
                }
                game.batter.stats.batting.rbi++;
                third.stats.batting.r++;
                game.pitcher.stats.pitching.ER++;
                game.field.third = null;
            }
            if (second && canAdvance('second')) {
                game.field.third = second;
                game.field.second = null;
                if (
                    second != game.batter &&
                    !sacrificeAdvances &&
                    Math.random() * (second.skill.offense.speed + 120) > arm + 50
                ) {
                    this.runScores();
                    if (game.batter != second) {
                        game.batter.recordRBI();
                        second.atBats.push(Log.RUN);
                    }
                    game.field.third = null;
                }
            }
            if (first && canAdvance('first')) {
                game.field.second = first;
                game.field.first = null;
                if (
                    first != game.batter &&
                    !game.field.third &&
                    !sacrificeAdvances &&
                    Math.random() * (first.skill.offense.speed + 120) > arm + 60
                ) {
                    game.field.third = first;
                    game.field.second = null;
                }
            }
        }
        return this;
    }

    /**
     * "run scores!"
     */
    public runScores(): void {
        const game = this.game;
        game.scoreboard[game.half === 'top' ? 'away' : 'home'][game.inning]++;
        game.tally[game.half === 'top' ? 'away' : 'home'].R++;
    }

    /**
     * lets the on deck batter into the batter's box.
     */
    public newBatter(): void {
        const game = this.game;
        game.passMinutes(2);
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        this.count.balls = this.count.strikes = 0;
        game.log.notePlateAppearanceResult(game);
        const team = game.half === 'bottom' ? game.teams.home : game.teams.away;
        game.lastBatter = game.batter;
        game.batter = team.lineup[(team.nowBatting + 1) % 9];
        game.batter.ready = !game.humanBatting();
        game.deck = team.lineup[(team.nowBatting + 2) % 9];
        game.hole = team.lineup[(team.nowBatting + 3) % 9];
        team.nowBatting = (team.nowBatting + 1) % 9;
        if (this.count.outs < 3) {
            game.log.noteBatter(game.batter);
        }
        //game.showPlayResultPanels(game.lastBatter);
        if (!game.humanPitching()) {
            game.pitcher.team.manager.checkPitcherFatigue();
        }
    }

    /**
     * 3 outs
     */
    public changeSides(): void {
        const game = this.game;
        game.passMinutes(5);
        game.swingResult = {} as swing_result_t;
        game.swingResult.looking = true; // hide bat
        game.pitchInFlight.x = null; // hide ball
        game.pitchInFlight.y = null; // hide ball
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        let offense: 'home' | 'away', defense: 'home' | 'away';
        game.field.first = null;
        game.field.second = null;
        game.field.third = null;
        if (game.half === 'top') {
            if (game.inning == 9 && game.tally.home.R > game.tally.away.R) {
                return game.end();
            }
            game.half = 'bottom';
        } else {
            if (game.inning + 1 > 9) {
                return game.end();
            }
            game.inning++;
            game.half = 'top';
        }
        offense = game.half === 'top' ? 'away' : 'home';
        defense = game.half === 'top' ? 'home' : 'away';
        const n = `${game.inning}回の${game.half === 'top' ? 'オモテ' : 'ウラ'}、${game.teams[
                game.half === 'top' ? 'away' : 'home'
            ].getName()}の攻撃。`,
            e = `${game.half === 'top' ? 'Top' : 'Bottom'} ${game.inning}`;
        game.log.note(e, n);
        const team = game.teams[offense];
        game.batter = team.lineup[team.nowBatting];
        game.batterRunner = game.batter;
        game.deck = team.lineup[(team.nowBatting + 1) % 9];
        game.hole = team.lineup[(team.nowBatting + 2) % 9];

        game.pitcher = game.teams[defense].positions.pitcher;
        game.log.noteBatter(game.batter);
        game.autoPitchSelect();
        game.field.defense = team.positions;
        this.onSideChange();
    }

    // will be be bound externally
    public onSideChange(): void {}
}

export { Umpire };
