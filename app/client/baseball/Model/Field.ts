import { Player } from './Player';
import { Distribution } from '../Services/Distribution';
import { Mathinator } from '../Services/Mathinator';
import { Animator } from '../Services/Animator';
import { Game } from './Game';
import { swing_result_t } from '../Api/swingResult';
import { polar_coordinate_reversed_t } from '../Api/pitchInFlight';
import { fielder_short_name_t } from '../Api/fielderShortName';
import { degrees_t, feet_t, fly_angle_t } from '../Api/math';
import { player_skill_t } from '../Api/player';
import { on_base_runner_name_t, runner_name_t } from '../Api/runnerName';

/**
 * The baseball field tracks the ball's movement, fielders, and what runners are on.
 */
class Field {
    public first: Player = null;
    public second: Player = null;
    public third: Player = null;

    /**
     * approximate fielder positions (polar degrees where 90 is up the middle, distance from origin (home plate))
     */
    public readonly positions = {
        pitcher: [90, 66],
        catcher: [0, 0],
        first: [90 + 45 - 7, 98],
        second: [90 + 12.5, 130],
        short: [90 - 12.5, 130],
        third: [90 - 45 + 7, 98],
        left: [45 + 14, 280],
        center: [90, 280],
        right: [135 - 14, 280]
    };

    public defense: Record<fielder_short_name_t, Player>;

    constructor(public game: Game) {
        this.game = game;
    }

    /**
     * @returns whether any runner is on base.
     */
    public hasRunnersOn(): boolean {
        return (
            this.first instanceof Player ||
            this.second instanceof Player ||
            this.third instanceof Player
        );
    }

    /**
     * @param swing
     */
    public determineSwingContactResult(swing: swing_result_t): void {
        if (this.first) this.first.fatigue += 4;
        if (this.second) this.second.fatigue += 4;
        if (this.third) this.third.fatigue += 4;

        const x = swing.x,
            y = swing.y;
        const game = this.game;
        const eye = game.batter.skill.offense.eye;
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         */
        const angles = Mathinator.getSplayAndFlyAngle(
            x,
            y,
            swing.angle as number,
            eye,
            swing.timing as number,
            game.batter.bats === 'left'
        );
        const splayAngle = angles.splay;

        const flyAngle = angles.fly;
        const power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0) / 5;
        let travelDistance = Distribution.travelDistance(power, flyAngle, x, y);
        if (flyAngle < 0 && travelDistance > 95) {
            travelDistance = (travelDistance - 95) / 4 + 95;
        }

        if (Math.abs(splayAngle) > 50) swing.foul = true;
        swing.fielder = this.findFielder(splayAngle, travelDistance, power, flyAngle);

        // previous code was here to bracket the distance based on fielder, but
        // that should have been taken into account by #findFielder()

        swing.travelDistance = travelDistance;
        swing.flyAngle = flyAngle;
        /**
         * the splay for the result is adjusted to 0 being up the middle and negatives being left field
         */
        swing.splay = splayAngle;
        swing.sacrificeAdvances = [];

        if (swing.fielder) {
            const fielder =
                game.half === 'top'
                    ? game.teams.home.positions[swing.fielder]
                    : game.teams.away.positions[swing.fielder];
            const isOutfielder = fielder.position in { left: true, center: true, right: true };
            fielder.fatigue += 4;
            swing.error = false;
            let fieldingEase = fielder.skill.defense.fielding / 100;
            const throwingEase = fielder.skill.defense.throwing / 100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(
                this.positions[swing.fielder] as [number, number],
                [splayAngle + 90, travelDistance]
            );
            const speedComponent = ((1 + Math.sqrt(fielder.skill.defense.speed / 100)) / 2) * 100;

            /**
             * This is an important calculation, since it decides
             * whether a ball was caught in the air, or
             * how quickly a fielder reaches a landed ball.
             *
             * Higher is better for the defense.
             */
            const interceptRating =
                speedComponent * 1.8 + flyAngle * 2.4 - swing.fielderTravel * 3.35 - 25;

            if (interceptRating > 0 && flyAngle > 10) {
                //caught cleanly?
                if (Distribution.error(fielder)) {
                    //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    fielder.stats.fielding.E++;
                    swing.caught = false;
                } else {
                    fielder.stats.fielding.PO++;
                    swing.caught = true;
                    if (game.umpire.count.outs < 2 && isOutfielder) {
                        const sacrificeThrowInTime = Mathinator.fielderReturnDelay(
                            swing.travelDistance,
                            throwingEase,
                            fieldingEase,
                            100
                        );
                        // todo ran into outfield assist
                        if (
                            this.first &&
                            sacrificeThrowInTime > this.first.getBaseRunningTime() + 4.5
                        ) {
                            swing.sacrificeAdvances.push('first');
                        }
                        if (
                            this.second &&
                            sacrificeThrowInTime > this.second.getBaseRunningTime()
                        ) {
                            swing.sacrificeAdvances.push('second');
                        }
                        if (
                            this.third &&
                            sacrificeThrowInTime > this.third.getBaseRunningTime() - 0.5
                        ) {
                            swing.sacrificeAdvances.push('third');
                        }
                    }
                }
            } else {
                swing.caught = false;
            }

            if (!swing.caught) {
                swing.bases = 0;
                swing.thrownOut = false; // default value
                let fieldingReturnDelay = Mathinator.fielderReturnDelay(
                    swing.travelDistance,
                    throwingEase,
                    fieldingEase,
                    interceptRating
                );
                swing.fieldingDelay = fieldingReturnDelay;
                swing.outfielder =
                    (swing.fielder as fielder_short_name_t) in { left: 1, center: 1, right: 1 };
                const speed = game.batter.skill.offense.speed;
                let baseRunningTime = Mathinator.baseRunningTime(speed);

                if (swing.outfielder) {
                    swing.bases = 1;
                    baseRunningTime *= 1.05;
                    fieldingReturnDelay -= baseRunningTime;

                    while (
                        ((fieldingReturnDelay > baseRunningTime &&
                            Math.random() < 0.25 + speed / 200) ||
                            Math.random() < 0.04 + speed / 650) &&
                        swing.bases < 3
                    ) {
                        baseRunningTime *= 0.95;
                        swing.bases++;
                        fieldingReturnDelay -= baseRunningTime;
                    }
                } else {
                    const first = this.first,
                        second = this.second,
                        third = this.third;
                    swing.fieldersChoice = null;
                    swing.bases = fieldingReturnDelay >= baseRunningTime ? 1 : 0;
                    if (first && fieldingReturnDelay < first.getBaseRunningTime())
                        swing.fieldersChoice = 'first';
                    if (first && second && fieldingReturnDelay < second.getBaseRunningTime() + 0.6)
                        swing.fieldersChoice = 'second';
                    if (third && fieldingReturnDelay < third.getBaseRunningTime())
                        swing.fieldersChoice = 'third';
                    // double play
                    let outs = game.umpire.count.outs;
                    if (swing.fieldersChoice) {
                        outs++;
                        swing.bases = 1;
                        const fielders = fielder.team.positions;
                        let force = this.forcePlaySituation();
                        if (force) {
                            const additionalOuts: runner_name_t[] = [];
                            let throwingDelay = fieldingReturnDelay;
                            if (
                                third &&
                                second &&
                                force === 'third' &&
                                Mathinator.infieldThrowDelay(fielders.catcher) + throwingDelay <
                                    second.getBaseRunningTime() &&
                                outs < 3
                            ) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.catcher);
                                fielders.catcher.fatigue += 4;
                                additionalOuts.push('second');
                                outs++;
                                force = 'second';
                            }
                            if (
                                second &&
                                first &&
                                force === 'second' &&
                                Mathinator.infieldThrowDelay(fielders.third) + throwingDelay <
                                    first.getBaseRunningTime() &&
                                outs < 3
                            ) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.third);
                                fielders.third.fatigue += 4;
                                additionalOuts.push('first');
                                outs++;
                                force = 'first';
                            }
                            if (
                                first &&
                                force === 'first' &&
                                Mathinator.infieldThrowDelay(fielders.second) + throwingDelay <
                                    game.batter.getBaseRunningTime() &&
                                outs < 3
                            ) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.second);
                                fielders.second.fatigue += 4;
                                additionalOuts.push('batter');
                                swing.bases = 0;
                                // todo (or shortstop)
                                outs++;
                            }
                            if (outs - game.umpire.count.outs === 2) {
                                swing.doublePlay = true;
                            }
                            if (additionalOuts.length) {
                                swing.additionalOuts = additionalOuts;
                                swing.firstOut = swing.fieldersChoice;
                                if (~additionalOuts.indexOf('batter')) {
                                    delete swing.fieldersChoice;
                                }
                            }
                        }
                        //console.log('DP?', !!this.forcePlaySituation(), 'throwingDelay', throwingDelay,
                        //    'fielding delay', fieldingReturnDelay, 'runner', game.batter.getBaseRunningTime());
                        //if (typeof additionalOuts !== 'undefined' && additionalOuts.length) {
                        //    console.log('omg dp', additionalOuts);
                        //}
                    } else {
                        delete swing.additionalOuts;
                        delete swing.firstOut;
                        delete swing.doublePlay;
                        delete swing.fieldersChoice;
                    }
                }
                swing.thrownOut = swing.bases === 0;
                if (swing.thrownOut) {
                    fielder.stats.fielding.PO++; // todo A to PO
                    swing.thrownOut = true;
                    swing.error = false;
                }
            }
        } else {
            if (Math.abs(splayAngle) < 45 && travelDistance > 300) {
                swing.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }
        this.game.swingResult = swing;
        if (!Animator.console) {
            Animator._ball.hasIndicator = true;
            Animator.animateFieldingTrajectory(this.game);
        }
    }

    public forcePlaySituation(): false | on_base_runner_name_t {
        const first = this.first,
            second = this.second,
            third = this.third;
        return (
            (first && second && third && 'third') ||
            (first && second && 'second') ||
            (first && 'first') ||
            false
        );
    }

    /**
     * @returns the best steal candidate.
     */
    public getLeadRunner(): Player {
        const first = this.first,
            second = this.second,
            third = this.third;
        if (third && first && !second) return first;
        return third || second || first;
    }

    //printRunnerNames : function() {
    //    return [this.first ? this.first.getName() : '', this.second ? this.second.getName() : '', this.third ? this.third.getname() : ''];
    //}

    /**
     * @param splayAngle - -45 to 45.
     * @param travelDistance - in feet, up to 310 or so
     * @param power - 0-100
     * @param flyAngle - roughly -15 to 90
     * @returns fielder covering the play.
     */
    public findFielder(
        splayAngle: degrees_t,
        travelDistance: feet_t,
        power: player_skill_t,
        flyAngle: fly_angle_t
    ): fielder_short_name_t | false {
        const angle = splayAngle; // 0 is up the middle, clockwise increasing

        let fielder: fielder_short_name_t | false;

        if (Math.abs(angle) > 50) return false; // foul
        if (travelDistance < 10 && travelDistance > -20) {
            return 'catcher';
        } else if (travelDistance >= 10 && travelDistance < 45 && angle < 5) {
            return 'pitcher';
        }

        let infield = travelDistance < 145 - (Math.abs(angle) / 90) * 50;
        if (flyAngle < 7) {
            // 7 degrees straight would fly over the infielder, but add some for arc
            let horizontalVelocity =
                Math.cos((flyAngle / 180) * Math.PI) * (85 + (power / 100) * 10); // mph toward infielder
            if (flyAngle < 0) horizontalVelocity *= 0.5; // velocity loss on bounce
            const fielderLateralReachDegrees = 1 + (22.5 * (100 - horizontalVelocity)) / 100; // up to 90/4 = 22.5
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else {
                // first has reduced arc to receive the throw
                fielder = 'first';
            }
            const fielderArcPosition = this.positions[fielder][0] - 90;
            // a good infielder can field a hard hit grounder even with a high terminal distance
            infield = infield || Math.abs(angle - fielderArcPosition) < fielderLateralReachDegrees;
        }

        if (infield) {
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else {
                // first has reduced arc to receive the throw
                fielder = 'first';
            }
        } else if (travelDistance < 310) {
            // past the infield or fly ball to outfielder
            if (angle < -15) {
                fielder = 'left';
            } else if (angle < 16) {
                fielder = 'center';
            } else {
                fielder = 'right';
            }
        } else {
            fielder = false;
        }
        return fielder;
    }

    public getPolarDistance(
        a: polar_coordinate_reversed_t,
        b: polar_coordinate_reversed_t
    ): number {
        return Mathinator.getPolarDistance(a, b);
    }
}

export { Field };
