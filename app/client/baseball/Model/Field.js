import { Player } from '../Model/Player';
import { Distribution } from '../Services/Distribution';
import { Mathinator } from '../Services/Mathinator';
import { Animator } from '../Services/Animator';

/**
 * The baseball field tracks the ball's movement, fielders, and what runners are on
 * @param game
 * @constructor
 */
const Field = function(game) {
    this.init(game);
};

Field.prototype = {
    constructor : Field,
    init(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    /**
     * @returns {boolean}
     */
    hasRunnersOn() {
        return this.first instanceof Player || this.second instanceof Player || this.third instanceof Player;
    },
    /**
     * @param swing
     * @returns {object}
     */
    determineSwingContactResult(swing) {

        if (this.first) this.first.fatigue += 4;
        if (this.second) this.second.fatigue += 4;
        if (this.third) this.third.fatigue += 4;

        const x = swing.x, y = swing.y;
        const game = this.game;
        const eye = game.batter.skill.offense.eye;
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         */
        const angles = Mathinator.getSplayAndFlyAngle(
            x, y, swing.angle, eye,
            swing.timing,
            game.batter.bats === 'left'
        );
        const splayAngle = angles.splay;

        const flyAngle = angles.fly;
        const power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0)/5;
        let landingDistance = Distribution.landingDistance(power, flyAngle, x, y);
        if (flyAngle < 0 && landingDistance > 95) {
            landingDistance = (landingDistance - 95)/4 + 95;
        }

        if (Math.abs(splayAngle) > 50) swing.foul = true;
        swing.fielder = this.findFielder(splayAngle, landingDistance, power, flyAngle);
        if (['first', 'second', 'short', 'third'].includes(swing.fielder)) {
            landingDistance = Math.min(landingDistance, 110); // stopped by infielder
        } else {
            landingDistance = Math.max(landingDistance, 150); // rolled past infielder
        }
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        /**
         * the splay for the result is adjusted to 0 being up the middle and negatives being left field
         * @type {number}
         */
        swing.splay = splayAngle;
        swing.sacrificeAdvances = [];

        if (swing.fielder) {
            const fielder = (game.half === 'top' ? game.teams.home.positions[swing.fielder] : game.teams.away.positions[swing.fielder]);
            const isOutfielder = fielder.position in { left: true, center: true, right: true };
            fielder.fatigue += 4;
            swing.error = false;
            let fieldingEase = fielder.skill.defense.fielding/100;
            const throwingEase = (fielder.skill.defense.throwing/100);
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle + 90, landingDistance]);
            const speedComponent = (1 + Math.sqrt(fielder.skill.defense.speed/100))/2 * 100;
            const interceptRating = speedComponent * 1.8 + flyAngle * 2.4 - swing.fielderTravel*1.55 - 15;
            if (interceptRating > 0 && flyAngle > 4) {
                //caught cleanly?
                if (Distribution.error(fielder)) { //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    fielder.stats.fielding.E++;
                    swing.caught = false;
                } else {
                    fielder.stats.fielding.PO++;
                    swing.caught = true;
                    if (game.umpire.count.outs < 2 && isOutfielder) {
                        const sacrificeThrowInTime = Mathinator.fielderReturnDelay(
                            swing.travelDistance, throwingEase, fieldingEase, 100
                        );
                        // todo ran into outfield assist
                        if (this.first && sacrificeThrowInTime > this.first.getBaseRunningTime() + 4.5) {
                            swing.sacrificeAdvances.push('first');
                        }
                        if (this.second && sacrificeThrowInTime > this.second.getBaseRunningTime()) {
                            swing.sacrificeAdvances.push('second');
                        }
                        if (this.third && sacrificeThrowInTime > this.third.getBaseRunningTime() - 0.5) {
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
                let fieldingReturnDelay = Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, interceptRating);
                swing.fieldingDelay = fieldingReturnDelay;
                swing.outfielder = {'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] === 1;
                const speed = game.batter.skill.offense.speed;
                let baseRunningTime = Mathinator.baseRunningTime(speed);

                if (swing.outfielder) {
                    swing.bases = 1;
                    baseRunningTime *= 1.05;
                    fieldingReturnDelay -= baseRunningTime;

                    while (((fieldingReturnDelay > baseRunningTime && Math.random() < 0.25 + speed/200)
                    || Math.random() < 0.04 + speed/650) && swing.bases < 3) {
                        baseRunningTime *= 0.95;
                        swing.bases++;
                        fieldingReturnDelay -= baseRunningTime;
                    }
                } else {
                    const first = this.first, second = this.second, third = this.third;
                    swing.fieldersChoice = null;
                    swing.bases = fieldingReturnDelay >= baseRunningTime + 1 ? 1 : 0;
                    if (first && fieldingReturnDelay < first.getBaseRunningTime()) swing.fieldersChoice = 'first';
                    if (first && second && fieldingReturnDelay < second.getBaseRunningTime() + 0.6) swing.fieldersChoice = 'second';
                    if (third && fieldingReturnDelay < third.getBaseRunningTime()) swing.fieldersChoice = 'third';
                    // double play
                    let outs = game.umpire.count.outs;
                    if (swing.fieldersChoice) {
                        outs++;
                        swing.bases = 1;
                        const fielders = fielder.team.positions;
                        let force = this.forcePlaySituation();
                        if (force) {
                            const additionalOuts = [];
                            let throwingDelay = fieldingReturnDelay;
                            if (third && force === 'third' &&
                                Mathinator.infieldThrowDelay(fielders.catcher) + throwingDelay < second.getBaseRunningTime() && outs < 3) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.catcher);
                                fielders.catcher.fatigue += 4;
                                additionalOuts.push('second');
                                outs++;
                                force = 'second';
                            }
                            if (second && force === 'second' &&
                                Mathinator.infieldThrowDelay(fielders.third) + throwingDelay < first.getBaseRunningTime() && outs < 3) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.third);
                                fielders.third.fatigue += 4;
                                additionalOuts.push('first');
                                outs++;
                                force = 'first';
                            }
                            if (first && force === 'first' &&
                                Mathinator.infieldThrowDelay(fielders.second) + throwingDelay < game.batter.getBaseRunningTime() && outs < 3) {
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
                                if (additionalOuts.includes('batter')) {
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
                swing.thrownOut = swing.bases == 0;
                if (swing.thrownOut) {
                    fielder.stats.fielding.PO++; // todo A to PO
                    swing.thrownOut = true;
                    swing.error = false;
                }
            }
        } else {
            if (Math.abs(splayAngle) < 45 && landingDistance > 300) {
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
    },
    forcePlaySituation() {
        const first = this.first, second = this.second, third = this.third;
        return (first && second && third) && 'third' || (first && second) && 'second' || first && 'first';
    },
    /**
     * @returns {Player}
     * the best steal candidate.
     */
    getLeadRunner() {
        const first = this.first, second = this.second, third = this.third;
        if (third && first && !second) return first;
        return third || second || first;
    },
    //printRunnerNames : function() {
    //    return [this.first ? this.first.getName() : '', this.second ? this.second.getName() : '', this.third ? this.third.getname() : ''];
    //},
    /**
     * @param splayAngle {Number} 0 to 180, apparently
     * @param landingDistance {Number} in feet, up to 310 or so
     * @param power {Number} 0-100
     * @param flyAngle {Number} roughly -15 to 90
     * @returns {string|boolean}
     */
    findFielder(splayAngle, landingDistance, power, flyAngle) {
        const angle = splayAngle; // 0 is up the middle, clockwise increasing

        let fielder;

        if (Math.abs(angle) > 50) return false; // foul
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 45 && Math.abs(angle) < 5) {
            return 'pitcher';
        }

        let infield = landingDistance < 145 - (Math.abs(angle))/90*50;
        if (flyAngle < 7) { // 7 degrees straight would fly over the infielder, but add some for arc
            let horizontalVelocity = Math.cos(flyAngle/180*Math.PI) * (85 + (power/100) * 10); // mph toward infielder
            if (flyAngle < 0) horizontalVelocity *= 0.5; // velocity loss on bounce
            const fielderLateralReachDegrees = 1 + 22.5 * (100 - horizontalVelocity)/100; // up to 90/4 = 22.5
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else { // first has reduced arc to receive the throw
                fielder = 'first';
            }
            const fielderArcPosition = this.positions[fielder][0] - 90;
            // a good infielder can field a hard hit grounder even with a high terminal distance
            infield = Math.abs(angle - (fielderArcPosition)) < fielderLateralReachDegrees;
        }

        // ball in the air to infielder
        if (infield && landingDistance > 15) {
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else { // first has reduced arc to receive the throw
                fielder = 'first';
            }
        } else if (landingDistance < 310) { // past the infield or fly ball to outfielder
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
    },
    /**
     * approximate fielder positions (polar degrees where 90 is up the middle, distance from origin (home plate))
     */
    positions : {
        pitcher : [90, 66],
        catcher : [0, 0],
        first : [90 + 45 - 7, 98],
        second : [90 + 12.5, 130],
        short : [90 - 12.5, 130],
        third : [90 - 45 + 7, 98],
        left : [45 + 14, 280],
        center : [90, 280],
        right : [135 - 14, 280]
    },
    getPolarDistance(a, b) {
        return Mathinator.getPolarDistance(a, b);
    }
};

export { Field }