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
    translateSwingResultToStylePosition: function(swingResult) {
        // CF HR bottom: 95px, centerline: left: 190px;
        var bottom = 0, left = 190;

        bottom = Math.cos(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300;
        left = Math.sin(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300 + 190;

        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 280), 100);

        swingResult.bottom = bottom + 'px';
        swingResult.left = left + 'px';
        return swingResult;
    },
    determineSwingContactResult : function(swing) {
        if (typeof swing == 'undefined') swing = this;
        var x = swing.x, y = swing.y;
        var splayAngle = 90 - 1.5*x;
        var flyAngle = -3*y;
        var power = this.game.batter.skill.offense.power;
        var landingDistance = (50 + Math.random()*300 + (power/100)*75) * (1 - Math.abs(flyAngle - 30)/60);

        if (Math.abs(90 - splayAngle) > 50) swing.foul = true;

        swing.fielder = this.findFielder(splayAngle, landingDistance);
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        swing.splay = splayAngle - 90;
        swing.foul = false;

        if (swing.fielder) {
            var fielder = (this.game.half == top ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder]);

            var fieldingEase = fielder.skill.defense.fielding/100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel*1.65;
            if (interceptRating > 0 && flyAngle > -10) {
                //caught cleanly?
                if ((100-fielder.skill.defense)*0.08 > Math.random()) { //error
                    fieldingEase *= 0.5;
                    this.game.tally[this.game.half == 'top' ? 'home' : 'away']['E']++;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                }
            } else {
                swing.caught = false;
            }
            if (!swing.caught) {
                if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] != 1 && (interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase
                       -this.game.batter.skill.offense.speed > -75) {
                    swing.thrownOut = true;
                } else {
                    swing.thrownOut = false;
                    swing.bases = 1;
                    if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] == 1) {
                        var fieldingReturnDelay = -1*((interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase - this.game.batter.skill.offense.speed);
                        log('fielder return delay', fieldingReturnDelay, interceptRating, fielder.skill.defense);
                        while (fieldingReturnDelay - 100 > 0 && swing.bases <= 3) {
                            swing.bases++;
                            fieldingReturnDelay  -= 80;
                        }
                    }
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

        return this.translateSwingResultToStylePosition(swing);
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