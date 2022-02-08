import { lang_mode_t, text } from './text';
import { Game } from '../Model/Game';
import { Player } from '../Model/Player';
import { fielder_short_name_t } from '../Api/fielderShortName';
import { pitch_in_flight_t } from '../Api/pitchInFlight';
import { swing_result_t } from '../Api/swingResult';
import { base_name_t } from '../Api/baseName';
import { runner_name_t } from '../Api/runnerName';
import { out_by_t } from '../Api/outBy';
import { multilingual_log_t } from '../Api/log';

class Log {
    public static readonly SINGLE = 'H';
    public static readonly DOUBLE = '2B';
    public static readonly TRIPLE = '3B';
    public static readonly HOMERUN = 'HR';
    public static readonly WALK = 'BB';
    public static readonly GROUNDOUT = 'GO';
    public static readonly FLYOUT = 'FO';
    public static readonly LINEOUT = 'LO';
    public static readonly RUN = 'R';
    public static readonly STRIKEOUT = 'SO';
    public static readonly SACRIFICE = 'SAC';
    public static readonly REACHED_ON_ERROR = 'ROE';
    public static readonly FIELDERS_CHOICE = 'FC';
    public static readonly GIDP = '(IDP)';
    public static readonly GITP = '(ITP)';
    public static readonly STOLEN_BASE = 'SB';
    public static readonly CAUGHT_STEALING = 'CS';

    private lastOuts: number = 0;
    public pointer = 0;
    public stabilized: {
        pitchRecord: multilingual_log_t;
        shortRecord: multilingual_log_t;
    } = {
        pitchRecord: {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        },
        shortRecord: {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        }
    };
    public pitchRecord: multilingual_log_t = {
        e: [],
        n: []
    };
    public shortRecord: multilingual_log_t = {
        e: [],
        n: []
    };
    public record: multilingual_log_t = {
        e: [],
        n: []
    };

    public lastSwing: string = '';
    public lastSwingJ: string = '';

    constructor(public game: Game) {}

    /**
     * Stabilize shortRecord to exactly 6 items, for UI balancing purposes.
     */
    public stabilizeShortRecord(): void {
        const rec = this.record.e.slice(0, 6);
        this.shortRecord.e = rec;
        this.stabilized.shortRecord.e = rec.concat(['', '', '', '', '', '']).slice(0, 6);

        const rec2 = this.record.n.slice(0, 6);
        this.shortRecord.n = rec2;
        this.stabilized.shortRecord.n = rec2.concat(['', '', '', '', '', '']).slice(0, 6);
    }

    /**
     * Add bilingual notes to the record.
     * @param note - English log phrase or note.
     * @param noteJ - Japanese.
     * @param only - only log one language.
     */
    public note(note: string, noteJ: string, only?: lang_mode_t): void {
        //todo fix don't double language when specifying param [only]
        if (only === 'e') {
            this.record.e.unshift(note);
            this.async(() => {
                this.pushConsole(note);
            });
        } else if (only === 'n') {
            this.record.n.unshift(noteJ);
            this.async(() => {
                this.pushConsole(noteJ);
            });
        } else {
            this.record.e.unshift(note);
            this.record.n.unshift(noteJ);
            this.async(() => {
                if (text.mode === 'n') {
                    this.pushConsole(noteJ);
                } else {
                    this.pushConsole(note);
                }
            });
        }
        this.stabilizeShortRecord();
    }

    /**
     * "Now batting..."
     * @param batter - up to bat.
     * @returns e.g. "now batting 1st, right fielder, #51, Ichiro"
     */
    public getBatter(batter: Player): string {
        const orderIndex = batter.team.nowBatting;
        const order = {
            0: text(' 1st'),
            1: text(' 2nd'),
            2: text(' 3rd'),
            3: text(' 4th'),
            4: text(' 5th'),
            5: text(' 6th'),
            6: text(' 7th'),
            7: text(' 8th'),
            8: text(' 9th')
        }[orderIndex as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8];
        return (
            text('Now batting') +
            order +
            text.comma() +
            text.fielderLongName(batter.position as fielder_short_name_t) +
            text.comma() +
            batter.getUniformNumber() +
            text.comma() +
            batter.getName()
        );
    }

    /**
     * Announce a new batter at the plate.
     * @param batter - up to bat.
     */
    public noteBatter(batter: Player): void {
        const m = text.mode;
        let record;
        let recordJ;
        text.mode = 'e';
        record = this.getBatter(batter);
        text.mode = 'n';
        recordJ = this.getBatter(batter);
        text.mode = m;
        this.note(record, recordJ);
    }

    /**
     * Describe an incoming pitch, before it is put in play or caught.
     * Upon being put in play, this log statement is typically amended to say
     * what happened.
     *
     * @param pitchInFlight - from Game.
     * @param batterIsLefty - from Player.
     * @returns e.g. "Curveball, way outside".
     */
    public getPitchLocationDescription(
        pitchInFlight: pitch_in_flight_t,
        batterIsLefty?: boolean
    ): string {
        let x = pitchInFlight.x;
        const y = pitchInFlight.y;
        let say = '';
        let noComma = false,
            noComma2 = false;
        let ball = false;
        if (!batterIsLefty) x = 200 - x;
        if (x < 50) {
            say += text('way outside');
            ball = true;
        } else if (x < 70) {
            say += text('outside');
        } else if (x < 100) {
            say += '';
            noComma = true;
        } else if (x < 130) {
            say += '';
            noComma = true;
        } else if (x < 150) {
            say += text('inside');
        } else {
            say += text('way inside');
            ball = true;
        }
        if (say) say += text.comma();
        if (y < 35) {
            say += text('way low');
            ball = true;
        } else if (y < 65) {
            say += text('low');
        } else if (y < 135) {
            say += '';
            noComma2 = true;
        } else if (y < 165) {
            say += text('high');
        } else {
            say += text('way high');
            ball = true;
        }
        if (noComma || noComma2) {
            say = say.split(text.comma()).join('');
            if (noComma && noComma2) {
                say = text('down the middle');
            }
        }
        // say = (ball ? 'Ball, ' : 'Strike, ') + say;
        say = text.namePitch(pitchInFlight) + text.comma() + say + text.stop();
        return say;
    }

    /**
     * @example
     *  "Curveball, way outside, way low"
     *
     * @param pitchInFlight - from Game.
     * @param batter - a Player.
     */
    public notePitch(pitchInFlight: pitch_in_flight_t, batter: Player): void {
        const m = text.mode;
        let record;
        let recordJ;
        text.mode = 'e';
        record = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.pop();
        text.mode = 'n';
        recordJ = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.pop();
        text.mode = m;
    }

    /**
     * Broadcast inning (optional), strike/ball count.
     * @param justOuts - only announce number of outs, vs an inning change.
     */
    public broadcastCount(justOuts?: boolean): string {
        let outs;
        if (!this.game.umpire) return '';
        const count = this.game.umpire.count;
        if (this.lastOuts === 2 && count.outs === 0) {
            outs = 3 + text(' outs');
        } else {
            outs = count.outs + (count.outs == 1 ? text(' out') : text(' outs'));
        }
        this.lastOuts = count.outs;
        if (justOuts) {
            return outs + text.stop();
        }
        return `${this.game.getInning()}: ${count.strikes}-${count.balls}, ${outs}${text.stop()}`;
    }

    /**
     * @example
     * "Yankees 2, Red Sox 1"
     */
    public broadcastScore(): string {
        return `${this.game.teams.away.getName()} ${
            this.game.tally.away.R
        }, ${this.game.teams.home.getName()} ${this.game.tally.home.R}${text.stop()}`;
    }

    /**
     * @returns e.g. "Runners on first, second".
     */
    public broadcastRunners(): string {
        const field = this.game.field;
        const runners = [
            (field.first && text('first')) || '',
            (field.second && text('second')) || '',
            (field.third && text('third')) || ''
        ].filter((x) => x);

        let runnerCount = 0;
        runners.map((runner) => {
            if (runner) {
                runnerCount++;
            }
        });

        switch (runnerCount) {
            case 0:
                return text('Bases empty') + text.stop();
            case 1:
                return `${text('Runner on')}: ${runners.join(text.comma())}${text.stop()}`;
            default:
                return `${text('Runners on')}: ${runners.join(text.comma())}${text.stop()}`;
        }
    }

    public displayMph(mph: number): string {
        if (!mph) {
            return '';
        }
        if (text.mode === 'e') {
            return `${mph | 0}mph. `;
        }
        return `時速${(1.60934 * mph) | 0}キロ。`;
    }

    /**
     * Note the result of a swingResult (misnomer, also includes not swinging):
     * strike, ball, foul, or in play. Does not know what the fielding result is yet.
     *
     * @param swingResult - from Game.
     */
    public getSwing(swingResult: swing_result_t) {
        let result = '';
        if (swingResult.looking) {
            if (swingResult.strike) {
                result += `<span class="txt-orange">${text('Strike.')}</span>`;
            } else {
                result += `<span class="txt-green">${text('Ball.')}</span>`;
            }
        } else {
            const timing = ['Very late', 'Late', '', 'Early', 'Very Early'][
                Math.max(0, Math.min(4, (((swingResult.timing | 0) + 175) / 70) | 0))
            ];
            if (timing) {
                result += '(' + text(timing) + ')' + text.space();
            }

            if (swingResult.contact) {
                if (swingResult.foul) {
                    result += `<span class="txt-orange">${text('Fouled off.')}</span>`;
                } else {
                    if (swingResult.caught) {
                        result += `<span class="txt-blue">${text('In play.')} ${this.displayMph(
                            swingResult.battedBallSpeed
                        )}</span>`;
                    } else {
                        if (swingResult.thrownOut) {
                            result += `<span class="txt-blue">${text('In play.')} ${this.displayMph(
                                swingResult.battedBallSpeed
                            )}</span>`;
                        } else {
                            result += `<span class="txt-blue">${text('In play.')} ${this.displayMph(
                                swingResult.battedBallSpeed
                            )}</span>`;
                        }
                    }
                }
            } else {
                result += `<span class="txt-orange">${text('Swinging strike.')}</span>`;
            }
        }
        let steal = '';
        const lineup = this.game.batter.team.lineup;
        if (!isNaN(swingResult.stoleABase)) {
            const thief = lineup[swingResult.stoleABase];
            if (thief) {
                steal = this.noteStealAttempt(thief, true, swingResult.attemptedBase);
            }
        }
        if (!isNaN(swingResult.caughtStealing)) {
            const thief = lineup[swingResult.caughtStealing];
            if (thief) {
                steal = this.noteStealAttempt(thief, true, swingResult.attemptedBase);
            }
        }
        if (steal) {
            this.note(steal, steal, text.mode);
        }
        return result + steal;
    }

    /**
     * @see Log#getSwing()
     * @param swingResult - from Game.
     */
    public noteSwing(swingResult: swing_result_t) {
        const m = text.mode;
        let record: string;
        let recordJ: string;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;
        text.mode = 'e';
        record = this.getSwing(swingResult);
        pitchRecord.e[0] += record;
        stabilized.e[0] += record;
        text.mode = 'n';
        recordJ = this.getSwing(swingResult);
        pitchRecord.n[0] += recordJ;
        stabilized.n[0] += recordJ;
        text.mode = m;
        recordJ = stabilized.n[0];
        record = stabilized.e[0];
        const giraffe = this;

        this.lastSwing = record;
        this.lastSwingJ = recordJ;

        record.indexOf('Previous') !== 0 &&
            this.async(() => {
                if (record.indexOf('In play') > -1 && record.indexOf('struck out') > -1) {
                    if (text.mode === 'n') {
                        this.pushConsole(recordJ);
                    } else {
                        this.pushConsole(record);
                    }
                } else {
                    if (text.mode === 'n') {
                        this.pushConsole(giraffe.broadcastCount(), recordJ);
                    } else {
                        this.pushConsole(giraffe.broadcastCount(), record);
                    }
                }
            });
    }

    public pushConsole(...args: string[]) {
        console.log(
            ...args.map((arg) => arg.replace(/<span (class="?([\w-_]+)?"?)?>(.*?)<\/span>/g, '$3'))
        );
    }

    /**
     * Async logging.
     * @param fn
     */
    public async(fn: () => void) {
        if (!(this.game && this.game.console)) {
            setTimeout(fn, 100);
        }
    }

    /**
     * Log a base steal attempt and its result.
     * @param thief - a Player.
     * @param success - whether base was stolen.
     * @param base - which base?
     */
    public noteStealAttempt(thief: Player, success: boolean, base: base_name_t) {
        return `${text.space() +
            thief.getName() +
            text.comma() +
            (success ? text('stolen base') : text('caught stealing')) +
            text.space()}(${text.baseShortName(base)})${text.stop()}`;
    }

    /**
     * Note a bench substitution.
     * @param sub - new Player.
     * @param player - Player leaving the field.
     */
    public noteSubstitution(sub: Player, player: Player): void {
        return this.note(text.substitution(sub, player, 'e'), text.substitution(sub, player, 'n'));
    }

    /**
     * E.g. "Ichiro reached on a single to right".
     * @param game
     */
    public getPlateAppearanceResult(game: Game): string {
        const r = game.swingResult;
        let record = '';
        const batter = game.batter.getName();
        let out: string[] & { doublePlay?: boolean } = [];
        if (r.looking) {
            if (r.strike) {
                record = batter + `<span class="txt-red">${text(' struck out looking.')}</span>`;
            } else {
                record = batter + `<span class="txt-blue">${text(' walked.')}</span>`;
            }
            let steal = '';
            const lineup = this.game.batter.team.lineup;
            if (!isNaN(r.stoleABase)) {
                const thief = lineup[r.stoleABase];
                steal = this.noteStealAttempt(thief, true, r.attemptedBase);
            }
            if (!isNaN(r.caughtStealing)) {
                const thief = lineup[r.caughtStealing];
                steal = this.noteStealAttempt(thief, false, r.attemptedBase);
            }
            record += steal;
        } else {
            if (r.contact) {
                let fielder = r.fielder,
                    bases = r.bases,
                    outBy: out_by_t = false;
                if (r.caught) {
                    if (r.flyAngle < 15) {
                        outBy = 'line';
                    } else {
                        if (['left', 'center', 'right'].indexOf(r.fielder as string) < 0) {
                            outBy = 'pop';
                        } else {
                            outBy = 'fly';
                        }
                    }
                } else {
                    if (r.foul) {
                        // not possible to end PA on foul?
                    } else {
                        if (r.error) {
                            bases = 1;
                            outBy = 'error';
                        } else {
                            if (r.thrownOut) {
                                if (Math.random() < 0.5) {
                                    outBy = 'ground';
                                } else {
                                    outBy = 'thrown';
                                }
                            } else {
                                switch (r.bases) {
                                    case 1:
                                    case 2:
                                    case 3:
                                        bases = r.bases;
                                        break;
                                    case 4:
                                        bases = 4;
                                        if (r.splay < -15) {
                                            fielder = 'left';
                                        } else if (r.splay < 15) {
                                            fielder = 'center';
                                        } else {
                                            fielder = 'right';
                                        }
                                        break;
                                }
                            }
                            if (r.firstOut) {
                                out = out.concat(
                                    r.additionalOuts.filter(
                                        (runner: runner_name_t) => runner !== 'batter'
                                    )
                                );
                                out.doublePlay = r.doublePlay;
                            }
                            if (r.fieldersChoice) {
                                out.push(r.fieldersChoice);
                                if (r.outs == 3) {
                                    outBy = 'ground';
                                } else {
                                    outBy = 'fieldersChoice';
                                }
                            }
                        }
                    }
                }
                record = text.contactResult(
                    batter,
                    fielder as string,
                    bases,
                    outBy,
                    r.outs === 3 ? [] : r.sacrificeAdvances,
                    out
                );
            } else {
                record = batter + `<span class="txt-red">${text(' struck out swinging.')}</span>`;
            }
        }
        return record;
    }

    /**
     * @see #getPlateAppearanceResult()
     * @param game
     */
    public notePlateAppearanceResult(game: Game): void {
        const m = text.mode,
            prevJ = text('Previous: ', 'n'),
            prev = text('Previous: ', 'e');

        let statement;
        const record = this.record;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;

        text.mode = 'e';
        const result = this.getPlateAppearanceResult(game);
        record.e.unshift(result);
        statement = prev + this.lastSwing + text.space() + result;
        pitchRecord.e = [statement];
        stabilized.e = [statement, '', '', '', '', ''];

        text.mode = 'n';
        const resultJ = this.getPlateAppearanceResult(game);
        record.n.unshift(resultJ);
        statement = prevJ + this.lastSwingJ + text.space() + resultJ;
        pitchRecord.n = [statement];
        stabilized.n = [statement, '', '', '', '', ''];

        text.mode = m;
        const giraffe = this;
        this.async(() => {
            if (text.mode === 'n') {
                this.pushConsole(
                    [
                        `%c${resultJ}`,
                        giraffe.broadcastCount(true),
                        giraffe.broadcastScore(),
                        giraffe.broadcastRunners()
                    ].join(' '),
                    'color: darkgreen;'
                );
            } else {
                this.pushConsole(
                    [
                        `%c${result}`,
                        giraffe.broadcastCount(true),
                        giraffe.broadcastScore(),
                        giraffe.broadcastRunners()
                    ].join(' '),
                    'color: darkgreen;'
                );
            }
        });
    }
}

export { Log };
