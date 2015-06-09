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
    hasRunnersOn : function() {
        return this.first instanceof Player || this.second instanceof Player || this.third instanceof Player;
    },
    determineSwingContactResult : function(swing) {
        if (typeof swing == 'undefined') swing = this;
        var x = swing.x, y = swing.y;
        var splayAngle = 90 - 1.5*x;
        var flyAngle = -3*y;
        var power = this.game.batter.skill.offense.power + this.game.batter.eye.bonus;
        var landingDistance = (50 + Math.random()*300 + (power/100)*75) * (1 - Math.abs(flyAngle - 30)/60);

        if (Math.abs(90 - splayAngle) > 50) swing.foul = true;

        swing.fielder = this.findFielder(splayAngle, landingDistance);
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        swing.splay = splayAngle - 90;

        if (!this.game.debug) {
            this.game.debug = [];
        }

        var debugData = {}, dd = debugData;

        if (swing.fielder) {
            var fielder = (this.game.half == top ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder]);
            fielder.fatigue += 4;
            swing.error = false;
            var fieldingEase = fielder.skill.defense.fielding/100,
                throwingEase = (fielder.skill.defense.throwing/100);
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel*1.65;
            if (interceptRating > 0 && flyAngle > -10) {
                //caught cleanly?
                if ((100-fielder.skill.defense.fielding)*0.40 + 4 > Math.random()*100) { //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                }
            } else {
                swing.caught = false;
            }
            dd.caught = swing.caught;
            dd.grounder = flyAngle < 0;

            if (!swing.caught) {
                // intercept rating is negative
                var plus = interceptRating + 100*throwingEase*fieldingEase;
                var gatherAndThrowSuccess = plus - this.game.batter.skill.offense.speed/2 > -50;

                //log('flew at angle', flyAngle, 'distance of', swing.fielderTravel,
                //    'gives intercept rating of', interceptRating, 'fielder throw/fielding', fielder.skill.defense.throwing, fielder.skill.defense.fielding,
                //    '+', plus, '-runner speed', this.game.batter.skill.offense.speed,
                //    'success', gatherAndThrowSuccess
                //);

                dd.thrownOut = gatherAndThrowSuccess;
                dd.outFielder = {'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] == 1;

                if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] != 1 && gatherAndThrowSuccess) {
                    swing.thrownOut = true;
                    swing.error = false;
                } else {
                    swing.thrownOut = false;
                    swing.bases = 1;
                    if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] == 1) {
                        var fieldingReturnDelay = -1*(interceptRating + 100*throwingEase*fieldingEase) + this.game.batter.skill.offense.speed;
                        dd.delay = fieldingReturnDelay;
                        while (fieldingReturnDelay - 125 > 0 && swing.bases < 3) {
                            swing.bases++;
                            fieldingReturnDelay  -= 65;
                        }
                        dd.bases = swing.bases;
                    }
                }
                // log('fielder return delay', fieldingReturnDelay, interceptRating, fielder.skill.defense);
            }
        } else {
            if (Math.abs(90 - splayAngle) < 45 && landingDistance > 300) {
                swing.bases = 4;
                dd.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }
        dd.foul = swing.foul;
        this.game.debug.push(dd);

        return Animator.prototype.animateFieldingTrajectory(this.game);
        // return Animator.prototype.translateSwingResultToStylePosition(swing);
    },
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
        return Math.sqrt(a[1]*a[1] + b[1]*b[1] - 2*a[1]*b[1]*Math.cos(a[0]*Math.PI/180 - b[0]*Math.PI/180));
    },
    fieldingTest : function() {
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
        var angle = Math.random()*90+45;
        var distance = Math.random()*320;
        var fielder = this.findFielder(angle, distance);
        var data = {};
        if (fielder) {
            var fielderCandidates = this.fielderSelectionTest(angle, distance, true);
                data.fielder = fielderCandidates[1];
                data[fielderCandidates[0]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[0]][0], this.positions[fielderCandidates[0]][1]]);
                data[fielderCandidates[1]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[1]][0], this.positions[fielderCandidates[1]][1]])
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
        jQ.each(this.positions, function(position, spot) {
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