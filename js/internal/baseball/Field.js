/**
 * The baseball field tracks the ball's movement, fielders, and what runners are on
 * @param game
 * @constructor
 */
var Field = function(game) {
    this.init(game);
};

Field.prototype = {
    constructor : Field,
    init : function(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    /**
     * @returns {boolean}
     */
    hasRunnersOn : function() {
        return this.first instanceof Player || this.second instanceof Player || this.third instanceof Player;
    },
    /**
     * @param swing
     * @returns {object}
     */
    determineSwingContactResult : function(swing) {
        var x = swing.x, y = swing.y;
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         * @type {number}
         */
        var splayAngle = 90 - 1.5*x + (swing.angle * y/35);
        var flyAngle = -3*y - (swing.angle * y/35);
        var power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0)/5;
        var landingDistance = Distribution.landingDistance(power, flyAngle);
        if (flyAngle < 0 && landingDistance > 120) {
            landingDistance = (landingDistance - 120)/4 + 120;
        }

        if (Math.abs(90 - splayAngle) > 50) swing.foul = true;
        swing.fielder = this.findFielder(splayAngle, landingDistance);
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        /**
         * the splay for the result is adjusted to 0 being up the middle and negatives being left field
         * @type {number}
         */
        swing.splay = splayAngle - 90;
        swing.sacrificeAdvances = [];

        if (swing.fielder) {
            var fielder = (this.game.half == 'top' ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder]);
            fielder.fatigue += 4;
            swing.error = false;
            var fieldingEase = fielder.skill.defense.fielding/100,
                throwingEase = (fielder.skill.defense.throwing/100);
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel*1.65;
            if (interceptRating > 0 && flyAngle > -10) {
                //caught cleanly?
                if (Distribution.error(fielder)) { //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                    var sacrificeThrowInTime = Mathinator.fielderReturnDelay(
                        swing.travelDistance, throwingEase, fieldingEase, 100
                    );
                    if (this.first && sacrificeThrowInTime > this.first.getBaseRunningTime() + 1.5) {
                        swing.sacrificeAdvances.push('first');
                    }
                    if (this.second && sacrificeThrowInTime > this.second.getBaseRunningTime()) {
                        swing.sacrificeAdvances.push('second');
                    }
                    if (this.third && sacrificeThrowInTime > this.third.getBaseRunningTime() - 0.5) {
                        swing.sacrificeAdvances.push('third');
                    }
                }
            } else {
                swing.caught = false;
            }

            if (!swing.caught) {
                swing.bases = 0;
                swing.thrownOut = false; // default value
                var fieldingReturnDelay = Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, interceptRating);
                swing.fieldingDelay = fieldingReturnDelay;
                swing.outFielder = {'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] == 1;
                var speed = this.game.batter.skill.offense.speed,
                    baseRunningTime = Mathinator.baseRunningTime(speed);

                if (swing.outFielder) {
                    //log('OF', fieldingReturnDelay.toString().slice(0,4), baseRunningTime.toString().slice(0,4));
                    swing.bases = 1;
                    fieldingReturnDelay -= baseRunningTime;
                    var difficulty = 1.8;

                    while (fieldingReturnDelay > baseRunningTime + difficulty && swing.bases < 3) {
                        swing.bases++;
                        difficulty = -1.3;
                        fieldingReturnDelay -= baseRunningTime;
                    }
                } else {
                    //log('-------- IF', fieldingReturnDelay.toString().slice(0,4), baseRunningTime.toString().slice(0,4));
                    swing.fieldersChoice = null;
                    swing.bases = fieldingReturnDelay >= baseRunningTime + 1 ? 1 : 0;
                    if (this.first && fieldingReturnDelay < this.first.getBaseRunningTime()) swing.fieldersChoice = 'first';
                    if (this.second && fieldingReturnDelay < this.second.getBaseRunningTime() + 0.6) swing.fieldersChoice = 'second';
                    if (this.third && fieldingReturnDelay < this.third.getBaseRunningTime()) swing.fieldersChoice = 'third';
                    if (swing.fieldersChoice) swing.bases = 1;
                }
                swing.thrownOut = swing.bases == 0;
                if (swing.thrownOut) {
                    swing.thrownOut = true;
                    swing.error = false;
                }
            }
        } else {
            if (Math.abs(90 - splayAngle) < 45 && landingDistance > 300) {
                swing.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }
        this.game.swingResult = swing;
        return Animator.animateFieldingTrajectory(this.game);
    },
    //printRunnerNames : function() {
    //    return [this.first ? this.first.getName() : '', this.second ? this.second.getName() : '', this.third ? this.third.getname() : ''];
    //},
    /**
     * @param splayAngle
     * @param landingDistance
     * @returns {string|bool}
     */
    findFielder : function(splayAngle, landingDistance) {
        if (Math.abs(90 - splayAngle) > 50) return false;
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 66 && Math.abs(90 - splayAngle) < 5) {
            return 'pitcher';
        }
        if (landingDistance > 20 && landingDistance + (Math.abs(90 - splayAngle))/90*37 < 155) {
            if (splayAngle < 45 + 23) {
                return 'third';
            } else if (splayAngle < 45 + 23 + 23) {
                return 'short';
            } else if (splayAngle < 45 + 23 + 23 + 23) {
                return 'second';
            } else {
                return 'first';
            }
        } else if (landingDistance > 90 && landingDistance < 310) {
            if (splayAngle < 45 + 28) {
                return 'left';
            } else if (splayAngle < 45 + 28 + 34) {
                return 'center';
            } else {
                return 'right';
            }
        } else {
            return false;
        }
    },
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
    getPolarDistance : function(a, b) {
        return Mathinator.getPolarDistance(a, b);
    },
    fieldingTest : function() {
        var angle = Math.random()*90+45;
        var distance = Math.random()*320;
        var fielder = this.findFielder(angle, distance);
        var data = {};
        if (fielder) {
            var fielderCandidates = this.fielderSelectionTest(angle, distance, true);
                data.fielder = fielderCandidates[1];
                data[fielderCandidates[0]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[0]][0], this.positions[fielderCandidates[0]][1]]);
                data[fielderCandidates[1]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[1]][0], this.positions[fielderCandidates[1]][1]]);
            return data;
        }
    },
    aggregateFieldingTest : function() {
        var fielders = {
            pitcher : {tally : 0, distances : []},
            catcher : {tally : 0, distances : []},
            first : {tally : 0, distances : []},
            second : {tally : 0, distances : []},
            short : {tally : 0, distances : []},
            third : {tally : 0, distances : []},
            left : {tally : 0, distances : []},
            center : {tally : 0, distances : []},
            right : {tally : 0, distances : []},
            'false' : {tally : 0, distances : []}
        };
        var selections = [];
        for (var i = 0; i < 1000; i++) {
            var angle = Math.random()*90+45;
            var distance = Math.random()*320;
            var fielder = this.findFielder(angle, distance);
            fielders[fielder].tally++;
            if (fielder) {
                fielders[fielder].distances.push(this.getPolarDistance([angle, distance], [this.positions[fielder][0], this.positions[fielder][1]]));
            }
            selections.push([angle, distance]);
            selections.push(this.fielderSelectionTest(angle, distance, true));
        }
        return [fielders, selections];
    },
    fielderSelectionTest : function(angle, distance, returnFielder) {
        var distances = [];
        var minDistance = 300;
        var giraffe = this;
        var fielder = false;
        Iterator.each(this.positions, function(position, spot) {
            var thisDistance = giraffe.getPolarDistance([angle, distance], spot);
            distances[thisDistance] = position;
            if (minDistance > thisDistance) {
                minDistance = thisDistance;
                fielder = position;
            }
        });
        return returnFielder ? [fielder, this.findFielder(angle, distance)] : distances;
    }
};

exports.Field = Field;