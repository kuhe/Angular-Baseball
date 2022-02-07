import { Field } from './Field';
import { Team } from './Team';
import { Umpire } from './Umpire';
import { Player } from './Player';
import { Log } from '../Utility/Log';

import { helper, text } from '../Utility/_utils';

import { Animator } from '../Services/Animator';
import { Distribution } from '../Services/Distribution';
import { Mathinator } from '../Services/Mathinator';
import { Iterator } from '../Services/Iterator';
import { lang_mode_t } from '../Utility/text';
import { swing_result_t } from '../Api/swingResult';
import { axis_t, pitch_in_flight_t, strike_zone_coordinate_t } from '../Api/pitchInFlight';
import { pitches_t } from '../Api/pitches';
import { degrees_t, ratio_t } from '../Api/math';
import { fielder_short_name_t } from '../Api/fielderShortName';
import { Provider } from '../Teams/Provider';

const $ = typeof window === 'object' ? ((window as unknown) as { $: any }).$ : () => {};
const log = console.log;

/**
 *
 * Apologies for the godclass here.
 *
 */
class Game {
    public field = new Field(this);
    public teams = {
        away: new Team(this),
        home: new Team(this)
    };
    public log = new Log(this);

    /**
     * later initialization is required, not inline.
     */
    public umpire: Umpire;

    public gamesIntoSeason = 72;
    public showMessage = false;
    public debug: any[] = [];

    public pitcher: Player = null;
    public batter: Player = null;
    public batterRunner: Player = null;
    public lastBatter: Player = null;
    public deck: Player = null;
    public hole: Player = null;

    public stage: 'pitch' | 'swing' | 'end' = 'pitch';
    /**
     * websocket opponent is connected
     */
    public opponentConnected = false;
    public batterReadyTimeout = -1;
    /**
     * language sensitive string describing what kind of pitch the batter sees
     */
    public battersEye = {
        e: '',
        n: ''
    };
    public startOpponentPitching: () => void = () => {}; // late bound function.
    public pitchTarget: strike_zone_coordinate_t = { x: 100, y: 100 };
    public pitchInFlight: pitch_in_flight_t = {
        x: 100,
        y: 100,
        breakDirection: [0, 0],
        name: 'slider',
        velocity: 50,
        break: 50,
        control: 50
    };
    public swingResult: swing_result_t = {
        x: 0, //difference to pitch location
        y: 0, //difference to pitch location
        strike: false,
        foul: false,
        caught: false,
        contact: false,
        looking: true,
        bases: 0,
        fielder: 'short',
        outs: 0
    } as swing_result_t;
    public playResult = {
        batter: '',
        fielder: ''
    };
    public half = 'top';
    public inning: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 = 1;
    public scoreboard = {
        away: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        },
        home: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0
        }
    };
    public tally = {
        away: {
            H: 0,
            R: 0,
            E: 0
        },
        home: {
            H: 0,
            R: 0,
            E: 0
        }
    };

    public expectedSwingTiming = 0;
    public helper = helper;

    public startTime = {
        h: (Math.random() * 3 + 13) | 0,
        m: (Math.random() * 60) | 0
    };
    public timeOfDay = {
        h: 12,
        m: 45
    }; // @see {Loop} for time initialization.

    /**
     * Socket service for live head-2-head.
     */
    public opponentService: any = null;

    /**
     * @param m - language mode.
     * @param consoleMode - startup with no UI.
     * @param humanControl - 'home' : play as home team. 'none' : spectate CPU.
     */
    public constructor(
        m: lang_mode_t,
        consoleMode = false,
        public humanControl: 'home' | 'away' | 'both' | 'none' = 'home'
    ) {
        if (consoleMode) {
            this.console = true;
        }
        this.reset();
        if (m) text.mode = m;
        this.gamesIntoSeason = 72 + Math.floor(Math.random() * 72);
        this.log.game = this;
        this.debug = [];
        while (this.teams.away.name === this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.umpire = new Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        }
        this.autoPitchSelect();
        Animator.init();
        this.passMinutes(5);
    }

    public get console(): boolean {
        return Animator.console;
    }

    public set console(value) {
        Animator.console = value;
    }

    /**
     * Advance time and scenery mesh.
     * @param minutes
     */
    public passMinutes(minutes: number): void {
        const time = this.timeOfDay;
        time.m |= 0;
        time.m += minutes | 0;
        while (time.m >= 60) {
            time.m -= 60;
            time.h = ((time.h | 0) + 1) % 24;
        }
        if (!Animator.console) Animator.loop.setTargetTimeOfDay(time.h, time.m);
    }

    /**
     * String description of half and inning.
     */
    public getInning(): string {
        return text.mode === 'n'
            ? this.inning + (this.half === 'top' ? 'オモテ' : 'ウラ')
            : `${this.half.toUpperCase()} ${this.inning}`;
    }

    /**
     * @returns is a human player is batting?
     */
    public humanBatting(): boolean {
        const humanControl = this.humanControl;
        if (humanControl === 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl === 'both' || humanControl === 'away';
            case 'bottom':
                return humanControl === 'both' || humanControl === 'home';
        }
        return false;
    }

    /**
     * @returns whether human player is pitching.
     */
    public humanPitching(): boolean {
        const humanControl = this.humanControl;
        if (humanControl === 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl === 'both' || humanControl === 'home';
            case 'bottom':
                return humanControl === 'both' || humanControl === 'away';
        }
        return false;
    }

    /**
     * ends the game.
     */
    public end(): void {
        this.stage = 'end';
        let e, n;
        e =
            this.tally.home.R > this.tally.away.R
                ? 'Home team wins!'
                : this.tally.home.R === this.tally.away.R
                ? 'You tied. Yes, you can do that.'
                : 'Visitors win!';
        n =
            this.tally.home.R > this.tally.away.R
                ? `${this.teams.home.getName()}の勝利`
                : this.tally.home.R === this.tally.away.R
                ? '引き分け'
                : `${this.teams.away.getName()}の勝利`;
        if (this.tally.home.R > this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.W++;
            this.teams.away.positions.pitcher.stats.pitching.L++;
        } else if (this.tally.home.R < this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.L++;
            this.teams.away.positions.pitcher.stats.pitching.W++;
        }
        this.log.note(e, n);
        this.log.note('Reload to play again', 'リロるは次の試合へ');
    }

    /**
     * advances an AI turn (response to the previous action) by pitching or swinging
     * @param callback
     */
    public simulateInput(callback: (cb?: () => void) => void): void {
        const stage = this.stage,
            pitchTarget = this.pitchTarget;
        if (stage === 'end') {
            return;
        }
        if (stage === 'pitch') {
            this.autoPitch(callback);
        } else if (stage === 'swing') {
            if (typeof pitchTarget != 'object') {
                this.pitchTarget = { x: 100, y: 100 };
            }
            this.autoSwing(this.pitchTarget.x, this.pitchTarget.y, callback);
        }
    }

    /**
     * usually for spectator mode in which the AI plays against itself
     * @param callback
     */
    public simulatePitchAndSwing(callback: (cb?: () => void) => void): void {
        if (this.stage === 'end') {
            return;
        }
        this.autoPitch(callback);
        const giraffe = this;
        setTimeout(
            () => {
                if (typeof giraffe.pitchTarget != 'object') {
                    giraffe.pitchTarget = { x: 100, y: 100 };
                }
                giraffe.autoSwing(
                    giraffe.pitchTarget.x,
                    giraffe.pitchTarget.y,
                    (callback: () => void) => {
                        callback();
                    }
                );
            },
            giraffe.field.hasRunnersOn()
                ? Animator.TIME_FROM_SET + 2500
                : Animator.TIME_FROM_WINDUP + 2500
        );
    }

    /**
     * generically receive click input and decide what to do
     * @param x
     * @param y
     * @param callback
     */
    public receiveInput(x: axis_t, y: axis_t, callback: () => void): void {
        if (this.humanControl === 'none') {
            return;
        }
        if (this.stage === 'end') {
            return;
        }
        if (this.stage === 'pitch' && this.humanPitching()) {
            this.thePitch(x, y, callback);
        } else if (this.stage === 'swing' && this.humanBatting()) {
            this.theSwing(x, y, callback);
        }
    }

    /**
     * select a pitch for the AI.
     * @todo use an out pitch at 2 strikes?
     * @todo use more fastballs against weak batters?
     */
    public autoPitchSelect(): void {
        const pitchNames = Object.keys(this.pitcher.pitching);
        const pitchName = pitchNames[(Math.random() * pitchNames.length) | 0] as pitches_t;
        const pitch = (this.pitcher.pitching[
            pitchName as pitches_t
        ] as unknown) as pitch_in_flight_t;
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    }

    /**
     * delayed pitch
     * @param callback - called after windup finishes animating.
     */
    public windupThen(callback: () => void): void {
        const pitcher = this.pitcher;
        pitcher.windingUp = true;

        if (!Animator.console) {
            $('.baseball').addClass('hide');
            var windup = $('.windup');
            windup.css('width', '100%');
        }
        if (Animator.console) {
            callback();
            pitcher.windingUp = false;
        } else {
            if (!Animator.console) {
                Animator.loop.resetCamera();
            }
            windup.animate(
                { width: 0 },
                this.field.hasRunnersOn() ? Animator.TIME_FROM_SET : Animator.TIME_FROM_WINDUP,
                () => {
                    pitcher.windingUp = false;
                    callback();
                }
            );
        }
    }
    /**
     * AI pitcher winds up and throws
     * @param callback \usually a function to resolve the animations resulting from the pitch
     */
    public autoPitch(callback: () => void): void {
        this.autoPitchSelect();

        const count = this.umpire.count;
        let x: axis_t, y: axis_t, pitch: strike_zone_coordinate_t;
        pitch = Distribution.pitchLocation(count);
        x = pitch.x;
        y = pitch.y;

        this.windupThen(() => {
            !Animator.console && $('.baseball.pitch').removeClass('hide');
            this.thePitch(x, y, callback);
        });
    }

    /**
     * AI batter decides whether to swing
     *
     * The "deceptive" location is the apparent trajectory. If the batter has good eyes, they will see the
     * actual trajectory instead.
     *
     * Hitting the ball, of course, is another matter.
     *
     * @param deceptiveX \the apparent X target of the pitch
     * @param deceptiveY \the apparent Y target of the pitch
     * @param callback
     */
    public autoSwing(
        deceptiveX: axis_t,
        deceptiveY: axis_t,
        callback?: (cb: () => void) => void
    ): void {
        const giraffe = this;
        const bonus = this.batter.eye.bonus || 0;
        const eye =
            this.batter.skill.offense.eye +
            6 * (this.umpire.count.balls + this.umpire.count.strikes) +
            bonus;
        let convergence;
        let convergenceSum;

        // if swinging blindly, aim at the center.
        let x = Distribution.centralizedNumber(),
            y = Distribution.centralizedNumber();
        /**
         * -100 to 100 negative: fooled on pitch, positive: certain of pitch location.
         */
        let certainty = (Math.random() * -100) / ((100 + eye) / 100);

        if (100 * Math.random() < eye) {
            // identified the break, now swinging at the real location.
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
            certainty = (certainty + 200) / 3;
        } else {
            certainty = (certainty - 50) / 2;
        }

        if (100 * Math.random() < eye) {
            // identified the location more precisely, making a larger adjustment.
            convergence = eye / 25;
            convergenceSum = 1 + convergence;
            certainty = (certainty + 300) / 4;
        } else {
            convergence = eye / 100;
            certainty = (certainty - 50) / 2;
            convergenceSum = 1 + convergence;
        }

        x = (deceptiveX * convergence + x) / convergenceSum;
        y = (deceptiveY * convergence + y) / convergenceSum;

        this.swingResult.x = Distribution.cpuSwing(x, this.pitchInFlight.x, eye, true);
        this.swingResult.y = Distribution.cpuSwing(y, this.pitchInFlight.y, eye * 0.75);

        this.batter.lastPitchCertainty = certainty;

        const swingProbability = Distribution.swingLikelihood(eye, x, y, this.umpire, certainty);
        if (100 * Math.random() < swingProbability) {
            (callback || (() => {}))(() => {
                giraffe.theSwing(
                    this.pitchInFlight.x + this.swingResult.x,
                    this.pitchInFlight.y + this.swingResult.y
                );
            });
        } else {
            (callback || (() => {}))(() => {
                giraffe.theSwing(-20, -20);
            });
        }
    }

    /**
     * variable function for what to do when the batter becomes ready for a pitch (overwritten many times)
     */
    public onBatterReady(): void {}

    /**
     * @param setValue true to set ready.
     * @returns whether batter has come ready.
     * trigger batter readiness passively, or actively with setValue, i.e. ready to see pitch
     */
    public batterReady(setValue?: boolean): boolean {
        clearTimeout(this.batterReadyTimeout);
        if (setValue !== undefined) {
            this.batter.ready = Boolean(setValue);
        }
        if (this.batter.ready) {
            this.onBatterReady();
        }
        return this.batter.ready;
    }

    /**
     * May be overwritten.
     */
    public waitingCallback(): void {}

    /**
     * signals readiness for the next pitch. This behavior varies depending on whether AI or human is pitching
     * @param callback
     * @param swingResult
     */
    public awaitPitch(callback: () => void, swingResult?: swing_result_t): void {
        const giraffe = this;
        if (this.opponentConnected) {
            this.waitingCallback = callback;
            this.opponentService.emitSwing(swingResult);
            this.onBatterReady = () => {};
        } else {
            giraffe.onBatterReady = () => {
                giraffe.autoPitch(callback);
            };
            if (Animator.console) {
                giraffe.batterReady();
            } else {
                this.batterReadyTimeout = setTimeout(() => {
                    giraffe.batterReady();
                }, 5200);
            }
        }
    }

    /**
     * Signals readiness for the batter's response to a pitch in flight.
     * In case of a human pitching to AI, the AI batter is automatically ready.
     * @param x
     * @param y
     * @param callback
     * @param pitchInFlight
     * @param pitchTarget
     */
    public awaitSwing(
        x: axis_t,
        y: axis_t,
        callback?: () => void,
        pitchInFlight?: pitch_in_flight_t,
        pitchTarget?: strike_zone_coordinate_t
    ): void {
        if (this.opponentConnected) {
            this.waitingCallback = callback || (() => {});
            this.opponentService.emitPitch({
                inFlight: pitchInFlight,
                target: pitchTarget
            });
        } else {
            this.autoSwing(x, y, callback);
        }
    }
    /**
     * triggers a pitch to aspirational target (x,y) from the current pitcher on the mound.
     * @param x \coordinate X in the strike zone (0, 200)
     * @param y \coordinate Y (0, 200), origin being bottom left.
     * @param callback \typically to resolve animations and move to the next step (batting this pitch)
     * @param override \a websocket opponent will override the engine's pitch location calculations with their actual
     */
    public thePitch(
        x: axis_t,
        y: axis_t,
        callback?: () => void,
        override?: { inFlight: pitch_in_flight_t; target: strike_zone_coordinate_t }
    ) {
        if (override) {
            this.pitchInFlight = override.inFlight;
            this.pitchTarget = override.target;
        }

        const pitch = this.pitchInFlight;

        if (this.stage === 'pitch') {
            if (override) {
                callback = this.waitingCallback;
            } else {
                this.pitcher.fatigue++;
                this.pitchTarget.x = x;
                this.pitchTarget.y = y;

                pitch.breakDirection = this.helper.pitchDefinitions[pitch.name].slice(0, 2) as [
                    axis_t,
                    axis_t
                ];
                this.battersEye = text.getBattersEye(this);

                const control = Math.floor(pitch.control - this.pitcher.fatigue / 2);
                this.pitchTarget.x = Distribution.pitchControl(this.pitchTarget.x, control);
                this.pitchTarget.y = Distribution.pitchControl(this.pitchTarget.y, control);

                if (this.pitcher.throws === 'right') pitch.breakDirection[0] *= -1;

                const breakEffect = Distribution.breakEffect(
                    pitch,
                    this.pitcher,
                    this.pitchTarget.x,
                    this.pitchTarget.y
                );

                pitch.x = breakEffect.x;
                pitch.y = breakEffect.y;
            }

            this.log.notePitch(pitch, this.batter);

            this.stage = 'swing';
            if (this.humanBatting()) {
                (callback || (() => {}))();
            } else {
                if (this.opponentConnected && this.humanPitching()) {
                    this.windupThen(() => {});
                }
                this.awaitSwing(x, y, callback, pitch, this.pitchTarget);
            }
        }
    }
    /**
     * makes an aspirational swing to (x,y) by the current player in the batter's box
     * @param x
     * @param y
     * @param callback \resolves animations
     * @param override - from socket, remote data overrides local simulation.
     */
    public theSwing(x: axis_t, y: axis_t, callback?: () => void, override?: swing_result_t): void {
        const pitch = this.pitchInFlight;
        if (this.stage === 'swing') {
            if (override) {
                var result = (this.swingResult = override);
                callback = this.waitingCallback;
            } else {
                this.swingResult = result = {} as swing_result_t;

                result.timing = this.humanBatting()
                    ? this.expectedSwingTiming - Date.now()
                    : this.batter.getAISwingTiming();
                const inTime = Math.abs(result.timing) < 900;

                const bonus = this.batter.eye.bonus || 0,
                    eye =
                        this.batter.skill.offense.eye +
                        6 * (this.umpire.count.balls + this.umpire.count.strikes) +
                        bonus;

                if (x >= 0 && x <= 200) {
                    this.batter.fatigue++;

                    result.x = x - pitch.x;
                    result.y = y - pitch.y;
                    result.angle = this.setBatAngle();

                    const recalculation = Mathinator.getAngularOffset(result, result.angle);
                    const precision = Distribution.swing(eye);

                    result.x = recalculation.x * precision;
                    result.y = -5 + recalculation.y * precision;

                    result.looking = false;

                    if (Math.abs(result.x) < 60 && Math.abs(result.y) < 35 && inTime) {
                        result.contact = true;
                        this.field.determineSwingContactResult(result);
                        // log(result.flyAngle, Math.floor(result.x), Math.floor(result.y));
                        this.debug.push(result);
                    } else {
                        result.contact = false;
                    }
                } else {
                    result.strike = Distribution.inStrikezone(pitch.x, pitch.y);
                    this.batter.eye.bonus = Math.max(
                        0,
                        eye -
                            Math.sqrt(
                                Math.pow(this.batter.eye.x - pitch.x, 2) +
                                    Math.pow(this.batter.eye.y - pitch.y, 2)
                            ) *
                                1.5
                    );
                    result.contact = false;
                    result.looking = true;
                    this.batter.eye.x = pitch.x;
                    this.batter.eye.y = pitch.y;
                }
            }

            // stealing bases
            const field = this.field;
            const team = this.batter.team;
            if (
                (team.stealAttempt === Team.RUNNER_GO ||
                    team.stealAttempt === Team.RUNNERS_DISCRETION) &&
                !this.opponentConnected
            ) {
                const thief = field.getLeadRunner();
                if (thief instanceof Player) {
                    let base: 2 | 3 | 4 = 2;
                    switch (thief) {
                        case field.first:
                            base = 2;
                            break;
                        case field.second:
                            base = 3;
                            break;
                        case field.third:
                            base = 4;
                    }
                    let validToSteal = true;
                    if (result.looking) {
                        const count = this.umpire.count;
                        if (count.strikes >= 2 && result.strike && count.outs >= 2)
                            validToSteal = false;
                        if (count.balls >= 3 && !result.strike && field.first) validToSteal = false;
                    }
                    if (result.foul || result.caught) {
                        validToSteal = false;
                    }
                    const discretion =
                        team.stealAttempt === 'go' ||
                        Distribution.willSteal(
                            pitch,
                            this.pitcher.team.positions.catcher,
                            thief,
                            base
                        );
                    if (discretion && validToSteal) {
                        thief.attemptSteal(this, base);
                    }
                    team.stealAttempt = Team.RUNNERS_DISCRETION;
                }
            }

            this.log.noteSwing(result);
            this.sounds(result);

            this.stage = 'pitch';

            const half = this.half;
            this.umpire.makeCall();
            let lastPlayOfHalfInning = false;
            if (half !== this.half) {
                callback = this.startOpponentPitching;
                lastPlayOfHalfInning = !override;
            }

            if (typeof callback === 'function') {
                if (this.humanPitching()) {
                    callback();
                    if (lastPlayOfHalfInning) {
                        if (this.opponentService && this.opponentConnected) {
                            this.opponentService.emitSwing(result);
                        }
                    }
                } else {
                    this.awaitPitch(callback, result);
                }
            }
        }
    }

    /**
     * for CSS
     * @param x
     * @param y
     * @returns bat angle
     */
    public setBatAngle(x?: axis_t, y?: axis_t): degrees_t {
        const giraffe = this;
        const pitchInFlight = this.pitchInFlight;
        const swingResult = this.swingResult || { x: 0, y: 0 };
        const origin = {
            x: giraffe.batter.bats === 'right' ? -10 : 210,
            y: 199
        };
        const swing = {
            x: x ? x : pitchInFlight.x + swingResult.x,
            y: y ? y : pitchInFlight.y + swingResult.y
        };
        return Mathinator.battingAngle(origin, swing);
    }

    public debugOut(): void {
        log(
            'slugging',
            this.debug.filter((a) => a.bases == 1).length,
            this.debug.filter((a) => a.bases == 2).length,
            this.debug.filter((a) => a.bases == 3).length,
            this.debug.filter((a) => a.bases == 4).length
        );
        log(
            'grounders',
            this.debug.filter((a) => !a.caught && !a.foul && a.flyAngle < 0).length,
            'thrown out',
            this.debug.filter((a) => !a.caught && !a.foul && a.flyAngle < 0 && a.thrownOut).length
        );
        log(
            'flies/liners',
            this.debug.filter((a) => !a.foul && a.flyAngle > 0).length,
            'caught',
            this.debug.filter((a) => a.caught && a.flyAngle > 0).length
        );

        const PO: Record<string, number> = {};
        this.debug.map((a) => {
            if (!a.fielder) return;
            if (!PO[a.fielder]) {
                PO[a.fielder] = 0;
            }
            if (!a.bases && a.fielder) {
                PO[a.fielder]++;
            }
        });
        log('fielding outs', JSON.stringify(PO));

        const hitters = this.teams.away.lineup.concat(this.teams.home.lineup);
        let atBats: string[] = [];
        hitters.map((a) => {
            atBats = atBats.concat(a.getAtBats().map((ab) => ab.text));
        });

        const LO = atBats.filter((ab) => ab === 'LO').length;
        const FO = atBats.filter((ab) => ab === 'FO').length;
        const GO = atBats.filter((ab) => ab === 'GO').length;
        const GIDP = atBats.filter((ab) => ab === '(IDP)').length;
        const SO = atBats.filter((ab) => ab === 'SO').length;
        const BB = atBats.filter((ab) => ab === 'BB').length;
        const SAC = atBats.filter((ab) => ab === 'SAC').length;
        const FC = atBats.filter((ab) => ab === 'FC').length;
        const CS = atBats.filter((ab) => ab === 'CS').length;
        const SB = atBats.filter((ab) => ab === 'SB').length;

        log(
            'line outs',
            LO,
            'fly outs',
            FO,
            'groundouts',
            GO,
            'strikeouts',
            SO,
            'sacrifices',
            SAC,
            'FC',
            FC,
            'gidp',
            GIDP,
            'CS',
            CS,
            'total',
            LO + FO + GO + SO + SAC + FC + GIDP + CS
        );

        log('BB', BB, 'SB', SB);
        log('fouls', this.debug.filter((a) => a.foul).length);
        log('fatigue, home vs away');
        const teams = this.teams;
        const fatigue = {
            home: {} as Record<fielder_short_name_t, number>,
            away: {} as Record<fielder_short_name_t, number>
        };
        Iterator.each(this.teams.home.positions, (key) => {
            const position = key;
            fatigue.home[position] = teams.home.positions[position].fatigue;
            fatigue.away[position] = teams.away.positions[position].fatigue;
        });
        console.table(fatigue);
        console.table(this.scoreboard);
        console.table(this.tally);
    }

    /**
     * for websocket serialization.
     */
    public toData(): any {
        const data: any = {};
        data.half = this.half;
        data.inning = this.inning;
        data.tally = this.tally;
        const giraffe = this;
        const players = this.teams.away.lineup.concat(this.teams.home.lineup);
        // note: bench not included
        data.field = {
            first: players.indexOf(this.field.first as Player),
            second: players.indexOf(this.field.second as Player),
            third: players.indexOf(this.field.third as Player)
        };
        data.batter = players.indexOf(this.batter);
        data.deck = players.indexOf(this.deck);
        data.hole = players.indexOf(this.hole);
        data.teams = {
            home: {
                name: giraffe.teams.home.name,
                nameJ: giraffe.teams.home.nameJ
            },
            away: {
                name: giraffe.teams.away.name,
                nameJ: giraffe.teams.away.nameJ
            }
        };
        data.umpire = {
            says: giraffe.umpire.says,
            count: {
                strikes: giraffe.umpire.count.strikes,
                balls: giraffe.umpire.count.balls,
                outs: giraffe.umpire.count.outs
            }
        };
        // data.players = players.map(player => player.toData());
        data.log = {
            pitchRecord: giraffe.log.pitchRecord,
            record: giraffe.log.record
        };
        data.gamesIntoSeason = this.gamesIntoSeason;
        return data;
    }

    /**
     * Ingest socket data over matchmaker.
     * @param data
     */
    public fromData(data: Game & any): void {
        this.half = data.half;
        this.inning = data.inning;
        this.tally = data.tally;
        // const giraffe = this;
        const players = data.players || this.teams.away.lineup.concat(this.teams.home.lineup);
        //     .map((playerJson, index) => {
        //     const playerData = (playerJson);
        //     if (index > 8) {
        //         var side = 'home';
        //         index = index - 9;
        //     } else {
        //         side = 'away';
        //     }
        //     const player = giraffe.teams[side].positions[playerData.position];
        //     player.fromData(playerData);
        //     giraffe.teams[side].lineup[index] = player;
        //     player.resetStats(data.gamesIntoSeason);
        //     return player;
        // });
        this.field.first = players[data.field.first];
        this.field.second = players[data.field.second];
        this.field.third = players[data.field.third];
        this.batter = players[data.batter];
        this.deck = players[data.deck];
        this.hole = players[data.hole];
        this.umpire.says = data.umpire.says;
        this.umpire.count = data.umpire.count;
        this.teams.away.name = data.teams.away.name;
        this.teams.away.nameJ = data.teams.away.nameJ;
        this.teams.home.name = data.teams.home.name;
        this.teams.home.nameJ = data.teams.home.nameJ;
        this.log.pitchRecord = data.log.pitchRecord;
        this.log.record = data.log.record;
        this.log.stabilizeShortRecord();
        this.gamesIntoSeason = data.gamesIntoSeason;
        if (this.humanPitching()) {
            this.autoPitchSelect();
        }
    }

    /**
     * Overridden?
     */
    public pitchSelect(): void {}

    /**
     * Reset the game, possibly used in unit tests.
     */
    public reset(): void {
        this.scoreboard = {
            away: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            },
            home: {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0
            }
        };
        this.resetTally();
    }

    /**
     * Reset scores.
     */
    public resetTally(): void {
        this.tally = {
            away: {
                H: 0,
                R: 0,
                E: 0
            },
            home: {
                H: 0,
                R: 0,
                E: 0
            }
        };
    }

    /* user-interaction implementations */

    /**
     * Assign specialist opponent.
     */
    public teamJapan(): void {
        const provider = new Provider();
        provider.assignTeam(this, 'TeamJapan', 'away');
        const game = this;
        if (game.half === 'top') {
            game.batter = game.teams.away.lineup[game.batter.order];
            game.deck = game.teams.away.lineup[(game.batter.order + 1) % 9];
            game.hole = game.teams.away.lineup[(game.batter.order + 2) % 9];
        } else {
            game.pitcher = game.teams.away.positions.pitcher;
        }
    }

    /**
     * @param player - to be selected. Does not activate the sub unless confirmed.
     */
    public selectSubstitute(player: Player) {
        const game = this;
        if (game.humanControl === 'home' && player.team !== game.teams.home) return;
        if (game.humanControl === 'away' && player.team !== game.teams.away) return;
        player.team.sub =
            player.team.sub === player
                ? ((player.team.noSubstituteSelected as unknown) as Player)
                : player;
    }

    /**
     * User selects a pitch.
     * @param pitchName
     */
    public selectPitch(pitchName: pitches_t): void {
        const game = this;
        if (game.stage === 'pitch') {
            game.pitchInFlight = JSON.parse(JSON.stringify(game.pitcher.pitching[pitchName]));
            game.pitchInFlight.name = pitchName;
            game.swingResult.looking = true;
        }
    }

    /**
     * Used for substitutions or player info expansion.
     * @param player
     */
    public clickLineup(player: Player): void | boolean {
        if (player.team.sub !== player.team.noSubstituteSelected) {
            const sub = player.team.sub as Player;
            player.team.sub = null;
            if (sub) {
                return sub.substitute(player);
            }
            return;
        }
        player.team.expanded = ((player.team.expanded === player
            ? null
            : player) as unknown) as Player;
    }

    /**
     * Generate a new opponent team (mid-game).
     * @param heroRate
     */
    public generateTeam(heroRate: ratio_t): void {
        this.teams.away = new Team(this, heroRate);
    }

    /**
     * Bound externally using the UI + Animator service.
     */
    public updateFlightPath(cb?: () => void): void {}

    /**
     * @param SocketService
     * @param quickMode - 7 for playing from the 7th inning.
     * @param spectateCpu - no human player, auto-play.
     */
    public proceedToGame(
        SocketService?: any,
        quickMode?: boolean | number,
        spectateCpu?: boolean | number
    ): void {
        const game = this;
        game.humanControl = spectateCpu ? 'none' : 'home';
        game.console = !!quickMode && quickMode !== 7;
        const field = window.location.hash
            ? window.location.hash.slice(1)
            : game.teams.home.name + Math.ceil(Math.random() * 47);
        if (typeof ((window as unknown) as { SockJS: any }).SockJS !== 'undefined') {
            var socketService = new SocketService(game);
            socketService.start(field);
        } else {
            console.log('no socket client');
        }
        window.location.hash = '#' + field;
        $('.blocking').remove();
        $('.play-begins').show();
        if (game.humanControl === 'none' && game.console) {
            let n = 0;
            Animator.console = true;
            game.console = true;
            do {
                n++;
                game.simulateInput(function(callback?: () => void) {
                    typeof callback === 'function' && callback();
                });
            } while (game.stage !== 'end' && n < 500);
            Animator.console = game.console = false;
            log('sim ended');
            game.debugOut();
        } else if (quickMode === 7 && spectateCpu === 1) {
            Animator.console = game.console = true;
            do {
                game.simulateInput(function(callback?: () => void) {
                    typeof callback === 'function' && callback();
                });
            } while (game.inning < 7);
            log('sim halted in 7th');
            game.debugOut();
            Animator.console = game.console = false;
            game.stage = 'pitch';
            game.half = 'top';
            game.humanControl = 'home';
            game.umpire.onSideChange();
        } else if (game.humanControl === 'none') {
            const scalar = game.console ? 0.05 : 1;
            const auto = setInterval(function() {
                if (game.stage === 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function(callback?: () => void) {
                    game.updateFlightPath(callback);
                });
            }, scalar *
                (game.field.hasRunnersOn()
                    ? Animator.TIME_FROM_SET + 2000
                    : Animator.TIME_FROM_WINDUP + 2000));
        }
        if ((game.humanControl as string) === 'away') {
            game.simulateInput(function(callback) {
                game.updateFlightPath(callback);
            });
        }
        if (game.humanControl === 'home') {
            game.showMessage = true;
        }
        if (!quickMode || quickMode === 7) {
            Animator.loop.setTargetTimeOfDay(game.startTime.h, game.startTime.m);
            game.timeOfDay.h = game.startTime.h;
            game.timeOfDay.m = game.startTime.m;
        }
    }

    /**
     * Proceed to the end of the current at bat.
     */
    public simulateAtBat(): void {
        const game = this;
        Animator.console = game.console = true;
        const batter = game.batter;
        const control = game.humanControl;
        game.humanControl = 'none';
        do {
            game.simulateInput(function(callback) {
                typeof callback === 'function' && callback();
            });
        } while (game.batter === batter && this.stage !== 'end');
        log('-- At Bat Simulated --');
        if (this.stage === 'end') {
            return;
        }
        if (game.humanControl === 'none') {
            game.humanControl = control;
        }
        game.stage = 'pitch';
        Animator.console = game.console = false;
        game.umpire.onSideChange(); // rebind hover UI, not actual change sides :\...
    }

    /**
     * @returns if simulating the at-bat (instantly) is allowed.
     */
    public allowSimAtBat(): boolean {
        if (this.opponentConnected) return false;
        return true;
    }

    private async sounds(result: swing_result_t) {
        if (typeof window !== 'undefined' && window.document) {
            const mitt = [
                document.getElementById('mitt1-sound'),
                document.getElementById('mitt2-sound')
            ][(0.5 + Math.random()) | 0] as HTMLAudioElement;
            const bat = [
                document.getElementById('bat1-sound'),
                document.getElementById('bat2-sound')
            ][(0.5 + Math.random()) | 0] as HTMLAudioElement;

            async function cut(audio: HTMLAudioElement) {
                return new Promise((r) => {
                    setTimeout(async () => {
                        await audio.pause();
                        audio.currentTime = 0;
                        r();
                    }, 1000);
                });
            }

            if (result.flyAngle) {
                await Promise.all([bat.play(), cut(bat)]);
            } else {
                await Promise.all([mitt.play(), cut(mitt)]);
            }
        }
    }
}

export { Game };
