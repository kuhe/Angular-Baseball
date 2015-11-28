(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _baseballUtilityLog = require('baseball/Utility/Log');

var AtBat = (function () {
    function AtBat(text) {
        _classCallCheck(this, AtBat);

        this.infield = text.indexOf(AtBat.prototype.INFIELD_HIT_INDICATOR) > -1 ? AtBat.prototype.INFIELD_HIT_INDICATOR : '';
        text = text.replace(AtBat.prototype.INFIELD_HIT_INDICATOR, '');
        this.text = text.split(AtBat.prototype.RBI_INDICATOR)[0];
        this.rbi = text.split(this.text)[1] + '';

        var log = new _baseballUtilityLog.Log();

        var beneficial = [log.WALK, log.SINGLE, log.HOMERUN, log.DOUBLE, log.TRIPLE, log.SACRIFICE, log.REACHED_ON_ERROR];
        if (beneficial.indexOf(this.text) > -1) {
            this.beneficial = true;
        }
    }

    _createClass(AtBat, [{
        key: 'toString',
        value: function toString() {
            return '' + this.infield + this.text + this.rbi;
        }
    }]);

    return AtBat;
})();

AtBat.prototype.constructor = AtBat;
AtBat.prototype.identifier = 'AtBat';
AtBat.prototype.INFIELD_HIT_INDICATOR = '';
AtBat.prototype.RBI_INDICATOR = '+';

exports.AtBat = AtBat;

},{"baseball/Utility/Log":29}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballModelPlayer = require('baseball/Model/Player');

var _baseballServices_services = require('baseball/Services/_services');

/**
 * The baseball field tracks the ball's movement, fielders, and what runners are on
 * @param game
 * @constructor
 */
var Field = function Field(game) {
    this.init(game);
};

Field.prototype = {
    constructor: Field,
    init: function init(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    /**
     * @returns {boolean}
     */
    hasRunnersOn: function hasRunnersOn() {
        return this.first instanceof _baseballModelPlayer.Player || this.second instanceof _baseballModelPlayer.Player || this.third instanceof _baseballModelPlayer.Player;
    },
    /**
     * @param swing
     * @returns {object}
     */
    determineSwingContactResult: function determineSwingContactResult(swing) {
        var x = swing.x,
            y = swing.y;
        var eye = this.game.batter.skill.offense.eye;
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         */
        var angles = _baseballServices_services.Mathinator.getSplayAndFlyAngle(x, y, swing.angle, eye);
        var splayAngle = angles.splay;

        var flyAngle = angles.fly;
        var power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0) / 5;
        var landingDistance = _baseballServices_services.Distribution.landingDistance(power, flyAngle);
        if (flyAngle < 0 && landingDistance > 95) {
            landingDistance = (landingDistance - 95) / 4 + 95;
        }
        var game = this.game;

        if (Math.abs(splayAngle) > 50) swing.foul = true;
        swing.fielder = this.findFielder(splayAngle, landingDistance, power, flyAngle);
        if (['first', 'second', 'short', 'third'].indexOf(swing.fielder) > -1) {
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
            var fielder = game.half == 'top' ? game.teams.home.positions[swing.fielder] : game.teams.away.positions[swing.fielder];
            fielder.fatigue += 4;
            swing.error = false;
            var fieldingEase = fielder.skill.defense.fielding / 100,
                throwingEase = fielder.skill.defense.throwing / 100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle + 90, landingDistance]);
            var interceptRating = fielder.skill.defense.speed * 1.8 + flyAngle * 2.4 - swing.fielderTravel * 1.55 - 15;
            if (interceptRating > 0 && flyAngle > 4) {
                //caught cleanly?
                if (_baseballServices_services.Distribution.error(fielder)) {
                    //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                    if (game.umpire.count.outs < 2) {
                        var sacrificeThrowInTime = _baseballServices_services.Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, 100);
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
                var fieldingReturnDelay = _baseballServices_services.Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, interceptRating);
                swing.fieldingDelay = fieldingReturnDelay;
                swing.outfielder = ({ 'left': 1, 'center': 1, 'right': 1 })[swing.fielder] == 1;
                var speed = game.batter.skill.offense.speed,
                    baseRunningTime = _baseballServices_services.Mathinator.baseRunningTime(speed);

                if (swing.outfielder) {
                    swing.bases = 1;
                    baseRunningTime *= 0.95;
                    fieldingReturnDelay -= baseRunningTime;
                    eye = game.batter.skill.offense.eye / 400;

                    while (fieldingReturnDelay > baseRunningTime && swing.bases < 3 && Math.random() < 0.25 + eye) {
                        baseRunningTime *= 0.95;
                        swing.bases++;
                        fieldingReturnDelay -= baseRunningTime;
                    }
                } else {
                    var first = this.first,
                        second = this.second,
                        third = this.third;
                    swing.fieldersChoice = null;
                    swing.bases = fieldingReturnDelay >= baseRunningTime + 1 ? 1 : 0;
                    if (first && fieldingReturnDelay < first.getBaseRunningTime()) swing.fieldersChoice = 'first';
                    if (first && second && fieldingReturnDelay < second.getBaseRunningTime() + 0.6) swing.fieldersChoice = 'second';
                    if (third && fieldingReturnDelay < third.getBaseRunningTime()) swing.fieldersChoice = 'third';
                    // double play
                    var outs = game.umpire.count.outs;
                    if (swing.fieldersChoice) {
                        outs++;
                        swing.bases = 1;
                        var fielders = fielder.team.positions;
                        var force = this.forcePlaySituation();
                        if (force) {
                            var additionalOuts = [];
                            var throwingDelay = fieldingReturnDelay;
                            if (third && force === 'third' && _baseballServices_services.Mathinator.infieldThrowDelay(fielders.catcher) + throwingDelay < second.getBaseRunningTime() && outs < 3) {
                                throwingDelay += _baseballServices_services.Mathinator.infieldThrowDelay(fielders.catcher);
                                fielders.catcher.fatigue += 4;
                                additionalOuts.push('second');
                                outs++;
                                force = 'second';
                            }
                            if (second && force === 'second' && _baseballServices_services.Mathinator.infieldThrowDelay(fielders.third) + throwingDelay < first.getBaseRunningTime() && outs < 3) {
                                throwingDelay += _baseballServices_services.Mathinator.infieldThrowDelay(fielders.third);
                                fielders.third.fatigue += 4;
                                additionalOuts.push('first');
                                outs++;
                                force = 'first';
                            }
                            if (first && force === 'first' && _baseballServices_services.Mathinator.infieldThrowDelay(fielders.second) + throwingDelay < game.batter.getBaseRunningTime() && outs < 3) {
                                throwingDelay += _baseballServices_services.Mathinator.infieldThrowDelay(fielders.second);
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
                                if (additionalOuts.indexOf('batter') > -1) {
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
        if (!_baseballServices_services.Animator.console) {
            _baseballServices_services.Animator._ball.hasIndicator = true;
            _baseballServices_services.Animator.animateFieldingTrajectory(this.game);
        }
    },
    forcePlaySituation: function forcePlaySituation() {
        var first = this.first,
            second = this.second,
            third = this.third;
        return first && second && third && 'third' || first && second && 'second' || first && 'first';
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
    findFielder: function findFielder(splayAngle, landingDistance, power, flyAngle) {
        var angle = splayAngle; // 0 is up the middle, clockwise increasing

        var fielder;

        if (Math.abs(angle) > 50) return false; // foul
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 45 && Math.abs(angle) < 5) {
            return 'pitcher';
        }

        var infield = landingDistance < 145 - Math.abs(angle) / 90 * 50;
        if (flyAngle < 7) {
            // 7 degrees straight would fly over the infielder, but add some for arc
            var horizontalVelocity = Math.cos(flyAngle / 180 * Math.PI) * (85 + power / 100 * 10); // mph toward infielder
            if (flyAngle < 0) horizontalVelocity *= 0.5; // velocity loss on bounce
            var fielderLateralReachDegrees = 1 + 22.5 * (100 - horizontalVelocity) / 100; // up to 90/4 = 22.5
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
            var fielderArcPosition = this.positions[fielder][0] - 90;
            // a good infielder can field a hard hit grounder even with a high terminal distance
            infield = Math.abs(angle - fielderArcPosition) < fielderLateralReachDegrees;
        }

        // ball in the air to infielder
        if (infield && landingDistance > 15) {
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
        } else if (landingDistance < 310) {
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
    },
    positions: {
        pitcher: [90, 66],
        catcher: [0, 0],
        first: [90 + 45 - 7, 98],
        second: [90 + 12.5, 130],
        short: [90 - 12.5, 130],
        third: [90 - 45 + 7, 98],
        left: [45 + 14, 280],
        center: [90, 280],
        right: [135 - 14, 280]
    },
    getPolarDistance: function getPolarDistance(a, b) {
        return _baseballServices_services.Mathinator.getPolarDistance(a, b);
    },
    fieldingTest: function fieldingTest() {
        var angle = Math.random() * 90 + 45;
        var distance = Math.random() * 320;
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
    aggregateFieldingTest: function aggregateFieldingTest() {
        var fielders = {
            pitcher: { tally: 0, distances: [] },
            catcher: { tally: 0, distances: [] },
            first: { tally: 0, distances: [] },
            second: { tally: 0, distances: [] },
            short: { tally: 0, distances: [] },
            third: { tally: 0, distances: [] },
            left: { tally: 0, distances: [] },
            center: { tally: 0, distances: [] },
            right: { tally: 0, distances: [] },
            'false': { tally: 0, distances: [] }
        };
        var selections = [];
        for (var i = 0; i < 1000; i++) {
            var angle = Math.random() * 90 + 45;
            var distance = Math.random() * 320;
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
    fielderSelectionTest: function fielderSelectionTest(angle, distance, returnFielder) {
        var distances = [];
        var minDistance = 300;
        var giraffe = this;
        var fielder = false;
        Iterator.each(this.positions, function (position, spot) {
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

},{"baseball/Model/Player":5,"baseball/Services/_services":25}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballModelField = require('baseball/Model/Field');

var _baseballModelTeam = require('baseball/Model/Team');

var _baseballModelUmpire = require('baseball/Model/Umpire');

var _baseballUtilityLog = require('baseball/Utility/Log');

var _baseballUtility_utils = require('baseball/Utility/_utils');

var _baseballServices_services = require('baseball/Services/_services');

var Game = function Game(m) {
    this.init(m);
};

Game.prototype = {
    constructor: Game,
    gamesIntoSeason: 0,
    humanControl: 'home', //home, away, both, none
    console: false,
    quickMode: true,
    debug: [],
    pitcher: {}, // Player&
    batter: {}, // Player&
    init: function init(m) {
        this.startTime = {
            h: ('00' + (Math.random() * 8 + 10 | 0)).slice(-2),
            m: ('00' + (Math.random() * 60 | 0)).slice(-2)
        };
        this.timeOfDay = {
            h: this.startTime.h,
            m: this.startTime.m
        };
        if (m) _baseballUtility_utils.text.mode = m;
        this.gamesIntoSeason = 1 + Math.floor(Math.random() * 142);
        this.field = new _baseballModelField.Field(this);
        this.teams.away = new _baseballModelTeam.Team(this);
        this.teams.home = new _baseballModelTeam.Team(this);
        this.log = new _baseballUtilityLog.Log();
        this.log.game = this;
        this.debug = [];
        this.helper = _baseballUtility_utils.helper;
        while (this.teams.away.name == this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.umpire = new _baseballModelUmpire.Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        }
        this.autoPitchSelect();
        _baseballServices_services.Animator.init();
    },
    passMinutes: function passMinutes(minutes) {
        this.timeOfDay.m = ('00' + (parseInt(this.timeOfDay.m) + parseInt(minutes))).slice(-2);
        if (parseInt(this.timeOfDay.m) >= 60) {
            this.timeOfDay.m = ('00' + parseInt(this.timeOfDay.m) % 60).slice(-2);
            this.timeOfDay.h = ('00' + (parseInt(this.timeOfDay.h) + 1) % 24).slice(-2);
        }
        _baseballServices_services.Animator.setLuminosity(1 - Math.abs(12 - this.timeOfDay.h) / 12);
    },
    getInning: function getInning() {
        return _baseballUtility_utils.text.mode == 'n' ? this.inning + (this.half == 'top' ? 'オモテ' : 'ウラ') : this.half.toUpperCase() + ' ' + this.inning;
    },
    humanBatting: function humanBatting() {
        var humanControl = this.humanControl;
        if (humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl == 'both' || humanControl == 'away';
            case 'bottom':
                return humanControl == 'both' || humanControl == 'home';
        }
    },
    humanPitching: function humanPitching() {
        var humanControl = this.humanControl;
        if (humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl == 'both' || humanControl == 'home';
            case 'bottom':
                return humanControl == 'both' || humanControl == 'away';
        }
    },
    end: function end() {
        this.stage = 'end';
        var e, n;
        e = this.tally.home.R > this.tally.away.R ? 'Home team wins!' : this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!';
        n = this.tally.home.R > this.tally.away.R ? this.teams.home.getName() + 'の勝利' : this.tally.home.R == this.tally.away.R ? '引き分け' : this.teams.away.getName() + 'の勝利';
        if (this.tally.home.R > this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.W++;
            this.teams.away.positions.pitcher.stats.pitching.L++;
        } else if (this.tally.home.R < this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.L++;
            this.teams.away.positions.pitcher.stats.pitching.W++;
        }
        this.log.note(e, n);
        this.log.note('Reload to play again', 'リロるは次の試合へ');
    },
    stage: 'pitch', //pitch, swing
    simulateInput: function simulateInput(callback) {
        var stage = this.stage,
            pitchTarget = this.pitchTarget;
        if (stage == 'end') {
            return;
        }
        if (stage == 'pitch') {
            this.autoPitch(callback);
        } else if (stage == 'swing') {
            if (typeof pitchTarget != 'object') {
                this.pitchTarget = { x: 100, y: 100 };
            }
            this.autoSwing(this.pitchTarget.x, this.pitchTarget.y, callback);
        }
    },
    simulatePitchAndSwing: function simulatePitchAndSwing(callback) {
        if (this.stage == 'end') {
            return;
        }
        this.autoPitch(callback);
        var giraffe = this;
        setTimeout(function () {
            if (typeof giraffe.pitchTarget != 'object') {
                giraffe.pitchTarget = { x: 100, y: 100 };
            }
            giraffe.autoSwing(giraffe.pitchTarget.x, giraffe.pitchTarget.y, function (callback) {
                callback();
            });
        }, giraffe.field.hasRunnersOn() ? _baseballServices_services.Animator.TIME_FROM_SET + 2500 : _baseballServices_services.Animator.TIME_FROM_WINDUP + 2500);
    },
    /**
     * generically receive click input and decide what to do
     * @param x
     * @param y
     * @param callback
     */
    receiveInput: function receiveInput(x, y, callback) {
        if (this.humanControl == 'none') {
            return;
        }
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch' && this.humanPitching()) {
            this.thePitch(x, y, callback);
        } else if (this.stage == 'swing' && this.humanBatting()) {
            this.theSwing(x, y, callback);
        }
    },
    autoPitchSelect: function autoPitchSelect() {
        var pitchNames = Object.keys(this.pitcher.pitching);
        var pitchName = pitchNames[Math.random() * pitchNames.length | 0];
        var pitch = this.pitcher.pitching[pitchName];
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    },
    autoPitch: function autoPitch(callback) {
        var pitcher = this.pitcher,
            giraffe = this;
        if (this.stage == 'pitch') {
            this.autoPitchSelect();
            pitcher.windingUp = true;
            if (!this.console) {
                $('.baseball').addClass('hide');
                var windup = $('.windup');
                windup.css('width', '100%');
            }
            var pitch = _baseballServices_services.Distribution.pitchLocation(),
                x = pitch.x,
                y = pitch.y;
            if (this.quickMode) {
                this.thePitch(x, y, callback);
            } else {
                if (!_baseballServices_services.Animator.console) {
                    _baseballServices_services.Animator.loop.resetCamera();
                }
                windup.animate({ width: 0 }, this.field.hasRunnersOn() ? _baseballServices_services.Animator.TIME_FROM_SET : _baseballServices_services.Animator.TIME_FROM_WINDUP, function () {
                    !giraffe.console && $('.baseball.pitch').removeClass('hide');
                    giraffe.thePitch(x, y, callback);
                    pitcher.windingUp = false;
                });
            }
        }
    },
    autoSwing: function autoSwing(deceptiveX, deceptiveY, callback) {
        var giraffe = this;
        var bonus = this.batter.eye.bonus || 0,
            eye = this.batter.skill.offense.eye + 6 * (this.umpire.count.balls + this.umpire.count.strikes) + bonus,
            convergence,
            convergenceSum;

        var x = _baseballServices_services.Distribution.centralizedNumber(),
            y = _baseballServices_services.Distribution.centralizedNumber();

        if (100 * Math.random() < eye) {
            // identified the break
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        }

        if (100 * Math.random() < eye) {
            // identified the location
            convergence = eye / 25;
            convergenceSum = 1 + convergence;
        } else {
            convergence = eye / 100;
            convergenceSum = 1 + convergence;
        }

        x = (deceptiveX * convergence + x) / convergenceSum;
        y = (deceptiveY * convergence + y) / convergenceSum;

        this.swingResult.x = _baseballServices_services.Distribution.cpuSwing(x, this.pitchInFlight.x, eye);
        this.swingResult.y = _baseballServices_services.Distribution.cpuSwing(y, this.pitchInFlight.y, eye * 0.75);

        var swingProbability = _baseballServices_services.Distribution.swingLikelihood(eye, x, y, this.umpire);
        if (swingProbability < 100 * Math.random()) {
            x = -20;
        }

        callback(function () {
            giraffe.theSwing(x, y);
        });
    },
    opponentConnected: false,
    waitingCallback: function waitingCallback() {},
    awaitPitch: function awaitPitch(callback, swingResult) {
        var giraffe = this;
        if (this.opponentConnected) {
            this.waitingCallback = callback;
            this.opponentService.emitSwing(swingResult);
        } else {
            setTimeout(function () {
                giraffe.autoPitch(callback);
            }, 5200);
        }
    },
    awaitSwing: function awaitSwing(x, y, callback, pitchInFlight, pitchTarget) {
        if (this.opponentConnected) {
            this.waitingCallback = callback;
            this.opponentService.emitPitch({
                inFlight: pitchInFlight,
                target: pitchTarget
            });
        } else {
            this.autoSwing(x, y, callback);
        }
    },
    thePitch: function thePitch(x, y, callback, override) {
        if (this.stage == 'pitch') {
            if (override) {
                this.pitchInFlight = override.inFlight;
                this.pitchTarget = override.target;
                callback = this.waitingCallback;
            } else {
                this.pitcher.fatigue++;
                this.pitchTarget.x = x;
                this.pitchTarget.y = y;

                this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
                this.battersEye = _baseballUtility_utils.text.getBattersEye(this);

                var control = Math.floor(this.pitchInFlight.control - this.pitcher.fatigue / 2);
                this.pitchTarget.x = _baseballServices_services.Distribution.pitchControl(this.pitchTarget.x, control);
                this.pitchTarget.y = _baseballServices_services.Distribution.pitchControl(this.pitchTarget.y, control);

                if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

                var breakEffect = _baseballServices_services.Distribution.breakEffect(this.pitchInFlight, this.pitcher, this.pitchTarget.x, this.pitchTarget.y);

                this.pitchInFlight.x = breakEffect.x;
                this.pitchInFlight.y = breakEffect.y;
            }
            this.log.notePitch(this.pitchInFlight, this.batter);

            this.stage = 'swing';
            if (this.humanControl != 'none' && (this.humanControl == 'both' || this.humanBatting())) {
                callback();
            } else {
                this.awaitSwing(x, y, callback, this.pitchInFlight, this.pitchTarget);
            }
        }
    },
    battersEye: {
        e: '',
        n: ''
    },
    theSwing: function theSwing(x, y, callback, override) {
        if (this.stage == 'swing') {
            if (override) {
                this.swingResult = override;
                callback = this.waitingCallback;
            } else {
                this.swingResult = {};
                var bonus = this.batter.eye.bonus || 0,
                    eye = this.batter.skill.offense.eye + 6 * (this.umpire.count.balls + this.umpire.count.strikes) + bonus;

                if (x >= 0 && x <= 200) {
                    this.batter.fatigue++;

                    this.swingResult.x = x - this.pitchInFlight.x;
                    this.swingResult.y = y - this.pitchInFlight.y;
                    this.swingResult.angle = this.setBatAngle();

                    var recalculation = _baseballServices_services.Mathinator.getAngularOffset(this.swingResult, this.swingResult.angle);
                    var precision = _baseballServices_services.Distribution.swing(eye);

                    this.swingResult.x = recalculation.x * precision;
                    this.swingResult.y = -5 + recalculation.y * precision;

                    //log(recalculation.y, precision);

                    this.swingResult.looking = false;
                    if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                        this.swingResult.contact = true;
                        this.field.determineSwingContactResult(this.swingResult);
                        // log(this.swingResult.flyAngle, Math.floor(this.swingResult.x), Math.floor(this.swingResult.y));
                        this.debug.push(this.swingResult);
                    } else {
                        this.swingResult.contact = false;
                    }
                } else {
                    this.swingResult.strike = this.pitchInFlight.x > 50 && this.pitchInFlight.x < 150 && this.pitchInFlight.y > 35 && this.pitchInFlight.y < 165;
                    this.batter.eye.bonus = Math.max(0, eye - Math.sqrt(Math.pow(this.batter.eye.x - this.pitchInFlight.x, 2) + Math.pow(this.batter.eye.y - this.pitchInFlight.y, 2)) * 1.5);
                    this.swingResult.contact = false;
                    this.swingResult.looking = true;
                    this.batter.eye.x = this.pitchInFlight.x;
                    this.batter.eye.y = this.pitchInFlight.y;
                }
            }
            this.log.noteSwing(this.swingResult);
            this.stage = 'pitch';

            var half = this.half;
            var result = this.swingResult;
            this.umpire.makeCall();
            emit = false;
            if (half != this.half) {
                callback = this.startOpponentPitching;
                var emit = !override;
            }

            if (typeof callback == 'function') {
                if (this.humanControl != 'none' && (this.humanControl == 'both' || this.teams[this.humanControl] == this.pitcher.team)) {
                    callback();
                    if (emit) {
                        if (this.opponentService && this.opponentConnected) {
                            this.opponentService.emitSwing(result);
                        }
                    }
                } else {
                    this.awaitPitch(callback, result);
                }
            }
        }
    },
    setBatAngle: function setBatAngle(x, y) {
        var giraffe = this,
            pitchInFlight = this.pitchInFlight,
            swingResult = this.swingResult;
        var origin = {
            x: giraffe.batter.bats == 'right' ? -50 : 250,
            y: 190
        };
        var swing = {
            x: x ? x : pitchInFlight.x + swingResult.x,
            y: y ? y : pitchInFlight.y + swingResult.y
        };
        return _baseballServices_services.Mathinator.battingAngle(origin, swing);
    },
    debugOut: function debugOut() {
        log('slugging', this.debug.filter(function (a) {
            return a.bases == 1;
        }).length, this.debug.filter(function (a) {
            return a.bases == 2;
        }).length, this.debug.filter(function (a) {
            return a.bases == 3;
        }).length, this.debug.filter(function (a) {
            return a.bases == 4;
        }).length);
        log('grounders', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle < -5;
        }).length);
        log('grounders thrown out', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle < -5 && a.thrownOut;
        }).length);
        log('weak air hits (thrown out)', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle > 0 && a.thrownOut;
        }).length);
        log('good air hits (not caught)', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle > 0 && !a.thrownOut;
        }).length);

        var PO = {};
        this.debug.map(function (a) {
            if (!a.fielder) return;
            if (!PO[a.fielder]) {
                PO[a.fielder] = 0;
            }
            if (!a.bases && a.fielder) {
                PO[a.fielder]++;
            }
        });
        log('fielding outs', PO);

        var hitters = this.teams.away.lineup.concat(this.teams.home.lineup);
        var atBats = [];
        hitters.map(function (a) {
            atBats = atBats.concat(a.getAtBats().map(function (ab) {
                return ab.text;
            }));
        });

        var LO = atBats.filter(function (ab) {
            return ab == 'LO';
        }).length;
        var FO = atBats.filter(function (ab) {
            return ab == 'FO';
        }).length;
        var GO = atBats.filter(function (ab) {
            return ab == 'GO';
        }).length;
        var GIDP = atBats.filter(function (ab) {
            return ab == '(IDP)';
        }).length;
        var SO = atBats.filter(function (ab) {
            return ab == 'SO';
        }).length;
        var BB = atBats.filter(function (ab) {
            return ab == 'BB';
        }).length;
        var SAC = atBats.filter(function (ab) {
            return ab == 'SAC';
        }).length;
        var FC = atBats.filter(function (ab) {
            return ab == 'FC';
        }).length;
        log('line outs', LO, 'fly outs', FO, 'groundouts', GO, 'strikeouts', SO, 'sacrifices', SAC, 'FC', FC, 'gidp', GIDP);
        log('BB', BB);
        log('fouls', this.debug.filter(function (a) {
            return a.foul;
        }).length);
        log('fatigue, home vs away');
        var teams = this.teams;
        var fatigue = { home: {}, away: {} };
        _baseballServices_services.Iterator.each(this.teams.home.positions, function (key) {
            var position = key;
            fatigue.home[position] = teams.home.positions[position].fatigue;
            fatigue.away[position] = teams.away.positions[position].fatigue;
        });
        console.table(fatigue);
        console.table(this.scoreboard);
        console.table(this.tally);
    },
    toData: function toData() {
        var data = {};
        data.half = this.half;
        data.inning = this.inning;
        data.tally = this.tally;
        var giraffe = this;
        var players = this.teams.away.lineup.concat(this.teams.home.lineup);
        // note: bench not included
        data.field = {
            first: players.indexOf(this.field.first),
            second: players.indexOf(this.field.second),
            third: players.indexOf(this.field.third)
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
        data.players = players.map(function (player) {
            return player.serialize();
        });
        data.log = {
            pitchRecord: giraffe.log.pitchRecord,
            record: giraffe.log.record
        };
        data.gamesIntoSeason = this.gamesIntoSeason;
        return data;
    },
    fromData: function fromData(data) {
        this.half = data.half;
        this.inning = data.inning;
        this.tally = data.tally;
        var giraffe = this;
        var players = data.players.map(function (playerJson, index) {
            var playerData = JSON.parse(playerJson);
            if (index > 8) {
                var side = 'home';
                index = index - 9;
            } else {
                side = 'away';
            }
            var player = giraffe.teams[side].positions[playerData.position];
            player.fromData(playerData);
            giraffe.teams[side].lineup[index] = player;
            player.resetStats(data.gamesIntoSeason);
            return player;
        });
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
        return this;
    },
    startOpponentPitching: null, // late function
    pitchTarget: { x: 100, y: 100 },
    pitchInFlight: {
        x: 100,
        y: 100,
        breakDirection: [0, 0],
        name: 'slider',
        velocity: 50,
        'break': 50,
        control: 50
    },
    swingResult: {
        x: 100, //difference to pitch location
        y: 100, //difference to pitch location
        strike: false,
        foul: false,
        caught: false,
        contact: false,
        looking: true,
        bases: 0,
        fielder: 'short',
        outs: 0
    },
    playResult: {
        batter: '',
        fielder: ''
    },
    showPlayResultPanels: function showPlayResultPanels(batter) {
        var batterOutcomes = {};
        var atBat = batter.atBats.slice(0).pop();
        var fielderOutcomes = {};
        var n = function n() {
            var n = Math.floor(Math.random() * 3);
            return n ? n : '';
        };
        this.playResult = {
            batter: 'B_placeholder' + n() || batterOutcomes[atBat] || 'batter/' + atBat,
            fielder: 'F_placeholder' + n() || fielderOutcomes[atBat] || 'fielder/' + atBat
        };
    },
    pitchSelect: function pitchSelect() {},
    field: null,
    teams: {
        away: null,
        home: null
    },
    log: null,
    half: 'top',
    inning: 1,
    scoreboard: {
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
    },
    resetTally: function resetTally() {
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
    },
    tally: {
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
    }
};

exports.Game = Game;

},{"baseball/Model/Field":2,"baseball/Model/Team":6,"baseball/Model/Umpire":7,"baseball/Services/_services":25,"baseball/Utility/Log":29,"baseball/Utility/_utils":30}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballServices_services = require('baseball/Services/_services');

var Manager = function Manager(team) {
    this.init(team);
};

Manager.prototype = {
    constructor: Manager,
    init: function init(team) {
        this.team = team;
    },
    makeLineup: function makeLineup() {
        var jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        if (!this.team.positions.pitcher.number) {
            this.team.positions.pitcher.number = jerseyNumber++;
        }
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], 'right');
        this.team.positions.catcher.position = 'catcher';
        if (!this.team.positions.catcher.number) {
            this.team.positions.catcher.number = jerseyNumber++;
        }
        _baseballServices_services.Iterator.each(this.team.bench, function (key, player) {
            if (!player.number) {
                player.number = jerseyNumber++;
            }
        });
        this.team.positions.short = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'left');
        this.team.positions.first.position = 'first';

        this.team.lineup[3] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[3].order = 3;
        this.team.lineup[2] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[2].order = 2;
        this.team.lineup[4] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[4].order = 4;
        this.team.lineup[0] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[0].order = 0;
        this.team.lineup[1] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[1].order = 1;
        this.team.lineup[5] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[5].order = 5;
        this.team.lineup[6] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[6].order = 6;
        this.team.lineup[7] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[7].order = 7;
        this.team.lineup[8] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[8].order = 8;
    },
    selectForSkill: function selectForSkill(pool, skillset, requiredThrowingHandedness) {
        if (this.team.bench.length || pool == this.team.positions) {
            var selection = this.team.bench[0];
            var rating = 0;
            var index = 0;
            _baseballServices_services.Iterator.each(pool, function (key, player) {
                var skills = skillset.slice();
                var cursor = player.skill;
                var property = skills.shift();
                while (property) {
                    cursor = cursor[property];
                    property = skills.shift();
                }
                if (!(player.order + 1) && cursor >= rating && (!requiredThrowingHandedness || player.throws == requiredThrowingHandedness)) {
                    rating = cursor;
                    selection = player;
                    index = key;
                }
            });
            if (pool == this.team.bench) {
                delete this.team.bench[index];
                this.team.bench = this.team.bench.filter(function (player) {
                    return player instanceof selection.constructor;
                });
            }
            return selection;
        }
        return 'no players available';
    }
};

exports.Manager = Manager;

},{"baseball/Services/_services":25}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballUtility_utils = require('baseball/Utility/_utils');

var _baseballServices_services = require('baseball/Services/_services');

var _baseballModel_models = require('baseball/Model/_models');

var Player = function Player(team) {
    this.init(team);
    this.resetStats(this.team.game && this.team.game.gamesIntoSeason || 0);
};

Player.prototype = {
    constructor: Player,
    init: function init(team, hero) {
        this.throws = Math.random() > 0.86 ? 'left' : 'right';
        this.bats = Math.random() > 0.75 ? 'left' : 'right';
        this.team = team;
        this.skill = {};
        this.eye = {
            x: 100,
            y: 100
        };
        this.pitching = { averaging: [] };
        this.number = 0;
        this.randomizeSkills(hero || Math.random() > 0.9);
        var surnameKey = Math.floor(Math.random() * _baseballUtility_utils.data.surnames.length),
            nameKey = Math.floor(Math.random() * _baseballUtility_utils.data.names.length);

        this.name = _baseballUtility_utils.data.surnames[surnameKey] + ' ' + _baseballUtility_utils.data.names[nameKey];
        var jSurname = _baseballUtility_utils.data.surnamesJ[surnameKey],
            jGivenName = _baseballUtility_utils.data.namesJ[nameKey];
        this.spaceName(jSurname, jGivenName);
        this.surname = _baseballUtility_utils.data.surnames[surnameKey];
        this.surnameJ = _baseballUtility_utils.data.surnamesJ[surnameKey];
        this.atBats = [];
    },
    spaceName: function spaceName(jSurname, jGivenName) {
        if (jSurname.length == 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length == 1 && jSurname.indexOf('・') < 0 && jSurname.length <= 2) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.surnameJ = jSurname;
    },
    serialize: function serialize() {
        var team = this.team;
        delete this.team;
        var data = JSON.stringify(this);
        this.team = team;
        return data;
    },
    fromData: function fromData(data) {
        var giraffe = this;
        _baseballServices_services.Iterator.each(data, function (key, value) {
            giraffe[key] = value;
        });
        delete this.atBatObjects;
        this.getAtBats();
    },
    resetStats: function resetStats() {
        var gamesIntoSeason = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

        var offense = this.skill.offense;
        var defense = this.skill.defense;
        var randBetween = function randBetween(a, b, skill) {
            var total = 0,
                count = 0;
            skill += '';
            if (!skill) skill = '';
            _baseballServices_services.Iterator.each(skill.split(' '), function (key, value) {
                var skill = value;
                if (offense[skill]) skill = offense[skill];
                if (defense[skill]) skill = defense[skill];
                if (isNaN(skill)) skill = 50;
                total += skill;
                count++;
            });

            skill = Math.sqrt(0.05 + Math.random() * 0.95) * (total / (count * 0.97));
            return Math.floor(skill / 100 * (b - a) + a);
        };
        var IP, ER, GS, W, L;
        if (this.skill.pitching > 65) {
            IP = (this.skill.pitching - 65) * gamesIntoSeason / 20;
            ER = IP / 9 * randBetween(800, 215, this.skill.pitching) / 100;
            if (IP > gamesIntoSeason) {
                //starter
                GS = Math.floor(gamesIntoSeason / 5);
                W = randBetween(GS * 0.1, GS * 0.8, this.skill.pitching / 1.20);
                L = randBetween(GS - W, 0, this.skill.pitching / 3);
            } else {
                //reliever
                GS = Math.floor(gamesIntoSeason / 40);
                W = randBetween(0, GS * 0.6, this.skill.pitching);
                L = randBetween(GS - W, 0, this.skill.pitching);
            }
        }
        var pa = randBetween(gamesIntoSeason * 3, gamesIntoSeason * 5, 'speed eye');
        var paRemaining = pa;
        var bb = Math.floor(randBetween(0, 18, 'power eye') * paRemaining / 100);
        paRemaining -= bb;
        var ab = paRemaining;
        var so = Math.floor(randBetween(25, 2, 'eye') * paRemaining / 100);
        paRemaining -= so;
        var h = Math.floor(randBetween(185, 372, 'eye power speed') * paRemaining / 1000);
        paRemaining -= h;

        var doubles = randBetween(0, h / 4, 'power speed');
        var triples = randBetween(0, h / 12, 'speed');
        var hr = Math.max(0, randBetween(-h / 20, h / 5, 'power eye'));
        var r = randBetween(h / 8, (h + bb) / 3, 'speed') + hr;
        var rbi = randBetween(h / 8, h / 2, 'power eye') + hr;
        var hbp = randBetween(0, gamesIntoSeason / 25);
        var sac = randBetween(0, gamesIntoSeason / 5, 'eye');

        var chances = randBetween(0, gamesIntoSeason * 10, 'fielding');
        var E = randBetween(chances / 10, 0, 'fielding');
        var PO = chances - E;

        this.stats = {
            pitching: {
                pitches: 0, // in game
                GS: GS,
                W: W,
                L: L,
                strikes: 0, // in game
                K: 0, // in game
                getK9: function getK9() {
                    return this.K / (this.IP[0] / 9);
                },
                getERA: function getERA() {
                    return 9 * this.ER / Math.max(1 / 3, this.IP[0] + this.IP[1] / 3);
                },
                ERA: null,
                ER: ER,
                H: 0, // in game
                HR: 0, // in game
                BB: 0, // in game
                IP: [IP, 0],
                WHIP: 0,
                getWHIP: function getWHIP() {
                    return (this.H + this.BB) / (this.IP[0] ? this.IP[0] : 1);
                }
            },
            batting: {
                getBA: function getBA() {
                    return this.h / Math.max(1, this.ab);
                },
                getBABIP: function getBABIP() {
                    return (this.h - this.hr) / (this.ab - this.so - this.hr + this.sac);
                },
                ba: null,
                getOBP: function getOBP() {
                    return (this.h + this.bb + this.hbp) / (this.ab + this.bb + this.hbp + this.sac);
                },
                obp: null,
                getSLG: function getSLG() {
                    return (this.h - this['2b'] - this['3b'] - this.hr + 2 * this['2b'] + 3 * this['3b'] + 4 * this.hr) / this.ab;
                },
                slg: null,
                pa: pa,
                ab: ab,
                so: so,
                bb: bb,
                h: h,
                '2b': doubles,
                '3b': triples,
                hr: hr,
                r: r,
                rbi: rbi,
                hbp: hbp,
                sac: sac
            },
            fielding: {
                E: E,
                PO: PO, // should depend on position
                A: Math.floor(Math.random() * 5) + 1 // ehh should depend on position
            }
        };
        this.stats.pitching.ERA = this.stats.pitching.getERA();
        this.stats.pitching.K9 = this.stats.pitching.getK9();
        this.stats.pitching.WHIP = this.stats.pitching.getWHIP();
        this.stats.batting.ba = this.stats.batting.getBA();
    },
    atBatObjects: [],
    getAtBats: function getAtBats() {
        if (this.atBats.length > this.atBatObjects.length) {
            this.atBatObjects = this.atBats.map(function (item) {
                return new _baseballModel_models.AtBat(item);
            });
        }
        return this.atBatObjects;
    },
    recordRBI: function recordRBI() {
        this.atBats[this.atBats.length - 1] += _baseballModel_models.AtBat.prototype.RBI_INDICATOR;
    },
    recordInfieldHit: function recordInfieldHit() {
        this.atBats[this.atBats.length - 1] += _baseballModel_models.AtBat.prototype.INFIELD_HIT_INDICATOR;
    },
    getBaseRunningTime: function getBaseRunningTime() {
        return _baseballServices_services.Mathinator.baseRunningTime(this.skill.offense.speed);
    },
    randomizeSkills: function randomizeSkills(hero, allPitches) {
        this.hero = hero;
        var giraffe = this;
        var randValue = function randValue(isPitching) {
            var value = Math.floor(Math.pow(Math.random(), 0.75) * 80 + Math.random() * 20);
            if (hero) {
                value += Math.floor((100 - value) * Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value;
        };
        this.skill.offense = {
            eye: randValue(),
            power: randValue(),
            speed: randValue()
        };
        this.skill.defense = {
            catching: randValue(),
            fielding: randValue(),
            speed: randValue(),
            throwing: randValue()
        };
        this.pitching.averaging = [];
        this.pitching['4-seam'] = {
            velocity: randValue(true),
            'break': randValue(true),
            control: randValue(true)
        };
        this.pitching.slider = {
            velocity: randValue(true),
            'break': randValue(true),
            control: randValue(true)
        };
        if (Math.random() < 0.17 || allPitches) {
            // can pitch!
            if (Math.random() > 0.6 || allPitches) {
                this.pitching['2-seam'] = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.18 || allPitches) {
                this.pitching.fork = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() > 0.77 || allPitches) {
                this.pitching.cutter = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.21 || allPitches) {
                this.pitching.sinker = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.4 || allPitches) {
                this.pitching.curve = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.9 || allPitches) {
                this.pitching.change = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
        }
        this.skill.pitching = Math.floor(this.pitching.averaging.reduce(function (prev, current) {
            return prev + current;
        }) / this.pitching.averaging.length + this.pitching.averaging.length * 3);
        delete this.pitching.averaging;
    },
    getSurname: function getSurname() {
        return _baseballUtility_utils.text.mode == 'n' ? this.surnameJ : this.surname;
    },
    getName: function getName() {
        return _baseballUtility_utils.text.mode == 'n' ? this.nameJ : this.name;
    },
    getUniformNumber: function getUniformNumber() {
        return (0, _baseballUtility_utils.text)('#') + this.number;
    },
    getOrder: function getOrder() {
        return (0, _baseballUtility_utils.text)([' 1st', ' 2nd', ' 3rd', ' 4th', ' 5th', ' 6th', '7th', ' 8th', ' 9th'][this.order]);
    },
    eye: {},
    fatigue: 0,
    name: '',
    number: 0,
    position: '',
    atBats: []
};

exports.Player = Player;

},{"baseball/Model/_models":8,"baseball/Services/_services":25,"baseball/Utility/_utils":30}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballModelPlayer = require('baseball/Model/Player');

var _baseballModelManager = require('baseball/Model/Manager');

var _baseballUtility_utils = require('baseball/Utility/_utils');

var Team = function Team(game) {
    this.init(game);
};

Team.prototype = {
    constructor: Team,
    init: function init(game) {
        this.pickName();
        this.lineup = [];
        this.bench = [];
        this.bullpen = [];
        this.positions = {
            pitcher: null,
            catcher: null,
            first: null,
            second: null,
            short: null,
            third: null,
            left: null,
            center: null,
            right: null
        };
        this.manager = new _baseballModelManager.Manager(this);
        if (game !== 'no init') {
            this.game = game;
            for (var j = 0; j < 20; j++) {
                this.bench.push(new _baseballModelPlayer.Player(this));
            }
            if (this.bench.length == 20) {
                this.manager.makeLineup();
            }
        }
    },
    pickName: function pickName() {
        var teamNameIndex = Math.floor(Math.random() * _baseballUtility_utils.data.teamNames.length);
        this.name = _baseballUtility_utils.data.teamNames[teamNameIndex];
        this.nameJ = _baseballUtility_utils.data.teamNamesJ[teamNameIndex];
    },
    getName: function getName() {
        return _baseballUtility_utils.text.mode == 'n' ? this.nameJ : this.name;
    },
    lineup: [],
    positions: {},
    manager: null,
    bench: [],
    bullpen: [],
    nowBatting: 0,
    expanded: 'Player&'
};

exports.Team = Team;

},{"baseball/Model/Manager":4,"baseball/Model/Player":5,"baseball/Utility/_utils":30}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballUtility_utils = require('baseball/Utility/_utils');

var _baseballModelPlayer = require('baseball/Model/Player');

var Umpire = function Umpire(game) {
    this.init(game);
};

Umpire.prototype = {
    constructor: Umpire,
    init: function init(game) {
        this.game = game;
        this.playBall();
    },
    count: {
        strikes: 0,
        balls: 0,
        outs: 0
    },
    playBall: function playBall() {
        var game = this.game;
        game.half = 'top';
        game.inning = 1;
        game.batter = game.teams.away.lineup[0];
        game.batterRunner = game.teams.away.lineup[0];
        game.deck = game.teams.away.lineup[1];
        game.hole = game.teams.away.lineup[2];
        game.pitcher = game.teams.home.positions.pitcher;
        var n = '一回のオモテ、' + game.teams.away.getName() + 'の攻撃対' + game.teams.home.getName() + '、ピッチャーは' + game.teams.home.positions.pitcher.getName() + '。',
            e = 'Top 1, ' + game.teams.away.name + ' offense vs. ' + game.teams.home.positions.pitcher.name + ' starting for ' + game.teams.home.name;
        game.log.note(e, n);
        game.log.noteBatter(game.batter);
    },
    makeCall: function makeCall() {
        this.says = '';
        var game = this.game;
        var result = game.swingResult;
        var pitcher = game.pitcher;
        var batter = game.batter;

        if (game.swingResult.fielder) {
            var fielder = game.teams[game.half == 'top' ? 'home' : 'away'].positions[result.fielder];
        } else {
            fielder = null;
        }

        game.batterRunner = game.batter;

        pitcher.stats.pitching.pitches++;
        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            pitcher.stats.pitching.strikes++;
            if (result.contact) {
                game.passMinutes(1);
                if (result.caught) {
                    batter.stats.batting.pa++;
                    pitcher.stats.pitching.IP[1]++;
                    if (result.sacrificeAdvances.length && this.count.outs < 2) {
                        batter.stats.batting.sac++;
                        game.batter.atBats.push(_baseballUtility_utils.Log.prototype.SACRIFICE);
                        this.advanceRunners(false, null, result.sacrificeAdvances);
                    } else {
                        batter.stats.batting.ab++;
                        if (result.flyAngle < 15) {
                            game.batter.atBats.push(_baseballUtility_utils.Log.prototype.LINEOUT);
                        } else {
                            game.batter.atBats.push(_baseballUtility_utils.Log.prototype.FLYOUT);
                        }
                    }
                    this.count.outs++;
                    this.newBatter();
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.firstOut) {
                            game.field[result.firstOut] = null;
                            result.additionalOuts.map(function (runner) {
                                if (runner !== 'batter') {
                                    game.field[runner] = null;
                                }
                            });
                            this.count.outs += result.additionalOuts.length;
                        }
                        if (result.fieldersChoice && this.count.outs < 2) {
                            result.bases = 0;
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(_baseballUtility_utils.Log.prototype.FIELDERS_CHOICE);
                            this.advanceRunners(false, result.fieldersChoice);
                            result.doublePlay && game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GIDP);
                            this.reachBase();
                            result.outs = this.count.outs;
                            this.newBatter();
                        } else if (result.fieldersChoice) {
                            result.bases = 0;
                            result.thrownOut = true;
                        }
                        if (result.thrownOut) {
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GROUNDOUT);
                            result.doublePlay && game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GIDP);
                            if (this.count.outs < 3) {
                                this.advanceRunners(false);
                            }
                            result.outs = this.count.outs;
                            this.newBatter();
                        }
                        if (result.hitByPitch) {
                            batter.stats.batting.ab--;
                        }
                        if (result.bases) {
                            if (!result.error) {
                                game.tally[game.half == 'top' ? 'away' : 'home'][_baseballUtility_utils.Log.prototype.SINGLE]++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    game.tally[game.half == 'top' ? 'home' : 'away'].E++;
                                    fielder.stats.fielding.E++;
                                }
                            }
                            var bases = result.bases;
                            switch (bases) {
                                case 0:
                                    game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GROUNDOUT);
                                    break;
                                case 1:
                                    if (result.error) {
                                        game.batter.atBats.push(_baseballUtility_utils.Log.prototype.REACHED_ON_ERROR);
                                    } else {
                                        game.batter.atBats.push(_baseballUtility_utils.Log.prototype.SINGLE);
                                        batter.stats.batting.h++;
                                    }
                                    break;
                                case 2:
                                    game.batter.atBats.push(_baseballUtility_utils.Log.prototype.DOUBLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3:
                                    game.batter.atBats.push(_baseballUtility_utils.Log.prototype.TRIPLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4:
                                    game.batter.atBats.push(_baseballUtility_utils.Log.prototype.HOMERUN);
                                    pitcher.stats.pitching.HR++;
                                    batter.stats.batting.h++;
                                    batter.stats.batting.hr++;
                                    break;
                            }
                            if (bases > 0 && bases < 4 && !result.error) {
                                if (['left', 'right', 'center'].indexOf(result.fielder) == -1) {
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

        this.says = this.count.balls + ' and ' + this.count.strikes;

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
            batter.atBats.push(_baseballUtility_utils.Log.prototype.STRIKEOUT);
            this.newBatter();
        }
        if (this.count.balls > 3) {
            batter.stats.batting.pa++;
            batter.stats.batting.bb++;
            pitcher.stats.pitching.BB++;
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            batter.atBats.push(_baseballUtility_utils.Log.prototype.WALK);
            this.advanceRunners(true).reachBase().newBatter();
        }
        if (this.count.outs > 2) {
            this.says = 'Three outs, change.';
            this.count.outs = this.count.balls = this.count.strikes = 0;
            pitcher.stats.pitching.IP[0]++;
            pitcher.stats.pitching.IP[1] = 0;
            this.changeSides();
        }
    },
    reachBase: function reachBase() {
        var game = this.game;
        game.field.first = game.batter;
        game.field.first.fatigue += 2;
        return this;
    },
    advanceRunners: function advanceRunners(isWalk, fieldersChoice, sacrificeAdvances) {
        isWalk = !!isWalk;
        var game = this.game;
        var first = game.field.first,
            second = game.field.second,
            third = game.field.third,
            swing = game.swingResult;

        if (isWalk) {
            if (first) {
                if (second) {
                    if (third) {
                        //bases loaded
                        game.batter.recordRBI();
                        game.batter.stats.batting.rbi++;
                        third.atBats.push(_baseballUtility_utils.Log.prototype.RUN);
                        third.stats.batting.r++;
                        game.pitcher.stats.pitching.ER++;
                        game.scoreboard[game.half == 'top' ? 'away' : 'home'][game.inning]++;
                        game.tally[game.half == 'top' ? 'away' : 'home'].R++;
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
                    game.field[fieldersChoice] = null;
                    first = game.field.first;
                    second = game.field.second;
                    third = game.field.third;
                }
                var canAdvance = function canAdvance() {
                    return true;
                };
                if (sacrificeAdvances) {
                    canAdvance = function (position) {
                        switch (position) {
                            case 'first':
                                return sacrificeAdvances.indexOf('first') > -1 && (canAdvance('second') || !second);
                            case 'second':
                                return sacrificeAdvances.indexOf('second') > -1 && (canAdvance('third') || !third);
                            case 'third':
                                return sacrificeAdvances.indexOf('third') > -1;
                        }
                    };
                }
                if (third instanceof _baseballModelPlayer.Player && canAdvance('third')) {
                    // run scored
                    game.scoreboard[game.half == 'top' ? 'away' : 'home'][game.inning]++;
                    game.tally[game.half == 'top' ? 'away' : 'home'].R++;
                    if (game.batter != third) {
                        game.batter.recordRBI();
                        third.atBats.push(_baseballUtility_utils.Log.prototype.RUN);
                    }
                    game.batter.stats.batting.rbi++;
                    third.stats.batting.r++;
                    game.pitcher.stats.pitching.ER++;
                }
                if (second && canAdvance('second')) {
                    game.field.third = second;
                } else {
                    game.field.third = null;
                }
                if (first && canAdvance('first')) {
                    game.field.second = first;
                } else {
                    game.field.second = null;
                }
                game.field.first = null;
            }
        return this;
    },
    newBatter: function newBatter() {
        var game = this.game;
        game.passMinutes(2);
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        this.count.balls = this.count.strikes = 0;
        game.log.notePlateAppearanceResult(game);
        var team = game.half == 'bottom' ? game.teams.home : game.teams.away;
        game.lastBatter = game.batter;
        game.batter = team.lineup[(team.nowBatting + 1) % 9];
        game.deck = team.lineup[(team.nowBatting + 2) % 9];
        game.hole = team.lineup[(team.nowBatting + 3) % 9];
        team.nowBatting = (team.nowBatting + 1) % 9;
        if (this.count.outs < 3) {
            game.log.noteBatter(game.batter);
        }
        game.showPlayResultPanels(game.lastBatter);
    },
    changeSides: function changeSides() {
        var game = this.game;
        game.passMinutes(5);
        game.swingResult = {};
        game.swingResult.looking = true; // hide bat
        game.pitchInFlight.x = null; // hide ball
        game.pitchInFlight.y = null; // hide ball
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        var offense, defense;
        game.field.first = null;
        game.field.second = null;
        game.field.third = null;
        if (game.half == 'top') {
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
        offense = game.half == 'top' ? 'away' : 'home';
        defense = game.half == 'top' ? 'home' : 'away';
        var n = game.inning + '回の' + (game.half == 'top' ? 'オモテ' : 'ウラ') + '、' + game.teams[game.half == 'top' ? 'away' : 'home'].getName() + 'の攻撃。',
            e = (game.half == 'top' ? 'Top' : 'Bottom') + ' ' + game.inning;
        game.log.note(e, n);
        var team = game.teams[offense];
        game.batter = team.lineup[team.nowBatting];
        game.batterRunner = game.batter;
        game.deck = team.lineup[(team.nowBatting + 1) % 9];
        game.hole = team.lineup[(team.nowBatting + 2) % 9];

        game.pitcher = game.teams[defense].positions.pitcher;
        game.log.noteBatter(game.batter);
        game.autoPitchSelect();
    },
    says: 'Play ball!',
    game: null
};

exports.Umpire = Umpire;

},{"baseball/Model/Player":5,"baseball/Utility/_utils":30}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseballModelAtBat = require('baseball/Model/AtBat');

var _baseballModelField = require('baseball/Model/Field');

var _baseballModelGame = require('baseball/Model/Game');

var _baseballModelManager = require('baseball/Model/Manager');

var _baseballModelPlayer = require('baseball/Model/Player');

var _baseballModelTeam = require('baseball/Model/Team');

var _baseballModelUmpire = require('baseball/Model/Umpire');

exports.AtBat = _baseballModelAtBat.AtBat;
exports.Field = _baseballModelField.Field;
exports.Game = _baseballModelGame.Game;
exports.Manager = _baseballModelManager.Manager;
exports.Player = _baseballModelPlayer.Player;
exports.Team = _baseballModelTeam.Team;
exports.Umpire = _baseballModelUmpire.Umpire;

},{"baseball/Model/AtBat":1,"baseball/Model/Field":2,"baseball/Model/Game":3,"baseball/Model/Manager":4,"baseball/Model/Player":5,"baseball/Model/Team":6,"baseball/Model/Umpire":7}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _meshBall = require('./mesh/Ball');

var _meshMound = require('./mesh/Mound');

var _meshBase = require('./mesh/Base');

var _meshField = require('./mesh/Field');

var _meshGrass = require('./mesh/Grass');

var _meshHomeDirt = require('./mesh/HomeDirt');

var _meshBattersEye = require('./mesh/BattersEye');

var _meshWall = require('./mesh/Wall');

var _sceneLighting = require('./scene/lighting');

/**
 * the constants should be tuned so that the camera coincides with the DOM's strike zone overlay
 * @type {number}
 */
var VERTICAL_CORRECTION = -0.2;
var INITIAL_CAMERA_DISTANCE = 8;

if (typeof THREE !== 'undefined') {
    var AHEAD = new THREE.Vector3(0, VERTICAL_CORRECTION, -60.5);
    var INITIAL_POSITION = new THREE.Vector3(0, VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE);
}

/**
 * manager for the rendering loop
 */

var Loop = (function () {
    function Loop(elementClass) {
        _classCallCheck(this, Loop);

        this.elementClass = elementClass;
        this.main();
        window.loop = this;
    }

    /**
     * individual objects<AbstractMesh> can attach and detach to the manager to be rendered
     */

    _createClass(Loop, [{
        key: 'loop',
        value: function loop() {
            requestAnimationFrame(this.loop.bind(this));
            this.panToward(this.target);
            this.moveToward(this.moveTarget);
            this.objects.map(function (i) {
                return i.animate();
            });
            //this.breathe();
            this.renderer.render(this.scene, this.camera);
        }

        /**
         * initialize lights, camera, action
         */
    }, {
        key: 'main',
        value: function main() {
            this.objects = [];
            if (this.getThree()) {

                var THREE = this.THREE;

                var scene = this.scene = new THREE.Scene();
                this.attach();
                this.lighting = _sceneLighting.lighting;
                _sceneLighting.lighting.addTo(scene);
                var camera = this.camera = new THREE.PerspectiveCamera(60, this.getAspect(), 0.1, 500);

                this.target = new THREE.Vector3(0, 0, -60.5);
                this._target = new THREE.Vector3(0, 0, -60.5);
                this.moveTarget = camera.position;

                this.resetCamera();
                this.loop();
            }
        }

        /**
         * used by the background layer
         */
    }, {
        key: 'addStaticMeshes',
        value: function addStaticMeshes() {
            new _meshField.Field().join(this);
            new _meshMound.Mound().join(this);
            new _meshHomeDirt.HomeDirt().join(this);
            new _meshGrass.Grass().join(this);
            new _meshGrass.Grass(this, true);
            new _meshBattersEye.BattersEye().join(this);

            new _meshWall.Wall(this, -30);
            new _meshWall.Wall(this, -15);
            new _meshWall.Wall(this, 15);
            new _meshWall.Wall(this, 30);

            new _meshBase.Base(this, 'first');
            new _meshBase.Base(this, 'second');
            new _meshBase.Base(this, 'third');
            new _meshBase.Base(this, 'home');
        }

        /**
         * experimental camera bobbing
         */
    }, {
        key: 'breathe',
        value: function breathe() {
            var pos = this.camera.position;
            var x = pos.x,
                y = pos.y,
                z = pos.z;
            var rate = 0.0005 * this.bob || 1;
            if (y > 0.6) {
                this.bob = -1;
            } else if (y < -0.6) {
                this.bob = 1;
            }
            //pos.x += rate;
            pos.y += rate;
            pos.z += rate;
        }
    }, {
        key: 'getThree',
        value: function getThree() {
            if (this.THREE === Loop.prototype.THREE && typeof window === 'object' && window.THREE) {
                return this.THREE = window.THREE;
            }
            return false;
        }

        /**
         * attach to the DOM
         * @returns {THREE.WebGLRenderer}
         */
    }, {
        key: 'attach',
        value: function attach() {
            window.removeEventListener('resize', this.onResize.bind(this), false);
            window.addEventListener('resize', this.onResize.bind(this), false);
            var element = document.getElementsByClassName(this.elementClass)[0];
            element.innerHTML = '';
            var THREE = this.THREE;
            var renderer = new THREE.WebGLRenderer({ alpha: true });
            this.setSize(renderer);
            //renderer.setClearColor(0xffffff, 0);

            element.appendChild(renderer.domElement);

            this.renderer = renderer;
            return renderer;
        }

        /**
         * higher FOV on lower view widths
         */
    }, {
        key: 'onResize',
        value: function onResize() {
            var element = document.getElementsByClassName(this.elementClass)[0];
            this.camera.aspect = this.getAspect();
            this.camera.fov = 90 - 30 * (element.offsetWidth / 1000);
            this.camera.updateProjectionMatrix();
            this.setSize(this.renderer);
        }
    }, {
        key: 'setSize',
        value: function setSize(renderer) {
            var element = document.getElementsByClassName(this.elementClass)[0];
            var width = element.offsetWidth;
            renderer.setSize(width, HEIGHT);
        }
    }, {
        key: 'getAspect',
        value: function getAspect() {
            var element = document.getElementsByClassName(this.elementClass)[0];
            return element.offsetWidth / HEIGHT;
        }

        /**
         * incrementally pan toward the vector given
         * @param vector
         */
    }, {
        key: 'panToward',
        value: function panToward(vector) {
            var maxIncrement = this.panSpeed;
            this.forAllLoops(function (loop) {
                var target = loop._target;
                target.x = target.x + Math.max(Math.min((vector.x - target.x) / 100, maxIncrement), -maxIncrement);
                target.y = target.y + Math.max(Math.min((vector.y - target.y) / 100, maxIncrement), -maxIncrement);
                target.z = target.z + Math.max(Math.min((vector.z - target.z) / 100, maxIncrement), -maxIncrement);
                loop.camera.lookAt(target);
            });
        }

        /**
         * incrementally move the camera to the vector
         * @param vector
         */
    }, {
        key: 'moveToward',
        value: function moveToward(vector) {
            var maxIncrement = this.moveSpeed;
            this.forAllLoops(function (loop) {
                var position = loop.camera.position;
                position.x += Math.max(Math.min(vector.x - position.x, maxIncrement), -maxIncrement);
                position.y += Math.max(Math.min(vector.y - position.y, maxIncrement), -maxIncrement);
                position.z += Math.max(Math.min(vector.z - position.z, maxIncrement), -maxIncrement);
            });
        }

        /**
         * setting a target will cause the camera to pan toward it using the pan method above
         * @param vector
         * @param panSpeed
         */
    }, {
        key: 'setLookTarget',
        value: function setLookTarget(vector, panSpeed) {
            this.forAllLoops(function (loop) {
                loop.panSpeed = panSpeed || 0.9;
                loop.panning = vector !== AHEAD;
                loop.target = vector;
            });
        }

        /**
         * setting a target will cause the camera to move toward it using the incremental method above
         * @param vector
         * @param moveSpeed
         */
    }, {
        key: 'setMoveTarget',
        value: function setMoveTarget(vector, moveSpeed) {
            this.forAllLoops(function (loop) {
                loop.moveSpeed = moveSpeed || 0.7;
                loop.moveTarget = vector;
            });
        }
    }, {
        key: 'resetCamera',
        value: function resetCamera() {
            this.setLookTarget(AHEAD, 1.5);
            this.setMoveTarget(INITIAL_POSITION, 0.35);
        }
    }, {
        key: 'moveCamera',
        value: function moveCamera(x, y, z) {
            if (typeof x === 'object') {
                return this.moveCamera(x.x, x.y, x.z);
            }
            this.forAllLoops(function (loop) {
                loop.camera.position.x = x;
                loop.camera.position.y = y;
                loop.camera.position.z = z;
            });
        }

        /**
         * execute the function on all loops
         * @param fn {Function}
         */
    }, {
        key: 'forAllLoops',
        value: function forAllLoops(fn) {
            if (this.background) {
                fn(this.background);
            }
            if (this.foreground) {
                fn(this.foreground);
            }
            fn(this);
        }
    }, {
        key: 'test',
        value: function test() {
            var ball = new _meshBall.Ball();
            window.Ball = _meshBall.Ball;
            window.ball = ball;
            ball.setType('4-seam');
            //with (ball.mesh.rotation) {x=0,y=0,z=0}; ball.rotation = {x:0.00, y:0.00};
            ball.animate = function () {
                ball.rotate();
            };
            ball.join(this);
            // Baseball.service.Animator.loop.test();
        }
    }, {
        key: 'testTrajectory',
        value: function testTrajectory(data) {
            var ball = new _meshBall.Ball();
            window.Ball = _meshBall.Ball;
            window.ball = ball;
            ball.deriveTrajectory(data || {
                splay: -35,
                travelDistance: 135,
                flyAngle: -15,
                x: 100,
                y: 100
            }, {
                x: 0, y: 0
            });
            ball.join(this);
        }
    }]);

    return Loop;
})();

var HEIGHT = 700;
Loop.VERTICAL_CORRECTION = VERTICAL_CORRECTION;
Loop.prototype.THREE = {};
Loop.prototype.constructors = {
    Ball: _meshBall.Ball,
    Mound: _meshMound.Mound,
    Field: _meshField.Field
};

exports.Loop = Loop;

},{"./mesh/Ball":11,"./mesh/Base":12,"./mesh/BattersEye":13,"./mesh/Field":14,"./mesh/Grass":15,"./mesh/HomeDirt":16,"./mesh/Mound":18,"./mesh/Wall":19,"./scene/lighting":20}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Loop = require('../Loop');

/**
 * Each class should adhere to this pattern.
 * When a scene object has been positioned correctly and its trajectory set,
 * it should use ::join to attach itself to the scene.
 *
 * While attached, the animate method will be called on each frame.
 * Typically the animate method can run through the trajectory queue and then
 * detach itself. @see Ball
 *
 * For static meshes the animate method will do nothing, leaving the mesh permanently attached.
 */

var AbstractMesh = (function () {
    function AbstractMesh() {
        _classCallCheck(this, AbstractMesh);
    }

    /**
     * since we are using (0, 0, 0) vector for the center of the strike zone, the actual ground level will be offset
     * downward
     * @type {number}
     */

    _createClass(AbstractMesh, [{
        key: 'attach',

        /**
         * attach and detach should be used to maintain the correct object list
         * todo use the built in object list of the scene object
         */
        value: function attach() {
            var objects = this.loop.objects;
            if (objects.indexOf(this) === -1) {
                objects.push(this);
            }
            this.loop.scene.add(this.mesh);
        }
    }, {
        key: 'detach',
        value: function detach() {
            var objects = this.loop.objects;
            var index = objects.indexOf(this);
            if (index !== -1) {
                this.loop.objects.splice(index, 1);
            }
            this.loop.scene.remove(this.mesh);
        }
    }, {
        key: 'join',
        value: function join(loop) {
            this.loop = loop || this.loop;
            if (this.loop instanceof _Loop.Loop) {
                this.attach();
            }
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return AbstractMesh;
})();

AbstractMesh.WORLD_BASE_Y = -7;

exports.AbstractMesh = AbstractMesh;

},{"../Loop":9}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var _baseballServicesMathinator = require('baseball/Services/Mathinator');

var _Indicator = require('./Indicator');

var _baseballUtilityHelper = require('baseball/Utility/helper');

/**
 * on the DOM the pitch zone is 200x200 pixels
 * here we scale the strike zone to 4.2 units (feet)
 * for display purposes. It is only approximately related to actual pitch zone dimensions.
 * @type {number}
 */
var SCALE = 2.1 / 100;

var INDICATOR_DEPTH = -5;

var Ball = (function (_AbstractMesh) {
    _inherits(Ball, _AbstractMesh);

    /**
     *
     * @param loop
     * @param trajectory {Array<Vector3>} incremental vectors applied each frame
     * e.g. for 1 second of flight time there should be 60 incremental vectors
     */

    function Ball(loop, trajectory) {
        _classCallCheck(this, Ball);

        _get(Object.getPrototypeOf(Ball.prototype), 'constructor', this).call(this);
        if (!(loop instanceof _Loop.Loop) && loop instanceof Array) {
            trajectory = loop;
        }
        this.hasIndicator = false;
        this.trajectory = trajectory ? trajectory : [];
        this.breakingTrajectory = [];
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
        this.setType('4-seam', 1);
        this.bounce = 1;
    }

    _createClass(Ball, [{
        key: 'getMesh',
        value: function getMesh() {
            /** @see threex.sportballs */
            var baseURL = 'public/';
            var THREE = window.THREE;
            var loader = new THREE.TextureLoader();
            var textureColor = loader.load(baseURL + 'images/BaseballColor.jpg');
            var textureBump = loader.load(baseURL + 'images/BaseballBump.jpg');
            var geometry = new THREE.SphereGeometry(0.5, 32, 16);
            var material = new THREE.MeshPhongMaterial({
                map: textureColor,
                bumpMap: textureBump,
                bumpScale: 0.01
            });
            this.mesh = new THREE.Mesh(geometry, material);
            return this.mesh;
        }

        /**
         * Leave an indicator when crossing the home plate front plane,
         * and rotate while moving (default 1000 RPM)
         */
    }, {
        key: 'animate',
        value: function animate() {
            var frame = this.trajectory.shift(),
                pos = this.mesh.position;

            if (frame) {
                pos.x += frame.x;
                pos.y += frame.y * this.bounce;
                pos.z += frame.z;
                if (pos.y < _AbstractMesh2.AbstractMesh.WORLD_BASE_Y) {
                    this.bounce *= -1;
                }
            }
            if (pos.z > INDICATOR_DEPTH && !this.hasIndicator) {
                this.spawnIndicator();
            }
            if (frame.x + frame.y + frame.z !== 0) {
                this.rotate();
            }
            if (!this.trajectory.length) {
                this.detach();
                this.loop.resetCamera();
            }
        }
    }, {
        key: 'setType',
        value: function setType(type, handednessScalar) {
            var rpm = _baseballUtilityHelper.helper.pitchDefinitions[type][4];
            var rotationAngle = _baseballUtilityHelper.helper.pitchDefinitions[type][3];
            this.setRotation(rpm, rotationAngle * (handednessScalar || 1));
        }
    }, {
        key: 'rotate',
        value: function rotate() {
            var rotation = this.rotation;
            var meshRotation = this.mesh.rotation;
            meshRotation.x += rotation.x;
            meshRotation.y += rotation.y;
        }
    }, {
        key: 'setRotation',
        value: function setRotation(rpm, rotationAngle) {
            this.RPM = rpm;
            this.RPS = this.RPM / 60;
            var rotationalIncrement = this.RP60thOfASecond = this.RPS / 60;

            // calculate rotational components
            // +x is CCW along x axis increasing
            // +y is CW along y axis increasing
            // +z (unused) is CW along z axis increasing

            // 0   --> x:1 y:0
            // 45  --> x:+ y:+
            // 90  --> x:0 y:1
            // 180 --> x:-1 y:0

            var xComponent = rotationalIncrement * Math.cos(rotationAngle / 180 * Math.PI);
            var yComponent = rotationalIncrement * Math.sin(rotationAngle / 180 * Math.PI);

            this.rotation = {
                x: xComponent * 360 * Math.PI / 180,
                y: yComponent * 360 * Math.PI / 180
            };
        }
    }, {
        key: 'exportPositionTo',
        value: function exportPositionTo(mesh) {
            mesh.position.x = this.mesh.position.x;
            mesh.position.y = this.mesh.position.y;
            mesh.position.z = this.mesh.position.z;
        }
    }, {
        key: 'spawnIndicator',
        value: function spawnIndicator() {
            if (this.hasIndicator) {
                return;
            }
            this.hasIndicator = true;
            var indicator = new _Indicator.Indicator();
            indicator.mesh.position.x = this.mesh.position.x;
            indicator.mesh.position.y = this.mesh.position.y;
            indicator.mesh.position.z = this.mesh.position.z;
            indicator.join(this.loop.background);
        }
    }, {
        key: 'derivePitchingTrajectory',
        value: function derivePitchingTrajectory(game) {
            this.setType(game.pitchInFlight.name, game.pitcher.throws === 'right' ? 1 : -1);
            var top = 200 - game.pitchTarget.y,
                left = game.pitchTarget.x,
                breakTop = 200 - game.pitchInFlight.y,
                breakLeft = game.pitchInFlight.x,
                flightTime = _baseballServicesMathinator.Mathinator.getFlightTime(game.pitchInFlight.velocity, _baseballUtilityHelper.helper.pitchDefinitions[game.pitchInFlight.name][2]);

            var scale = SCALE;
            var origin = {
                x: game.pitcher.throws == 'left' ? 1.5 : -1.5,
                y: _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 6,
                z: -60.5 // mound distance
            };
            this.mesh.position.x = origin.x;
            this.mesh.position.y = origin.y;
            this.mesh.position.z = origin.z;

            var ARC_APPROXIMATION_Y_ADDITIVE = 38; // made up number
            var terminus = {
                x: (left - 100) * scale,
                y: (100 - top + 2 * ARC_APPROXIMATION_Y_ADDITIVE) * scale + _Loop.Loop.VERTICAL_CORRECTION,
                z: INDICATOR_DEPTH
            };
            var breakingTerminus = {
                x: (breakLeft - 100) * scale,
                y: (100 - breakTop) * scale + _Loop.Loop.VERTICAL_CORRECTION,
                z: INDICATOR_DEPTH
            };

            var lastPosition = {
                x: origin.x, y: origin.y, z: origin.z
            },
                lastBreakingPosition = {
                x: origin.x, y: origin.y, z: origin.z
            };

            var frames = [],
                breakingFrames = [],
                frameCount = flightTime * 60 | 0,
                counter = frameCount * 1.08 | 0,
                frame = 0;

            var xBreak = breakingTerminus.x - terminus.x,
                yBreak = breakingTerminus.y - terminus.y;
            var breakingDistance = Math.sqrt(Math.pow(xBreak, 2) + Math.pow(yBreak, 2));
            /**
             * @type {number} 1.0+, an expression of how late the pitch breaks
             */
            var breakingLateness = breakingDistance / (2 * ARC_APPROXIMATION_Y_ADDITIVE) / scale,
                breakingLatenessMomentumExponent = 0.2 + Math.pow(0.45, breakingLateness);

            while (counter--) {
                var progress = ++frame / frameCount;

                // linear position
                var position = {
                    x: origin.x + (terminus.x - origin.x) * progress,
                    y: origin.y + (terminus.y - origin.y) * progress,
                    z: origin.z + (terminus.z - origin.z) * progress
                };
                // linear breaking position
                var breakingInfluencePosition = {
                    x: origin.x + (breakingTerminus.x - origin.x) * progress,
                    y: origin.y + (breakingTerminus.y - origin.y) * progress,
                    z: origin.z + (breakingTerminus.z - origin.z) * progress
                };
                if (progress > 1) {
                    momentumScalar = 1 - Math.pow(progress, breakingLateness);
                } else {
                    var momentumScalar = Math.pow(1 - progress, breakingLatenessMomentumExponent);
                }
                var breakingScalar = 1 - momentumScalar,
                    scalarSum = momentumScalar + breakingScalar;
                // adjustment toward breaking ball position
                var breakingPosition = {
                    x: (position.x * momentumScalar + breakingInfluencePosition.x * breakingScalar) / scalarSum,
                    y: (position.y * momentumScalar + breakingInfluencePosition.y * breakingScalar) / scalarSum,
                    z: (position.z * momentumScalar + breakingInfluencePosition.z * breakingScalar) / scalarSum
                };
                var increment = {
                    x: position.x - lastPosition.x,
                    y: position.y - lastPosition.y,
                    z: position.z - lastPosition.z
                };
                var breakingIncrement = {
                    x: breakingPosition.x - lastBreakingPosition.x,
                    y: breakingPosition.y - lastBreakingPosition.y,
                    z: breakingPosition.z - lastBreakingPosition.z
                };

                lastPosition = position;
                lastBreakingPosition = breakingPosition;

                breakingFrames.push(breakingIncrement);
                frames.push(increment);
            }

            var pause = 60;
            while (pause--) {
                breakingFrames.push({ x: 0, y: 0, z: 0 });
                frames.push({ x: 0, y: 0, z: 0 });
            }

            this.breakingTrajectory = breakingFrames;
            this.trajectory = frames;
            return frames;
        }
    }, {
        key: 'deriveTrajectory',
        value: function deriveTrajectory(result, pitch) {
            var dragScalarApproximation = {
                distance: 1,
                apexHeight: 0.57,
                airTime: 0.96
            };

            var flyAngle = result.flyAngle,
                distance = Math.abs(result.travelDistance),
                scalar = result.travelDistance < 0 ? -1 : 1,
                flightScalar = flyAngle < 7 ? -1 : 1,
                splay = result.splay; // 0 is up the middle

            if (flightScalar < 0 && result.travelDistance > 0) {
                distance = Math.max(90, distance);
            }

            flyAngle = 1 + Math.abs(flyAngle); // todo why plus 1?
            if (flyAngle > 90) flyAngle = 180 - flyAngle;

            // velocity in m/s, I think
            var velocity = dragScalarApproximation.distance * Math.sqrt(9.81 * distance / Math.sin(2 * Math.PI * flyAngle / 180));
            var velocityVerticalComponent = Math.sin(_baseballServicesMathinator.Mathinator.RADIAN * flyAngle) * velocity;
            // in feet
            var apexHeight = velocityVerticalComponent * velocityVerticalComponent / (2 * 9.81) * dragScalarApproximation.apexHeight;
            // in seconds
            var airTime = 1.5 * Math.sqrt(2 * apexHeight / 9.81) * dragScalarApproximation.airTime; // 2x freefall equation

            var scale = SCALE;

            var origin = {
                x: pitch.x + result.x - 100,
                y: pitch.y + result.y - 100,
                z: 0
            };

            this.mesh.position.x = origin.x * scale;
            this.mesh.position.y = origin.y * scale;
            this.mesh.position.z = origin.z;

            var extrema = {
                x: Math.sin(splay / 180 * Math.PI) * distance,
                y: apexHeight,
                z: -Math.cos(splay / 180 * Math.PI) * distance
            };

            var frames = [],
                frameCount = airTime * 60 | 0,
                counter = frameCount,
                frame = 0;

            var lastHeight = 0;

            while (counter--) {
                var progress = ++frame / frameCount,
                    percent = progress * 100;

                // this equation is approximate
                if (flightScalar < 0) {
                    var currentDistance = progress * distance;
                    y = (origin.y * scale + apexHeight * Math.abs(Math.sin(3 * Math.pow(currentDistance, 1.1) / distance * Math.PI / 2))) * ((100 - percent) / 100) + _AbstractMesh2.AbstractMesh.WORLD_BASE_Y * progress;
                } else {
                    var y = apexHeight - Math.pow(Math.abs(50 - percent) / 50, 2) * apexHeight;
                }

                frames.push({
                    x: extrema.x / frameCount,
                    y: y - lastHeight,
                    z: extrema.z / frameCount
                });

                lastHeight = y;
            }
            this.trajectory = frames;
            return frames;
        }
    }]);

    return Ball;
})(_AbstractMesh2.AbstractMesh);

Ball.prototype.DEFAULT_RPM = 1000;
Ball.prototype.RPM = 1000;
Ball.prototype.RPS = 1000 / 60;
Ball.prototype.RP60thOfASecond = 1000 / 60 / 60;
Ball.prototype.rotation = {
    x: Ball.prototype.RP60thOfASecond * 360 * Math.PI / 180, // in radians per 60th of a second
    y: Ball.prototype.RP60thOfASecond * 360 * Math.PI / 180
};

exports.Ball = Ball;

},{"../Loop":9,"./AbstractMesh":10,"./Indicator":17,"baseball/Services/Mathinator":24,"baseball/Utility/helper":32}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Base = (function (_AbstractMesh) {
    _inherits(Base, _AbstractMesh);

    function Base(loop, base) {
        _classCallCheck(this, Base);

        _get(Object.getPrototypeOf(Base.prototype), 'constructor', this).call(this);
        this.base = base;
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Base, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0xFFFFFF
            });

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 3, 8, 8, 8), material);

            mesh.rotation.x = -0 / 180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 0 / 180 * Math.PI;

            switch (this.base) {
                case 'first':
                    mesh.position.x = 64;
                    mesh.position.z = -64;
                    break;
                case 'second':
                    mesh.position.x = 0;
                    mesh.position.z = -121;
                    break;
                case 'third':
                    mesh.position.x = -64;
                    mesh.position.z = -64;
                    break;
                case 'home':
                    mesh.position.x = 0;
                    mesh.position.z = 0;

                    mesh.rotation.z = 0;
            }
            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 0.5;
            mesh.position.z -= 0;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return Base;
})(_AbstractMesh2.AbstractMesh);

exports.Base = Base;

},{"../Loop":9,"./AbstractMesh":10}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var BattersEye = (function (_AbstractMesh) {
    _inherits(BattersEye, _AbstractMesh);

    function BattersEye(loop) {
        _classCallCheck(this, BattersEye);

        _get(Object.getPrototypeOf(BattersEye.prototype), 'constructor', this).call(this);
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(BattersEye, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0x3F4045
            });

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(200, 45, 4, 16, 16, 16), material);

            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 0;
            mesh.position.z -= 310;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return BattersEye;
})(_AbstractMesh2.AbstractMesh);

exports.BattersEye = BattersEye;

},{"../Loop":9,"./AbstractMesh":10}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Field = (function (_AbstractMesh) {
    _inherits(Field, _AbstractMesh);

    function Field(loop) {
        _classCallCheck(this, Field);

        _get(Object.getPrototypeOf(Field.prototype), 'constructor', this).call(this);
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Field, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0xDCB096
            });

            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(155, 155, 32, 32), material);

            mesh.rotation.x = -90 / 180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 45 / 180 * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y;
            mesh.position.z = -102;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return Field;
})(_AbstractMesh2.AbstractMesh);

exports.Field = Field;

},{"../Loop":9,"./AbstractMesh":10}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Grass = (function (_AbstractMesh) {
    _inherits(Grass, _AbstractMesh);

    function Grass(loop, infield) {
        _classCallCheck(this, Grass);

        _get(Object.getPrototypeOf(Grass.prototype), 'constructor', this).call(this);
        this.infield = infield;
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Grass, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: this.infield ? 0x70934A : 0x476532
            });

            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.infield ? 80 : 8000, this.infield ? 80 : 8000, 16, 16), material);

            if (this.infield) {
                mesh.rotation.x = -90 / 180 * Math.PI;
                mesh.rotation.y = 0;
                mesh.rotation.z = 45 / 180 * Math.PI;

                mesh.position.x = 0;
                mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 0.2;
                mesh.position.z = -62;
            } else {
                mesh.rotation.x = -90 / 180 * Math.PI;
                mesh.rotation.y = 0;
                mesh.rotation.z = 45 / 180 * Math.PI;

                mesh.position.x = 0;
                mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y - 0.2;
                mesh.position.z = -570;
            }

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return Grass;
})(_AbstractMesh2.AbstractMesh);

exports.Grass = Grass;

},{"../Loop":9,"./AbstractMesh":10}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var HomeDirt = (function (_AbstractMesh) {
    _inherits(HomeDirt, _AbstractMesh);

    function HomeDirt(loop) {
        _classCallCheck(this, HomeDirt);

        _get(Object.getPrototypeOf(HomeDirt.prototype), 'constructor', this).call(this);
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(HomeDirt, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0xDCB096
            });

            var mesh = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 16, 16), material);

            mesh.rotation.x = -90 / 180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 45 / 180 * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y;
            mesh.position.z = 0;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return HomeDirt;
})(_AbstractMesh2.AbstractMesh);

exports.HomeDirt = HomeDirt;

},{"../Loop":9,"./AbstractMesh":10}],17:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Indicator = (function (_AbstractMesh) {
    _inherits(Indicator, _AbstractMesh);

    function Indicator(loop) {
        _classCallCheck(this, Indicator);

        _get(Object.getPrototypeOf(Indicator.prototype), 'constructor', this).call(this);
        var n = 60;
        this.trajectory = [];
        while (n--) {
            this.trajectory.push(1);
        }
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Indicator, [{
        key: 'getMesh',
        value: function getMesh() {
            var THREE = window.THREE;
            var geometry = new THREE.CircleGeometry(0.34, 32);
            var material = new THREE.MeshPhongMaterial({
                color: 0xFFFFFF
            });
            this.mesh = new THREE.Mesh(geometry, material);
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {
            this.trajectory.shift();

            if (!this.trajectory.length) {
                this.detach();
            }
        }
    }]);

    return Indicator;
})(_AbstractMesh2.AbstractMesh);

exports.Indicator = Indicator;

},{"../Loop":9,"./AbstractMesh":10}],18:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Mound = (function (_AbstractMesh) {
    _inherits(Mound, _AbstractMesh);

    function Mound(loop) {
        _classCallCheck(this, Mound);

        _get(Object.getPrototypeOf(Mound.prototype), 'constructor', this).call(this);
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Mound, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0xDCB096
            });

            var mesh = new THREE.Mesh(new THREE.CircleGeometry(9), material);

            mesh.rotation.x = -90 / 180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 45 / 180 * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 0.9;
            mesh.position.z = -60.5;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return Mound;
})(_AbstractMesh2.AbstractMesh);

exports.Mound = Mound;

},{"../Loop":9,"./AbstractMesh":10}],19:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _AbstractMesh2 = require('./AbstractMesh');

var _Loop = require('../Loop');

var Wall = (function (_AbstractMesh) {
    _inherits(Wall, _AbstractMesh);

    function Wall(loop, angle) {
        _classCallCheck(this, Wall);

        _get(Object.getPrototypeOf(Wall.prototype), 'constructor', this).call(this);
        this.angle = angle;
        this.getMesh();
        if (loop instanceof _Loop.Loop) {
            this.join(loop);
        }
    }

    _createClass(Wall, [{
        key: 'getMesh',
        value: function getMesh() {
            var material = new THREE.MeshLambertMaterial({
                color: 0x3F4045
            });

            var mesh = new THREE.Mesh(new THREE.BoxGeometry(120, 15 | 0, 4, 16, 16, 16), material);

            var radians = this.angle / 180 * Math.PI;
            mesh.rotation.y = -radians;

            var hypotenuse = 320;
            var distance = Math.cos(radians) * hypotenuse;
            var offset = Math.sin(radians) * hypotenuse;

            mesh.position.x += offset;
            mesh.position.y = _AbstractMesh2.AbstractMesh.WORLD_BASE_Y + 0;
            mesh.position.z -= distance;

            this.mesh = mesh;
            return this.mesh;
        }
    }, {
        key: 'animate',
        value: function animate() {}
    }]);

    return Wall;
})(_AbstractMesh2.AbstractMesh);

exports.Wall = Wall;

},{"../Loop":9,"./AbstractMesh":10}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var lighting = {
    addTo: function addTo(scene) {
        var light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0);
        scene.add(light);
        var sun = new THREE.DirectionalLight(0xffffbb, 0.45);
        light.position.set(-1, 1, 1);
        this.light = light;
        this.sun = sun;
        scene.add(sun);
    },
    setLuminosity: function setLuminosity(level) {
        this.light.intensity = level;
        this.sun.intensity = level / 2;
    }
};

exports.lighting = lighting;

},{}],21:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballServices_services = require('baseball/services/_services');

var _baseballRenderLoop = require('baseball/Render/Loop');

var _baseballUtilityHelper = require('baseball/Utility/helper');

var Animator = function Animator() {
    this.init();
    throw new Error('No need to instantiate Animator');
};
Animator.TweenMax = {};
Animator.prototype = {
    identifier: 'Animator',
    constructor: Animator,
    /**
     * console mode disables most animator functions
     */
    console: false,
    TweenMax: {},
    THREE: {},
    /**
     * anything other than webgl will use TweenMax for JS animations
     */
    renderingMode: 'webgl',
    init: function init() {
        if (Animator.console) return;
        if (!this.loop && this.renderingMode === 'webgl') {
            this.beginRender();
        }
    },
    /**
     * @returns {Loop}
     */
    beginRender: function beginRender() {
        this.loop = new _baseballRenderLoop.Loop('webgl-container');
        this.background = new _baseballRenderLoop.Loop('webgl-bg-container');
        this.background.addStaticMeshes();

        this.loop.background = this.background;
        this.background.foreground = this.loop;

        return this.loop;
    },
    /**
     * @param level {Number} 0 to 1
     */
    setLuminosity: function setLuminosity(level) {
        if (this.console) return;
        this.loop.lighting.setLuminosity(level);
        this.background.lighting.setLuminosity(level);
    },
    loadTweenMax: function loadTweenMax() {
        if (this.console || typeof window !== 'object') {
            Animator.TweenMax = {
                'set': function set() {},
                'to': function to() {},
                'from': function from() {},
                killAll: function killAll() {}
            };
        } else {
            Animator.TweenMax = window.TweenMax;
        }
        return Animator.TweenMax;
    },
    TIME_FROM_SET: 2300, //ms
    TIME_FROM_WINDUP: 3600, //ms
    HOLD_UP_ALLOWANCE: 0.75, // seconds
    pitchTarget: null,
    pitchBreak: null,
    /**
     * this is called with $scope context binding
     * @param callback
     */
    updateFlightPath: function updateFlightPath(callback) {
        if (Animator.console) return;

        if (Animator.renderingMode === 'webgl') {
            return Animator.renderFlightPath(callback, this);
        }
        return Animator.tweenFlightPath(callback, this);
    },
    /**
     * @param callback
     * @param $scope
     * animates the pitch's flight path
     */
    tweenFlightPath: function tweenFlightPath(callback, $scope) {
        var TweenMax = Animator.loadTweenMax();
        TweenMax.killAll();
        var game = $scope.y,
            top = 200 - game.pitchTarget.y,
            left = game.pitchTarget.x,
            breakTop = 200 - game.pitchInFlight.y,
            breakLeft = game.pitchInFlight.x,
            $baseballs = $('.baseball'),
            flightSpeed = 1.3 - 0.6 * (game.pitchInFlight.velocity + 300) / 400,
            originTop = 50,
            originLeft = 110 + (game.pitcher.throws == 'left' ? 20 : -20);
        var pitch = this.pitchTarget = $('.main-area .target .baseball.pitch'),
            henka = this.pitchBreak = $('.main-area .target .baseball.break'),
            quarter = flightSpeed / 4;

        var pitchTransition = _baseballServices_services.Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 12, 4),
            targetTransition = _baseballServices_services.Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 10, 3);

        var transitions = [pitchTransition(0, 0), pitchTransition(10, 0), pitchTransition(30, 1), pitchTransition(50, 2), targetTransition(100, 3), pitchTransition(100, 3, breakTop, breakLeft)];

        TweenMax.set([pitch, henka], transitions[0]);
        TweenMax.to([pitch, henka], quarter, transitions[1]);
        TweenMax.to([pitch, henka], quarter, transitions[2]);
        TweenMax.to([pitch, henka], quarter, transitions[3]);
        TweenMax.to(pitch, quarter, transitions[4]);
        TweenMax.to(henka, quarter, transitions[5]);

        $scope.lastTimeout = setTimeout(function () {
            $scope.allowInput = true;
            if (typeof callback == 'function') {
                callback();
                $scope.$apply();
            }
        }, flightSpeed * 1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting() && Math.random() * 180 > game.batter.skill.offense.eye) {
                $('.baseball.break').addClass('hide');
            } else {
                $('.baseball.break').removeClass('hide');
            }
            $('.baseball.pitch').removeClass('hide');
        }

        if (game.humanBatting() && !game.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(function () {
                $scope.holdUp();
            }, (flightSpeed + Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param callback
     * @param $scope Angular scope
     * webgl version of tweenFlightPath
     */
    renderFlightPath: function renderFlightPath(callback, $scope) {
        var TweenMax = Animator.loadTweenMax();
        TweenMax.killAll();
        var game = $scope.y,
            flightSpeed = _baseballServices_services.Mathinator.getFlightTime(game.pitchInFlight.velocity, _baseballUtilityHelper.helper.pitchDefinitions[game.pitchInFlight.name][2]);

        if (!this.loop) {
            this.beginRender();
        }
        var ball = new this.loop.constructors.Ball();
        Animator._ball = ball;
        ball.derivePitchingTrajectory(game);
        ball.trajectory = ball.breakingTrajectory;
        ball.join(this.loop);

        $scope.lastTimeout = setTimeout(function () {
            $scope.allowInput = true;
            if (typeof callback === 'function') {
                callback();
                $scope.$apply();
            }
        }, flightSpeed * 1000);

        var $baseballs = $('.baseball');
        $baseballs.addClass('hide');

        if (game.humanBatting() && !game.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(function () {
                $scope.holdUp();
            }, (flightSpeed + Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param game
     * @returns {*}
     * This only animates the flight arc of the ball in play.
     */
    animateFieldingTrajectory: function animateFieldingTrajectory(game) {
        if (Animator.console) return game.swingResult;

        if (this.renderingMode === 'webgl') {
            Animator.tweenFieldingTrajectory(game, true);
            return Animator.renderFieldingTrajectory(game);
        }
        return Animator.tweenFieldingTrajectory(game);
    },
    /**
     * @param game
     * @param splayOnly
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * JS/CSS animation
     */
    tweenFieldingTrajectory: function tweenFieldingTrajectory(game, splayOnly) {
        var TweenMax = Animator.loadTweenMax();
        var ball = $('.splay-indicator-ball');
        TweenMax.killAll();
        var result = game.swingResult;

        var linearApproximateDragScalar = {
            distance: 1,
            apexHeight: 0.57,
            airTime: 0.96
        };

        var angle = result.flyAngle,
            distance = Math.abs(result.travelDistance),
            scalar = result.travelDistance < 0 ? -1 : 1;

        _baseballServices_services.Mathinator.memory.bounding = angle < 0;
        angle = 1 + Math.abs(angle);
        if (angle > 90) angle = 180 - angle;

        var velocity = linearApproximateDragScalar.distance * Math.sqrt(9.81 * distance / Math.sin(2 * Math.PI * angle / 180));
        var velocityVerticalComponent = Math.sin(_baseballServices_services.Mathinator.RADIAN * angle) * velocity;
        var apexHeight = velocityVerticalComponent * velocityVerticalComponent / (2 * 9.81) * linearApproximateDragScalar.apexHeight;
        var airTime = 1.5 * Math.sqrt(2 * apexHeight / 9.81) * linearApproximateDragScalar.airTime; // 2x freefall equation

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        var quarter = airTime / 4;
        var mathinator = new _baseballServices_services.Mathinator();
        var transitions = [mathinator.transitionalTrajectory(0, quarter, 0, apexHeight, scalar * distance, result.splay), mathinator.transitionalTrajectory(25, quarter, 0), mathinator.transitionalTrajectory(50, quarter, 1), mathinator.transitionalTrajectory(75, quarter, 2), mathinator.transitionalTrajectory(100, quarter, 3)];
        TweenMax.set(ball, transitions[0]);
        TweenMax.to(ball, quarter, transitions[1]);
        TweenMax.to(ball, quarter, transitions[2]);
        TweenMax.to(ball, quarter, transitions[3]);
        TweenMax.to(ball, quarter, transitions[4]);

        if (!splayOnly) {
            ball = $('.indicator.baseball.break').removeClass('hide').show();
            var time = quarter / 2;
            transitions = [mathinator.transitionalCatcherPerspectiveTrajectory(0, time, 0, apexHeight, scalar * distance, result.splay, game.pitchInFlight), mathinator.transitionalCatcherPerspectiveTrajectory(12.5, time * 0.75, 0), mathinator.transitionalCatcherPerspectiveTrajectory(25, time * 0.80, 1), mathinator.transitionalCatcherPerspectiveTrajectory(37.5, time * 0.85, 2), mathinator.transitionalCatcherPerspectiveTrajectory(50, time * 0.90, 3), mathinator.transitionalCatcherPerspectiveTrajectory(62.5, time * 0.95, 4), mathinator.transitionalCatcherPerspectiveTrajectory(75, time, 5), mathinator.transitionalCatcherPerspectiveTrajectory(87.5, time, 6), mathinator.transitionalCatcherPerspectiveTrajectory(100, time, 7)];
            TweenMax.set(ball, transitions[0]);
            TweenMax.to(ball, time, transitions[1]);
            TweenMax.to(ball, time, transitions[2]);
            TweenMax.to(ball, time, transitions[3]);
            TweenMax.to(ball, time, transitions[4]);
            TweenMax.to(ball, time, transitions[5]);
            TweenMax.to(ball, time, transitions[6]);
            TweenMax.to(ball, time, transitions[7]);
            TweenMax.to(ball, time, transitions[8]);

            setTimeout(function () {
                // hack
                $('.indicator.baseball.break').removeClass('hide').show();
            }, 50);
        }

        return game.swingResult;
    },
    /**
     * @param game
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * WebGL version of tweenFieldingTrajectory
     */
    renderFieldingTrajectory: function renderFieldingTrajectory(game) {
        if (!this.loop) {
            this.beginRender();
        }

        var ball = Animator._ball || new this.loop.constructors.Ball();
        ball.deriveTrajectory(game.swingResult, game.pitchInFlight);
        ball.join(this.loop);

        if (game.swingResult.travelDistance > 60 && Math.random() < 0.35) {
            this.loop.setLookTarget(ball.mesh.position, 0.5);
            if (Math.random() < 0.15 && game.swingResult.travelDistance > 90 || Math.random() < 0.35 && game.swingResult.travelDistance > 250) {
                var scale = 1;
                if (game.swingResult.splay > 0) {
                    scale = -1;
                }
                this.loop.setMoveTarget({
                    x: scale * 8, y: 16, z: 20
                }, 0.3);
            }
        }

        return game.swingResult;
    }
};

for (var fn in Animator.prototype) {
    if (Animator.prototype.hasOwnProperty(fn)) {
        Animator[fn] = Animator.prototype[fn];
    }
}

exports.Animator = Animator;

},{"baseball/Render/Loop":9,"baseball/Utility/helper":32,"baseball/services/_services":36}],22:[function(require,module,exports){
/**
 * For Probability!
 * @constructor
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var Distribution = function Distribution() {};

Distribution.prototype = {
    identifier: 'Distribution',
    constructor: Distribution,
    /**
     * @param scale {number}
     * @returns {number}
     */
    chance: function chance(scale) {
        if (!scale) scale = 1;
        return Math.random() * scale;
    },
    /**
     * @param fielder {Player}
     * @returns {boolean}
     */
    error: function error(fielder) {
        return (100 - fielder.skill.defense.fielding) * 0.40 + 4 > Math.random() * 100;
    },
    /**
     * @param power
     * @param flyAngle
     * @returns {number}
     */
    landingDistance: function landingDistance(power, flyAngle) {
        return (10 + power / 2 + Math.random() * 310 + power / 100 * 30) * (1 - Math.abs(flyAngle - 30) / 60);
    },
    /**
     * @returns {{x: number, y: number}}
     */
    pitchLocation: function pitchLocation() {
        var x, y;
        if (Math.random() < 0.5) {
            x = 50 + Math.floor(Math.random() * 70) - Math.floor(Math.random() * 15);
        } else {
            x = 150 + Math.floor(Math.random() * 15) - Math.floor(Math.random() * 70);
        }
        y = 30 + (170 - Math.floor(Math.sqrt(Math.random() * 28900)));
        return { x: x, y: y };
    },
    /**
     * swing centering basis
     * @returns {number}
     */
    centralizedNumber: function centralizedNumber() {
        return 100 + Math.floor(Math.random() * 15) - Math.floor(Math.random() * 15);
    },
    /**
     * @param eye {Player.skill.offense.eye}
     * @param x
     * @param y
     * @param umpire {Umpire}
     */
    swingLikelihood: function swingLikelihood(eye, x, y, umpire) {
        var swingLikelihood = (200 - Math.abs(100 - x) - Math.abs(100 - y)) / 2;
        if (x < 60 || x > 140 || y < 50 || y > 150) {
            // ball
            /** 138 based on avg O-Swing of 30% + 8% for fun, decreased by better eye */
            swingLikelihood = (swingLikelihood + 138 - eye) / 2 - 15 * umpire.count.balls;
        } else {
            /** avg Swing rate of 65% - 8% for laughs, increased by better eye */
            swingLikelihood = (57 + (2 * swingLikelihood + eye) / 3) / 2;
        }
        // higher late in the count
        return swingLikelihood - 35 + 2 * (umpire.count.balls + 8 * umpire.count.strikes);
    },
    /**
     * @param target {number} 0-200
     * @param control {number} 0-100
     * @returns {number}
     */
    pitchControl: function pitchControl(target, control) {
        var effect = (50 - Math.random() * 100) / (1 + control / 100);
        return Math.min(199.9, Math.max(0.1, target + effect));
    },
    /**
     * @param pitch {Game.pitchInFlight}
     * @param pitcher {Player}
     * @param x {number}
     * @param y {number}
     * @returns {object|{x: number, y: number}}
     * 0.5 to 1.5 of the pitch's nominal breaking effect X
     * 0.5 to 1.5 of the pitch's nominal breaking effect Y, magnified for lower Y
     */
    breakEffect: function breakEffect(pitch, pitcher, x, y) {
        var effect = {};
        effect.x = Math.floor(x + pitch.breakDirection[0] * (0.50 + 0.5 * Math.random() + pitcher.pitching[pitch.name]['break'] / 200));
        effect.y = Math.floor(y + pitch.breakDirection[1] * ((0.50 + 0.5 * Math.random() + pitcher.pitching[pitch.name]['break'] / 200) / (0.5 + y / 200)));
        return effect;
    },
    /**
     * Determine the swing target along an axis
     * @param target {number} 0-200
     * @param actual {number} 0-200
     * @param eye {number} 0-100
     * @returns {number} 0-200
     */
    cpuSwing: function cpuSwing(target, actual, eye) {
        eye = Math.min(eye, 100); // higher eye would overcompensate here
        return 100 + (target - 100) * (0.5 + Math.random() * eye / 200) - actual;
    },
    /**
     * Determine the swing scalar
     * @param eye {number} 0-100
     * @returns {number}
     */
    swing: function swing(eye) {
        return 100 / (eye + 25 + Math.random() * 50);
    }
};

for (var fn in Distribution.prototype) {
    if (Distribution.prototype.hasOwnProperty(fn)) {
        Distribution[fn] = Distribution.prototype[fn];
    }
}

Distribution.main = function () {
    var ump = {
        count: {
            balls: 0,
            strikes: 0
        }
    };
    while (ump.count.balls < 4) {
        while (ump.count.strikes < 3) {
            console.log('S', ump.count.strikes, 'B', ump.count.balls);
            console.log('middle', [15, 35, 55, 75, 95].map(function (x) {
                return Distribution.swingLikelihood(x, 100, 100, ump) | 0;
            }));
            console.log('corner', [15, 35, 55, 75, 95].map(function (x) {
                return Distribution.swingLikelihood(x, 50, 50, ump) | 0;
            }));
            console.log('ball', [15, 35, 55, 75, 95].map(function (x) {
                return Distribution.swingLikelihood(x, 15, 15, ump) | 0;
            }));
            ump.count.strikes++;
        }
        ump.count.balls++;
        ump.count.strikes = 0;
    }
};

exports.Distribution = Distribution;

},{}],23:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var Iterator = function Iterator() {};

Iterator.prototype = {
    identifier: 'Iterator',
    constructor: Iterator,
    each: function each(collection, map) {
        var keys, i;
        if (collection instanceof Array) {
            for (i = 0; i < collection.length; i++) {
                map(i, collection[i]);
            }
        } else {
            keys = Object.keys(collection);
            for (i = 0; i < keys.length; i++) {
                map(keys[i], collection[keys[i]]);
            }
        }
    }
};

for (var fn in Iterator.prototype) {
    if (Iterator.prototype.hasOwnProperty(fn)) {
        Iterator[fn] = Iterator.prototype[fn];
    }
}

exports.Iterator = Iterator;

},{}],24:[function(require,module,exports){
/**
 * For Math!
 * @constructor
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var Mathinator = function Mathinator() {};

/**
 * @param n
 * @returns {number}
 */
Mathinator.square = function (n) {
    return n * n;
};

Mathinator.prototype = {
    identifier: 'Mathinator',
    constructor: Mathinator,
    /**
     * CONST
     */
    RADIAN: Math.PI / 180,
    SPLAY_INDICATOR_LEFT: -4,
    /**
     * @param offset {{x: number, y: number}}
     * @param angle {number}
     * @returns {{x: number, y: number}}
     */
    getAngularOffset: function getAngularOffset(offset, angle) {
        var xScalar = offset.x < 0 ? -1 : 1,
            yScalar = offset.y < 0 ? -1 : 1;
        var originalAngle = Math.atan(offset.x / offset.y) / this.RADIAN;
        var distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y),
            angledY = yScalar * Math.cos((angle - originalAngle) * this.RADIAN) * distance,
            angledX = xScalar * Math.sqrt(distance * distance - angledY * angledY);
        return {
            x: angledX,
            y: angledY
        };
    },
    /**
     * @param a {Array<Number>}
     * @param b {Array<Number>}
     * @returns {number}
     */
    getPolarDistance: function getPolarDistance(a, b) {
        var radians = this.RADIAN;
        return Math.sqrt(a[1] * a[1] + b[1] * b[1] - 2 * a[1] * b[1] * Math.cos(a[0] * radians - b[0] * radians));
    },
    /**
     * @param origin
     * @param target
     * @returns {number}
     * 0 is flat (left-right), positive is clockwise.
     * We use 125 instead of 180 to account for natural hand-height adjustments
     * of various swing heights.
     */
    battingAngle: function battingAngle(origin, target) {
        return Math.atan((origin.y - target.y) / (target.x - origin.x)) / Math.PI * 125;
    },
    memory: {},
    /**
     * @param percent {number} 0-100
     * @param quarter {number} seconds
     * @param step {number} 0 and up
     * @param [givenApexHeight] feet
     * @param [givenDistance] in feet
     * @param [givenSplayAngle] where 0 is up the middle and 90 is right foul
     * @returns {{bottom: number, left: number, padding: number, borderWidth: number, delay: number, ease: (r.easeOut|*)}}
     */
    transitionalTrajectory: function transitionalTrajectory(percent, quarter, step, givenApexHeight, givenDistance, givenSplayAngle) {
        if (givenApexHeight) Mathinator.prototype.memory.apexHeight = givenApexHeight;
        if (givenDistance) Mathinator.prototype.memory.distance = givenDistance;
        if (givenSplayAngle) Mathinator.prototype.memory.splay = givenSplayAngle;
        var apexHeight = Mathinator.prototype.memory.apexHeight,
            distance = Mathinator.prototype.memory.distance,
            splay = Mathinator.prototype.memory.splay;
        var bottom, left, padding, borderWidth;
        var bounding = Mathinator.prototype.memory.bounding,
            radian = this.RADIAN;

        if (bounding) {
            quarter *= 4;
            percent = Math.floor(Math.sqrt(percent / 100) * 100);
        }

        bottom = Math.cos(splay * radian) * percent / 100 * distance * 95 / 300;
        left = Math.sin(splay * radian) * percent / 100 * distance * 95 / 300 + this.SPLAY_INDICATOR_LEFT;

        var apexRatio = Math.sqrt((50 - Math.abs(percent - 50)) / 100) * (1 / 0.7071);
        if (bounding) {
            padding = 1;
            borderWidth = 1;
        } else {
            padding = apexRatio * apexHeight / 90 * 15;
            borderWidth = 2 + apexRatio * 2;
        }
        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 100), -100);
        padding = Math.max(Math.min(padding, 12), 0);
        return {
            bottom: bottom,
            left: left,
            padding: padding,
            borderWidth: borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        };
    },
    /**
     * @param percent {number} 0-100
     * @param quarter {number} seconds
     * @param step {number} 0 and up
     * @param [givenApexHeight] feet
     * @param [givenDistance] in feet
     * @param [givenSplayAngle] where 0 is up the middle and 90 is right foul
     * @param [givenOrigin] Object with x, y -- pitchInFlight
     * @returns {{top: number, left: number, padding: number, borderWidth: number, delay: number, ease: (r.easeOut|*)}}
     */
    transitionalCatcherPerspectiveTrajectory: function transitionalCatcherPerspectiveTrajectory(percent, quarter, step, givenApexHeight, givenDistance, givenSplayAngle, givenOrigin) {
        var memory = Mathinator.prototype.memory;
        if (givenApexHeight) memory.apexHeight = givenApexHeight;
        if (givenDistance) memory.distance = givenDistance;
        if (givenSplayAngle) memory.splay = givenSplayAngle;
        if (givenOrigin) memory.origin = givenOrigin;
        var apexHeight = memory.apexHeight,
            distance = memory.distance,
            splay = memory.splay,
            origin = memory.origin;
        var top, left, padding, borderWidth;
        var bounding = Mathinator.prototype.memory.bounding,
            radian = this.RADIAN;

        if (bounding) {
            percent = Math.floor(Math.sqrt(percent / 100) * 100);
        }

        var height = apexHeight - Math.pow(Math.abs(50 - percent) / 50, 1.2) * apexHeight,
            currentDistance = distance * percent / 100;

        var projection = Math.pow((500 - currentDistance) / 500, 2); // reduction of dimensions due to distance

        top = 200 - origin.y - height * 20 * projection + percent / 100 * (origin.y - 85) * projection;
        left = origin.x + Math.sin(splay * radian) * (currentDistance * 8) * projection;
        padding = 12 * projection * projection;
        borderWidth = Math.max(Math.min(padding / 3, 4), 0);

        top = Math.max(Math.min(top, 500), -10000);
        left = Math.max(Math.min(left, 10000), -10000);
        padding = Math.max(Math.min(padding, 24), 1);

        //console.log('height', height|0, apexHeight|0, projection, 'left/pad/border', left|0, padding|0, borderWidth|0, 'top', top);

        return {
            top: top,
            left: left,
            padding: padding,
            borderWidth: borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        };
    },
    /**
     * @param swingResult
     * @returns {Game.swingResult}
     */
    translateSwingResultToStylePosition: function translateSwingResultToStylePosition(swingResult) {
        // CF HR bottom: 95px, centerline: left: 190px;
        var bottom, left;

        bottom = Math.cos(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95 / 300;
        left = Math.sin(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95 / 300 + this.SPLAY_INDICATOR_LEFT;

        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 100), -100);

        swingResult.bottom = bottom + 'px';
        swingResult.left = left + 'px';
        return swingResult;
    },
    /**
     * @param left {number} 0-200
     * @param top {number} 0-200
     * @param originLeft {number} 0-200
     * @param originTop {number} 0-200
     * @param quarter {number} seconds
     * @param maxPadding {number} px padding at full size
     * @param maxBorderWidth {number} px border width at full size
     * @returns {Function}
     */
    pitchTransition: function pitchTransition(top, left, originTop, originLeft, quarter, maxPadding, maxBorderWidth) {
        /**
         * @param percent {number} 0-100
         * @param step {number} 0 and up
         * @param [breakTop] {number} 0-200 override
         * @param [breakLeft] {number} 0-200 override
         * @returns {{top: number, left: number, padding: string, borderWidth: string, transform: string, delay: number, ease: *}}
         */
        return function (percent, step, breakTop, breakLeft) {
            var _top, _left;
            _top = breakTop || top;
            _left = breakLeft || left;
            _top = originTop + Mathinator.square(percent / 100) * (_top - originTop);
            if (step == 1) {
                _top -= 2;
            }
            if (step == 2) {
                _top -= 1;
            }
            _left = originLeft + Mathinator.square(percent / 100) * (_left - originLeft);
            var padding = Math.max(Mathinator.square(percent / 100) * maxPadding, 1),
                borderWidth = Math.max(Mathinator.square(percent / 100) * maxBorderWidth, 1);
            return {
                top: _top,
                left: _left,
                padding: padding + 'px',
                borderWidth: borderWidth + 'px',
                transform: 'translateZ(0)',
                delay: quarter * step,
                ease: Linear.easeNone
            };
        };
    },
    /**
     * @param distance {number} feet
     * @param throwing {number} 0-1
     * @param fielding {number} 0-1
     * @param intercept {number} approx. -140 to 140
     * @returns {number} seconds
     */
    fielderReturnDelay: function fielderReturnDelay(distance, throwing, fielding, intercept) {
        return distance / 90 // bip distance (up to 3s+)
         + 5 * (distance / 310) // worst case time to reach the ball,
         * Math.min(intercept - 120, 0) / -240 // a good intercept rating will cut the base down to 0
         + 1 - (0.2 + fielding * 0.8) // gather time (up to 0.8s)
         + distance / 90 / (0.5 + throwing / 2); // throwing distance (up to 2s)
    },
    /**
     * @param player {Player}
     * @returns {number} ~2.0
     */
    infieldThrowDelay: function infieldThrowDelay(player) {
        var fielding = player.skill.defense.fielding,
            throwing = player.skill.defense.throwing;
        return 3.5 - (fielding + throwing) / 200;
    },
    /**
     * @param speed {number} 0-100
     * @returns {number} seconds
     */
    baseRunningTime: function baseRunningTime(speed) {
        return 7.0 - speed / 100 * 4.1;
    },
    /**
     * @param x {Number} bat offset
     * @param y {Number} bat offset
     * @param angle {Number} batting angle where 0 is horizontal, RHB clockwise increasing
     * {
     *   splay: -90 to 90 where 0 is up the middle,
     *   fly: 0, flat, to 90, vertical pop up
     * }
     * @param eye {Number} 0 - 100 skill rating
     * @returns {{splay: number, fly: number}}
     */
    getSplayAndFlyAngle: function getSplayAndFlyAngle(x, y, angle, eye) {

        var splay = -2.5 * x - angle / 20 * y;
        var direction = splay > 0 ? 1 : -1;
        // additional timing splay
        splay += direction * Math.random() * 45 * (100 / (50 + eye));

        return {
            splay: splay,
            fly: -3 * y - angle / 35 * y
        };
    },
    /**
     * @param velocityRating {Number} 0-100
     * @param velocityScalar {Number} approx 1
     * @returns {number}
     */
    getFlightTime: function getFlightTime(velocityRating, velocityScalar) {
        return (1.3 - 0.6 * (velocityRating + 300) / 400) / velocityScalar;
    }
};

for (var fn in Mathinator.prototype) {
    if (Mathinator.prototype.hasOwnProperty(fn)) {
        Mathinator[fn] = Mathinator.prototype[fn];
    }
}

exports.Mathinator = Mathinator;

},{}],25:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseballServicesAnimator = require('baseball/Services/Animator');

var _baseballServicesDistribution = require('baseball/Services/Distribution');

var _baseballServicesIterator = require('baseball/Services/Iterator');

var _baseballServicesMathinator = require('baseball/Services/Mathinator');

exports.Animator = _baseballServicesAnimator.Animator;
exports.Distribution = _baseballServicesDistribution.Distribution;
exports.Iterator = _baseballServicesIterator.Iterator;
exports.Mathinator = _baseballServicesMathinator.Mathinator;

},{"baseball/Services/Animator":21,"baseball/Services/Distribution":22,"baseball/Services/Iterator":23,"baseball/Services/Mathinator":24}],26:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _TeamJapan = require('./TeamJapan');

var Provider = (function () {
    function Provider() {
        _classCallCheck(this, Provider);
    }

    _createClass(Provider, [{
        key: 'assignTeam',
        value: function assignTeam(game, team, side) {
            var special = this.teams[team];
            special.game = game;
            game.teams[side] = special;
        }
    }]);

    return Provider;
})();

Provider.prototype.teams = {
    TeamJapan: _TeamJapan.samurai
};

exports.Provider = Provider;

},{"./TeamJapan":27}],27:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballModel_models = require('baseball/Model/_models');

var _baseballModelPlayer = require('baseball/Model/Player');

var _baseballTeamsTrainer = require('baseball/Teams/Trainer');

var samurai = new _baseballModel_models.Team('no init');
samurai.name = 'Japan';
samurai.nameJ = '日本';

var darvish = new _baseballModelPlayer.Player(samurai),
    johjima = new _baseballModelPlayer.Player(samurai),
    ogasawara = new _baseballModelPlayer.Player(samurai),
    nishioka = new _baseballModelPlayer.Player(samurai),
    kawasaki = new _baseballModelPlayer.Player(samurai),
    murata = new _baseballModelPlayer.Player(samurai),
    matsui = new _baseballModelPlayer.Player(samurai),
    ichiro = new _baseballModelPlayer.Player(samurai),
    inaba = new _baseballModelPlayer.Player(samurai);

var matsuzaka = new _baseballModelPlayer.Player(samurai),
    fukudome = new _baseballModelPlayer.Player(samurai),
    aoki = new _baseballModelPlayer.Player(samurai),
    abe = new _baseballModelPlayer.Player(samurai),
    iwamura = new _baseballModelPlayer.Player(samurai);

var coach = new _baseballTeamsTrainer.Trainer();

coach.makePlayer(darvish, 'Yu', 'Darvish', 'ダルビッシュ', '有', 150, { eye: 80, power: 80, speed: 80 }, { catching: 50, fielding: 70, throwing: 100, speed: 80 }, 'right', 'right', 11);

coach.makePlayer(johjima, 'Kenji', 'Johjima', '城島', '健司', 60, { eye: 90, power: 88, speed: 70 }, { catching: 140, fielding: 95, throwing: 88, speed: 94 }, 'right', 'right', 2);

coach.makePlayer(ogasawara, 'Michihiro', 'Ogasawara', '小笠原', '道大', 80, { eye: 96, power: 115, speed: 90 }, { catching: 50, fielding: 96, throwing: 85, speed: 70 }, 'left', 'right', 36);

coach.makePlayer(nishioka, 'Tsuyoshi', 'Nishioka', '西岡', '剛', 80, { eye: 88, power: 75, speed: 92 }, { catching: 90, fielding: 88, throwing: 88, speed: 90 }, 'right', 'right', 7);

coach.makePlayer(kawasaki, 'Munenori', 'Kawasaki', '川崎', '宗則', 80, { eye: 95, power: 75, speed: 92 }, { catching: 90, fielding: 98, throwing: 90, speed: 110 }, 'left', 'right', 52);

coach.makePlayer(murata, 'Shuichi', 'Murata', '村田', '修一', 80, { eye: 82, power: 110, speed: 60 }, { catching: 80, fielding: 80, throwing: 90, speed: 90 }, 'right', 'right', 25);

coach.makePlayer(matsui, 'Hideki', 'Matsui', '秀樹', '松井', 75, { eye: 104, power: 130, speed: 68 }, { catching: 40, fielding: 85, throwing: 70, speed: 60 }, 'left', 'right', 55);

coach.makePlayer(ichiro, 'Ichiro', 'Suzuki', 'イチロー', '', 115, { eye: 115, power: 48, speed: 99 }, { catching: 80, fielding: 110, throwing: 135, speed: 120 }, 'left', 'right', 51);

coach.makePlayer(inaba, 'Atsunori', 'Inaba', '稲葉', '篤紀', 80, { eye: 92, power: 95, speed: 75 }, { catching: 50, fielding: 95, throwing: 95, speed: 90 }, 'right', 'right', 41);

samurai.bench = [darvish, johjima, ogasawara, nishioka, kawasaki, murata, matsui, ichiro, inaba, matsuzaka, fukudome, aoki, abe, iwamura];
samurai.manager.makeLineup();
samurai.positions = {
    pitcher: darvish,
    catcher: johjima,

    first: ogasawara,
    second: nishioka,
    short: kawasaki,
    third: murata,

    left: matsui,
    center: ichiro,
    right: inaba
};

for (var position in samurai.positions) {
    if (samurai.positions.hasOwnProperty(position)) {
        samurai.positions[position].position = position;
    }
}

samurai.lineup = [ichiro, kawasaki, inaba, matsui, ogasawara, johjima, murata, nishioka, darvish];

samurai.lineup.map(function (player, order) {
    player.order = order;
});

exports.samurai = samurai;

},{"baseball/Model/Player":5,"baseball/Model/_models":8,"baseball/Teams/Trainer":28}],28:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _baseballServicesIterator = require('baseball/Services/Iterator');

var Trainer = (function () {
    function Trainer() {
        _classCallCheck(this, Trainer);
    }

    _createClass(Trainer, [{
        key: 'makePlayer',
        value: function makePlayer(player, name, surname, surnameJ, nameJ, pitching, offense, defense, bats, throws, number) {
            player.hero = true;

            if ('rights' && 0) {
                surnameJ = '代表';
                nameJ = '選手';
                name = 'TEAM';
                surname = 'JPN';
            }

            player.name = name + ' ' + surname;
            player.nameJ = surnameJ + nameJ;
            player.surname = surname;
            player.surnameJ = surnameJ;

            player.spaceName(surnameJ, nameJ);
            player.randomizeSkills(true, true);
            player.skill.offense = offense;
            player.skill.defense = defense;
            player.skill.pitching = pitching;
            player.bats = bats;
            player.throws = throws;
            player.number = number;
            _baseballServicesIterator.Iterator.each(player.pitching, function (key, value) {
                player.pitching[key].velocity += pitching / 5 | 0;
                player.pitching[key]['break'] += pitching / 5 | 0;
                player.pitching[key].control += pitching / 5 | 0;
            });
            player.resetStats(0);
        }
    }]);

    return Trainer;
})();

exports.Trainer = Trainer;

},{"baseball/Services/Iterator":23}],29:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballUtilityText = require('baseball/Utility/text');

var Log = function Log() {
    this.init();
};

Log.prototype = {
    game: 'instance of Game',
    init: function init() {
        this.stabilized = {
            pitchRecord: {
                e: ['', '', '', '', '', ''],
                n: ['', '', '', '', '', '']
            },
            shortRecord: {
                e: ['', '', '', '', '', ''],
                n: ['', '', '', '', '', '']
            }
        };
        this.pitchRecord = {
            e: [],
            n: []
        };
        this.shortRecord = {
            e: [],
            n: []
        };
        this.record = {
            e: [],
            n: []
        };
    },
    SINGLE: 'H',
    DOUBLE: '2B',
    TRIPLE: '3B',
    HOMERUN: 'HR',
    WALK: 'BB',
    GROUNDOUT: 'GO',
    FLYOUT: 'FO',
    LINEOUT: 'LO',
    RUN: 'R',
    STRIKEOUT: 'SO',
    SACRIFICE: 'SAC',
    REACHED_ON_ERROR: 'ROE',
    FIELDERS_CHOICE: 'FC',
    GIDP: '(IDP)',
    GITP: '(ITP)',
    stabilizeShortRecord: function stabilizeShortRecord() {
        var rec = this.record.e.slice(0, 6);
        this.shortRecord.e = rec;
        this.stabilized.shortRecord.e = rec.concat(['', '', '', '', '', '']).slice(0, 6);

        var rec2 = this.record.n.slice(0, 6);
        this.shortRecord.n = rec2;
        this.stabilized.shortRecord.n = rec2.concat(['', '', '', '', '', '']).slice(0, 6);
    },
    note: function note(_note, noteJ) {
        this.record.e.unshift(_note);
        this.record.n.unshift(noteJ);
        this.stabilizeShortRecord();
        this.async(function () {
            if (_baseballUtilityText.text.mode === 'n') {
                console.log(noteJ);
            } else {
                console.log(_note);
            }
        });
    },
    getBatter: function getBatter(batter) {
        var order = batter.team.nowBatting;
        order = ({
            0: (0, _baseballUtilityText.text)(' 1st'),
            1: (0, _baseballUtilityText.text)(' 2nd'),
            2: (0, _baseballUtilityText.text)(' 3rd'),
            3: (0, _baseballUtilityText.text)(' 4th'),
            4: (0, _baseballUtilityText.text)(' 5th'),
            5: (0, _baseballUtilityText.text)(' 6th'),
            6: (0, _baseballUtilityText.text)(' 7th'),
            7: (0, _baseballUtilityText.text)(' 8th'),
            8: (0, _baseballUtilityText.text)(' 9th')
        })[order];
        var positions = this.longFormFielder();
        return (0, _baseballUtilityText.text)('Now batting') + order + _baseballUtilityText.text.comma() + positions[batter.position] + _baseballUtilityText.text.comma() + batter.getUniformNumber() + _baseballUtilityText.text.comma() + batter.getName();
    },
    noteBatter: function noteBatter(batter) {
        var m = _baseballUtilityText.text.mode,
            record,
            recordJ;
        _baseballUtilityText.text.mode = 'e';
        record = this.getBatter(batter);
        _baseballUtilityText.text.mode = 'n';
        recordJ = this.getBatter(batter);
        _baseballUtilityText.text.mode = m;
        this.note(record, recordJ);
    },
    getPitchLocationDescription: function getPitchLocationDescription(pitchInFlight, batterIsLefty) {
        var x = pitchInFlight.x,
            y = pitchInFlight.y,
            say = '';
        var noComma = false,
            noComma2 = false;
        var ball = false;
        if (!batterIsLefty) x = 200 - x;
        if (x < 50) {
            say += (0, _baseballUtilityText.text)('way outside');
            ball = true;
        } else if (x < 70) {
            say += (0, _baseballUtilityText.text)('outside');
        } else if (x < 100) {
            say += '';
            noComma = true;
        } else if (x < 130) {
            say += '';
            noComma = true;
        } else if (x < 150) {
            say += (0, _baseballUtilityText.text)('inside');
        } else {
            say += (0, _baseballUtilityText.text)('way inside');
            ball = true;
        }
        if (say != '') say += _baseballUtilityText.text.comma();
        if (y < 35) {
            say += (0, _baseballUtilityText.text)('way low');
            ball = true;
        } else if (y < 65) {
            say += (0, _baseballUtilityText.text)('low');
        } else if (y < 135) {
            say += '';
            noComma2 = true;
        } else if (y < 165) {
            say += (0, _baseballUtilityText.text)('high');
        } else {
            say += (0, _baseballUtilityText.text)('way high');
            ball = true;
        }
        if (noComma || noComma2) {
            say = say.split(_baseballUtilityText.text.comma()).join('');
            if (noComma && noComma2) {
                say = (0, _baseballUtilityText.text)('down the middle');
            }
        }
        // say = (ball ? 'Ball, ' : 'Strike, ') + say;
        say = _baseballUtilityText.text.namePitch(pitchInFlight) + _baseballUtilityText.text.comma() + say + _baseballUtilityText.text.stop();
        return say;
    },
    notePitch: function notePitch(pitchInFlight, batter) {
        var m = _baseballUtilityText.text.mode,
            record,
            recordJ;
        _baseballUtilityText.text.mode = 'e';
        record = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.pop();
        _baseballUtilityText.text.mode = 'n';
        recordJ = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.pop();
        _baseballUtilityText.text.mode = m;
    },
    broadcastCount: function broadcastCount(justOuts) {
        if (!this.game.umpire) return '';
        var count = this.game.umpire.count;
        if (this.lastOuts == 2 && count.outs == 0) {
            outs = 3 + (0, _baseballUtilityText.text)(' outs');
        } else {
            var outs = count.outs + (count.outs == 1 ? (0, _baseballUtilityText.text)(' out') : (0, _baseballUtilityText.text)(' outs'));
        }
        this.lastOuts = count.outs;
        if (justOuts) {
            return outs + _baseballUtilityText.text.stop();
        }
        return count.strikes + '-' + count.balls + ', ' + outs + _baseballUtilityText.text.stop();
    },
    broadcastScore: function broadcastScore() {
        return this.game.teams.away.getName() + ' ' + this.game.tally.away.R + ', ' + this.game.teams.home.getName() + ' ' + this.game.tally.home.R + _baseballUtilityText.text.stop();
    },
    broadcastRunners: function broadcastRunners() {
        var field = this.game.field;
        var runners = [field.first && (0, _baseballUtilityText.text)('first') || '', field.second && (0, _baseballUtilityText.text)('second') || '', field.third && (0, _baseballUtilityText.text)('third') || ''].filter(function (x) {
            return x;
        });

        var runnerCount = 0;
        runners.map(function (runner) {
            if (runner) {
                runnerCount++;
            }
        });

        switch (runnerCount) {
            case 0:
                return (0, _baseballUtilityText.text)('Bases empty') + _baseballUtilityText.text.stop();
            case 1:
                return (0, _baseballUtilityText.text)('Runner on') + ': ' + runners.join(_baseballUtilityText.text.comma()) + _baseballUtilityText.text.stop();
            default:
                return (0, _baseballUtilityText.text)('Runners on') + ': ' + runners.join(_baseballUtilityText.text.comma()) + _baseballUtilityText.text.stop();
        }
    },
    getSwing: function getSwing(swingResult) {
        var result = '';
        if (swingResult.looking) {
            if (swingResult.strike) {
                result += (0, _baseballUtilityText.text)('Strike.');
            } else {
                result += (0, _baseballUtilityText.text)('Ball.');
            }
        } else {
            if (swingResult.contact) {
                if (swingResult.foul) {
                    result += (0, _baseballUtilityText.text)('Fouled off.');
                } else {
                    if (swingResult.caught) {
                        result += (0, _baseballUtilityText.text)('In play.');
                    } else {
                        if (swingResult.thrownOut) {
                            result += (0, _baseballUtilityText.text)('In play.');
                        } else {
                            result += (0, _baseballUtilityText.text)('In play.');
                        }
                    }
                }
            } else {
                result += (0, _baseballUtilityText.text)('Swinging strike.');
            }
        }
        return result;
    },
    noteSwing: function noteSwing(swingResult) {
        var m = _baseballUtilityText.text.mode,
            record,
            recordJ,
            pitchRecord = this.pitchRecord,
            stabilized = this.stabilized.pitchRecord;
        _baseballUtilityText.text.mode = 'e';
        record = this.getSwing(swingResult);
        pitchRecord.e[0] += record;
        stabilized.e[0] += record;
        _baseballUtilityText.text.mode = 'n';
        recordJ = this.getSwing(swingResult);
        pitchRecord.n[0] += recordJ;
        stabilized.n[0] += recordJ;
        _baseballUtilityText.text.mode = m;
        recordJ = stabilized.n[0];
        record = stabilized.e[0];
        var giraffe = this;
        record.indexOf('Previous') !== 0 && this.async(function () {
            if (record.indexOf('In play') > -1 && record.indexOf('struck out') > -1) {
                if (_baseballUtilityText.text.mode === 'n') {
                    console.log(recordJ);
                } else {
                    console.log(record);
                }
            } else {
                if (_baseballUtilityText.text.mode === 'n') {
                    console.log(giraffe.broadcastCount(), recordJ);
                } else {
                    console.log(giraffe.broadcastCount(), record);
                }
            }
        });
    },
    async: function async(fn) {
        if (!this.game.console && !this.game.quickMode) {
            setTimeout(fn, 100);
        }
    },
    getPlateAppearanceResult: function getPlateAppearanceResult(game) {
        var r = game.swingResult;
        var record = '';
        var batter = game.batter.getName();
        var out = [];
        if (r.looking) {
            if (r.strike) {
                record = batter + (0, _baseballUtilityText.text)(' struck out looking.');
            } else {
                record = batter + (0, _baseballUtilityText.text)(' walked.');
            }
        } else {
            if (r.contact) {
                var fielder = r.fielder,
                    bases = r.bases,
                    outBy;
                if (r.caught) {
                    if (r.flyAngle < 15) {
                        outBy = 'line';
                    } else {
                        if (['left', 'center', 'right'].indexOf(r.fielder) < 0) {
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
                                    out = out.concat(r.additionalOuts.filter(function (runner) {
                                        return runner !== 'batter';
                                    }));
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
                record = _baseballUtilityText.text.contactResult(batter, fielder, bases, outBy, r.outs === 3 ? [] : r.sacrificeAdvances, out);
            } else {
                record = batter + (0, _baseballUtilityText.text)(' struck out swinging.');
            }
        }
        return record;
    },
    notePlateAppearanceResult: function notePlateAppearanceResult(game) {
        var m = _baseballUtilityText.text.mode,
            prevJ = (0, _baseballUtilityText.text)('Previous: ', 'n'),
            prev = (0, _baseballUtilityText.text)('Previous: ', 'e');

        var statement,
            record = this.record,
            pitchRecord = this.pitchRecord,
            stabilized = this.stabilized.pitchRecord;

        _baseballUtilityText.text.mode = 'e';
        var result = this.getPlateAppearanceResult(game);
        record.e.unshift(result);
        statement = prev + result;
        pitchRecord.e = [statement];
        stabilized.e = [statement, '', '', '', '', ''];

        _baseballUtilityText.text.mode = 'n';
        var resultJ = this.getPlateAppearanceResult(game);
        record.n.unshift(resultJ);
        statement = prevJ + resultJ;
        pitchRecord.n = [statement];
        stabilized.n = [statement, '', '', '', '', ''];

        _baseballUtilityText.text.mode = m;
        var giraffe = this;
        this.async(function () {
            if (_baseballUtilityText.text.mode === 'n') {
                console.log(['%c' + resultJ, giraffe.broadcastCount(true), giraffe.broadcastScore(), giraffe.broadcastRunners()].join(' '), 'color: darkgreen;');
            } else {
                console.log(['%c' + result, giraffe.broadcastCount(true), giraffe.broadcastScore(), giraffe.broadcastRunners()].join(' '), 'color: darkgreen;');
            }
        });
    },
    pointer: 0,
    stabilized: {
        pitchRecord: {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        },
        shortRecord: {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        }
    },
    pitchRecord: {
        e: [],
        n: []
    },
    shortRecord: {
        e: [],
        n: []
    },
    record: {
        e: [],
        n: []
    },
    longFormFielder: function longFormFielder() {
        return {
            first: (0, _baseballUtilityText.text)('first baseman'),
            second: (0, _baseballUtilityText.text)('second baseman'),
            third: (0, _baseballUtilityText.text)('third baseman'),
            short: (0, _baseballUtilityText.text)('shortstop'),
            pitcher: (0, _baseballUtilityText.text)('pitcher'),
            catcher: (0, _baseballUtilityText.text)('catcher'),
            left: (0, _baseballUtilityText.text)('left fielder'),
            center: (0, _baseballUtilityText.text)('center fielder'),
            right: (0, _baseballUtilityText.text)('right fielder')
        };
    }
};

exports.Log = Log;

},{"baseball/Utility/text":33}],30:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseballUtilityData = require('baseball/Utility/data');

var _baseballUtilityHelper = require('baseball/Utility/helper');

var _baseballUtilityLog = require('baseball/Utility/Log');

var _baseballUtilityText = require('baseball/Utility/text');

exports.data = _baseballUtilityData.data;
exports.helper = _baseballUtilityHelper.helper;
exports.Log = _baseballUtilityLog.Log;
exports.text = _baseballUtilityText.text;

},{"baseball/Utility/Log":29,"baseball/Utility/data":31,"baseball/Utility/helper":32,"baseball/Utility/text":33}],31:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var data = {
    surnames: ['Sato', 'Suzuki', 'Takahashi', 'Tanaka', 'Watanabe', 'Ito', 'Nakamura', 'Kobayashi', 'Yamamoto', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi', 'Matsumoto', 'Inoue', 'Kimura', 'Shimizu', 'Hayashi', 'Saito', 'Saito', 'Yamazaki', 'Nakajima', 'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Ishikawa', 'Yamashita', 'Ogawa', 'Ishii', 'Hasegawa', 'Goto', 'Okada', 'Kondo', 'Maeda', 'Fujita', 'Endo', 'Aoki', 'Sakamoto', 'Murakami', 'Ota', 'Kaneko', 'Fujii', 'Fukuda', 'Nishimura', 'Miura', 'Takeuchi', 'Nakagawa', 'Okamoto', 'Matsuda', 'Harada', 'Nakano'],
    surnamesJ: ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '中村', '小林', '山本', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '清水', '林', '斉藤', '斎藤', '山崎', '中島', '森', '阿部', '池田', '橋本', '石川', '山下', '小川', '石井', '長谷川', '後藤', '岡田', '近藤', '前田', '藤田', '遠藤', '青木', '坂本', '村上', '太田', '金子', '藤井', '福田', '西村', '三浦', '竹内', '中川', '岡本', '松田', '原田', '中野'],

    namesJ: ['匠', 'ヒカル', 'ゆうき', '翔太', '冬馬', '漣', '港区', 'ルイ', '樹', '賢治', '五木', '春', '光一', '宗介', 'こうすけ', '雄太', '大樹', '瑛太',
    // newer set
    '宏', '亨', '道夫', '聡', '昭', '茂雄', '勝', '純一', '和夫', '勲', '省三', '隆', '達夫', '正一', '輝夫', '俊夫', '史郎', '勇', '義弘', '良雄', '登', '義明', '正義', '秀夫', '肇', '月', '克己', '正男', '光男', '久', '耕三', '清', '次郎', '正博', '明子', '武', '勉', '晴夫', '裕二', '稔', '障子', '和子', '敦', '茂', '信夫', '恵一', '忠', '高尾', '薫', 'ケン', '健治', '哲夫', '啓二', '光一', '真一', '貞夫', '靖', '武', '雄', '文雄', '久雄', '一朗', '健一', '正明', '五郎', '誠', '昭夫', '誠司', '洋一', '康夫', '誠一', '正美', '則夫', '幸雄', '忠雄', '仁', 'シンジ', '豊', '邦雄', '修', '雅之', '三郎', '英治', '浩二', '栄一', '恒夫', '義郎', '進', '博之', '巌'],
    names: ['Takumi', 'Hikaru', 'Yuuki', 'Shouta', 'Touma', 'Ren', 'Minato', 'Rui', 'Tatsuki', 'Kenji', 'Itsuki', 'Haru', 'Kouichi', 'Sousuke', 'Kousuke', 'Yuuta', 'Daiki', 'Eita',
    // newer set
    'Hiroshi', 'Toru', 'Michio', 'Satoshi', 'Akira', 'Shigeo', 'Masaru', 'Junichi', 'Kazuo', 'Isao', 'Shozo', 'Takashi', 'Tatsuo', 'Shoichi', 'Teruo', 'Toshio', 'Shiro', 'Isamu', 'Yoshihiro', 'Yoshio', 'Noboru', 'Yoshiaki', 'Tadayoshi', 'Hideo', 'Hajime', 'Akari', 'Katsumi', 'Masao', 'Mitsuo', 'Hisashi', 'Kozo', 'Kiyoshi', 'Jiro', 'Masahiro', 'Akiko', 'Takeshi', 'Tsutomu', 'Haruo', 'Yuji', 'Minoru', 'Shoji', 'Kazuko', 'Atsushi', 'Shigeru', 'Shinobu', 'Keiichi', 'Tadashi', 'Takao', 'Kaoru', 'Ken', 'Kenji', 'Tetsuo', 'Keiji', 'Koichi', 'Shinichi', 'Sadao', 'Yasushi', 'Takeshi', 'Yu', 'Fumio', 'Hisao', 'Ichiro', 'Kenichi', 'Masaaki', 'Goro', 'Makoto', 'Akio', 'Seiji', 'Yoichi', 'Yasuo', 'Seiichi', 'Masami', 'Norio', 'Yukio', 'Tadao', 'Hitoshi', 'Shinji', 'Yutaka', 'Kunio', 'Osamu', 'Masayuki', 'Saburo', 'Eiji', 'Koji', 'Eiichi', 'Tsuneo', 'Yoshio', 'Susumu', 'Hiroyuki', 'Iwao'],
    teamNamesJ: ['横浜', '大阪', '名古屋', '札幌', '神戸', '京都', '福岡', '川崎', '埼玉県', '広島', '仙台', '千葉県', '新潟', '浜松', '静岡', '相模原', '岡山', '熊本', '鹿児島', '船橋', '川口', '姫路', '松山', '宇都宮', '松戸', '西宮', '倉敷', '市川', '福山', '尼崎', '金沢', '長崎', '横須賀', '富山', '高松', '町田', '岐阜', '枚方', '藤沢', '柏', '豊中', '長野県', '豊橋', '一宮', '和歌山', '岡崎', '宮崎', '奈良', '吹田', '高槻', '旭川', 'いわき', '高崎', '所沢', '川越', '秋田', '越谷', '前橋', '那覇', '四日市', '青森', '久留米', '春日井', '盛岡', '明石', '福島', '下関', '長岡', '市原', '函館', '茨城県', '福井', '加古川', '徳島', '水戸', '平塚', '佐世保', '呉', '八戸', '佐賀', '寝屋川', '富士', '春日部', '茅ヶ崎', '松本', '厚木', '大和', '上尾', '宝塚', '筑波', '沼津', '熊谷', '伊勢崎', '岸和田', '鳥取', '小田原', '鈴鹿', '松江', '日立'],
    teamNames: ['Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Kobe', 'Kyoto', 'Fukuoka', 'Kawasaki', 'Saitama', 'Hiroshima', 'Sendai', 'Chiba', 'Niigata', 'Hamamatsu', 'Shizuoka', 'Sagamihara', 'Okayama', 'Kumamoto', 'Kagoshima', 'Funabashi', 'Kawaguchi', 'Himeji', 'Matsuyama', 'Utsunomiya', 'Matsudo', 'Nishinomiya', 'Kurashiki', 'Ichikawa', 'Fukuyama', 'Amagasaki', 'Kanazawa', 'Nagasaki', 'Yokosuka', 'Toyama', 'Takamatsu', 'Machida', 'Gifu', 'Hirakata', 'Fujisawa', 'Kashiwa', 'Toyonaka', 'Nagano', 'Toyohashi', 'Ichinomiya', 'Wakayama', 'Okazaki', 'Miyazaki', 'Nara', 'Suita', 'Takatsuki', 'Asahikawa', 'Iwaki', 'Takasaki', 'Tokorozawa', 'Kawagoe', 'Akita', 'Koshigaya', 'Maebashi', 'Naha', 'Yokkaichi', 'Aomori', 'Kurume', 'Kasugai', 'Morioka', 'Akashi', 'Fukushima', 'Shimonoseki', 'Nagaoka', 'Ichihara', 'Hakodate', 'Ibaraki', 'Fukui', 'Kakogawa', 'Tokushima', 'Mito', 'Hiratsuka', 'Sasebo', 'Kure', 'Hachinohe', 'Saga', 'Neyagawa', 'Fuji', 'Kasukabe', 'Chigasaki', 'Matsumoto', 'Atsugi', 'Yamato', 'Ageo', 'Takarazuka', 'Tsukuba', 'Numazu', 'Kumagaya', 'Isesaki', 'Kishiwada', 'Tottori', 'Odawara', 'Suzuka', 'Matsue', 'Hitachi']
};

exports.data = data;

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var helper = {
    /**
     * rotation angle from 0 to 360 where 180 is a fastball's backspin and 90 is a slider's, 0 for curveball
     * in the direction (CW for righty), CCW for lefty.
     *
     * x movement, y movement, speed ratio, rotation angle, RPM from RHP perspective where left is smaller X
     */
    pitchDefinitions: {
        // fastball, kinda
        '4-seam': [0, 0, 1, 180, 1000],
        '2-seam': [20, -20, 0.90, -45, 1200],
        'cutter': [-25, -20, 0.95, 75, 1200],
        'sinker': [15, -30, 0.95, -45, 1500],

        // breaking ball
        'slider': [-50, -35, 0.88, 80, 2000],
        'fork': [0, -70, 0.87, 20, 500],
        'curve': [0, -110, 0.82, 10, 2500],

        // change-up
        'change': [0, -10, 0.86, -15, 1000]
    },
    selectRandomPitch: function selectRandomPitch() {
        return ['4-seam', '2-seam', 'cutter', 'sinker', 'slider', 'fork', 'curve', 'change'][Math.floor(Math.random() * 8)];
    }
};

exports.helper = helper;

},{}],33:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
var text = function text(phrase, override) {
    if (!text.mode) text.mode = 'n';
    var string = ({
        n: {
            empty: '-',
            ' 1st': '1番',
            ' 2nd': '2番',
            ' 3rd': '3番',
            ' 4th': '4番',
            ' 5th': '5番',
            ' 6th': '6番',
            ' 7th': '7番',
            ' 8th': '8番',
            ' 9th': '9番',
            'Now batting': '次のバッター',
            'way outside': '相当外角',
            'outside': '外角',
            'inside': '内角',
            'way inside': '相当内角',
            'way low': '相当低め',
            'low': '低め',
            'high': '高め',
            'way high': '相当高め',
            'down the middle': '真ん中',
            'first baseman': 'ファースト',
            'second baseman': 'セカンド',
            'third baseman': 'サード',
            'shortstop': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left fielder': 'レフト',
            'center fielder': 'センター',
            'right fielder': 'ライト',
            'Strike.': 'ストライク。',
            'Ball.': 'ボール。',
            'Fouled off.': 'ファウル。',
            'In play.': 'インプレー。',
            'Swinging strike.': '空振り。',
            ' outs': 'アウト',
            ' out': 'アウト',
            '4-seam': 'ストレート',
            '2-seam': 'シュート',
            'slider': 'スライダー',
            'fork': 'フォーク',
            'cutter': 'カット',
            'sinker': 'シンカー',
            'curve': 'カーブ',
            'change': 'チェンジ',
            ' struck out looking.': '、見逃し三振。',
            ' walked.': '、フォアボール。',
            ' struck out swinging.': '、空振り三振。',
            'Previous: ': '前：',
            'looks like: ': '予想',
            'breaking ball': '変化球',
            'fastball': 'ストレート',
            'Batting, ': '打球',
            'Catching, pitch selection': '捕球選択',
            'Season': '記録',
            'Game': '今試合',
            'Pitch': '球',
            'Control': '制球',
            'Velocity': '速度',
            'Break': '変化',
            'At Bat': 'バッター',
            'On Deck': '次バッター',
            'Eye :': '目',
            'Power :': '力',
            'Speed :': '速',
            'Up to Bat': '打席',
            'Fielding': '守備',
            'BA': '打率',
            'OBP': '出塁',
            'SLG': '長打',
            'PA': '打席',
            'H/2B/3B/HR': '安／二／三／本',
            'H': '安',
            '2B': '二',
            '3B': '三',
            'HR': '本塁打',
            'RBI': '打点',
            'R': '得点',
            'BB': '四球',
            'SO': '三振',

            'first': 'ファースト',
            'second': 'セカンド',
            'third': 'サード',
            'Runner on': 'ランナー',
            'Runners on': 'ランナー',
            'Bases empty': 'ランナーなし',
            'base': '塁',

            'Select Language:': '言語',
            'Run Fast Simulation': 'シミュレーションを試合終了まで行う',
            'Play Ball!': 'プレーボール',
            'Spectate the CPU': 'CPU観戦',
            'Play from the 7th': '７回からプレーする',

            'Throws/Bats': ' ',
            'LHP': '左投',
            'RHP': '右投',
            'LHB': '左打',
            'RHB': '右打',
            'L': '左投',
            'R ': '右投',
            ' L ': '左打',
            ' R ': '右打',
            '#': '背番号',

            'Opponent connected': '相手選手見参',
            'Click Here': 'ここにクリック',
            'Play against Team Japan': '日本代表挑戦'
        },
        e: {
            empty: '-',
            'Season': 'Season'
        }
    })[override ? override : text.mode][phrase];
    return string ? string : phrase;
};

text.getBattersEye = function (game) {
    var eye = {},
        breaking = Math.abs(game.pitchInFlight.breakDirection[0]) + Math.abs(game.pitchInFlight.breakDirection[1]) > 40;
    eye.e = text('looks like: ', 'e') + breaking ? text('breaking ball', 'e') : text('fastball', 'e');
    eye.n = text('looks like: ', 'n') + breaking ? text('breaking ball', 'n') : text('fastball', 'n');
    return eye;
};

text.fielderShortName = function (fielder) {
    if (text.mode == 'n') {
        return ({
            'first': '一',
            'second': '二',
            'third': '三',
            'short': '遊',
            'pitcher': '投',
            'catcher': '捕',
            'left': '左',
            'center': '中',
            'right': '右'
        })[fielder];
    }
    return fielder;
};

text.slash = function () {
    if (text.mode == 'n') {
        return '・';
    }
    return '/';
};

text.fielderLongName = function (fielder) {
    if (text.mode == 'n') {
        return ({
            'first': 'ファースト',
            'second': 'セカンド',
            'third': 'サード',
            'short': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left': 'レフト',
            'center': 'センター',
            'right': 'ライト'
        })[fielder];
    }
    return ({
        first: text('first baseman'),
        second: text('second baseman'),
        third: text('third baseman'),
        short: text('shortstop'),
        pitcher: text('pitcher'),
        catcher: text('catcher'),
        left: text('left fielder'),
        center: text('center fielder'),
        right: text('right fielder')
    })[fielder];
};

text.comma = function () {
    return ({ n: '、', e: ', ' })[text.mode];
};
text.stop = function () {
    return ({ n: '。', e: '. ' })[text.mode];
};

text.namePitch = function (pitch) {
    if (text.mode == 'e') {
        return pitch.name.charAt(0).toUpperCase() + pitch.name.slice(1);
    }
    if (text.mode == 'n') {
        return text(pitch.name);
    }
};

text.contactResult = function (batter, fielder, bases, outBy, sacrificeAdvances, out) {
    var statement = '';
    var infield = ['left', 'center', 'right'].indexOf(fielder) < 0;
    var doublePlay = out.doublePlay;
    if (text.mode == 'e') {
        statement += batter;
        if (outBy) {
            switch (outBy) {
                case 'fieldersChoice':
                    play = out.length === 2 ? 'double play ' : '';
                    statement += ' reached on a fielder\'s choice ' + play + 'by ' + text.fielderShortName(fielder);
                    break;
                case 'line':
                    statement += ' lined out to ' + text.fielderShortName(fielder);
                    break;
                case 'fly':
                    statement += ' flew out to ' + text.fielderShortName(fielder);
                    break;
                case 'error':
                    statement += ' reached on error by ' + text.fielderShortName(fielder);
                    break;
                case 'pop':
                    statement += ' popped out to ' + text.fielderShortName(fielder);
                    break;
                case 'ground':
                    var play = doublePlay ? 'into a double play by' : 'out to';
                    statement += ' grounded ' + play + ' ' + text.fielderShortName(fielder);
                    break;
                case 'thrown':
                    play = doublePlay ? ' on a double play' : '';
                    statement += ' was thrown out by ' + text.fielderShortName(fielder) + play;
                    break;
            }
            if (out.length) {
                var plural = out.length > 1;
                var runner = plural ? 'Runners' : 'Runner';
                var is = plural ? 'are' : 'is';
                statement += '. ' + runner + ' from ' + text(out.join(text.comma())) + ' ' + is + ' out';
            }
        } else {
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += ' reached on an infield hit to ' + text.fielderShortName(fielder);
                    } else {
                        statement += ' reached on a single to ' + text.fielderShortName(fielder);
                    }
                    break;
                case 2:
                    statement += ' doubled past ' + text.fielderShortName(fielder);
                    break;
                case 3:
                    statement += ' tripled past ' + text.fielderShortName(fielder);
                    break;
                case 4:
                    statement += ' homered to ' + text.fielderShortName(fielder);
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(function (base) {
                if (base == 'third') {
                    statement += text.stop() + 'Runner on third scores';
                } else {
                    statement += text.stop() + 'Runner on ' + base + ' advances';
                }
            });
        }
        statement += text.stop();
    }
    if (text.mode == 'n') {
        var stop = text.stop();
        statement += batter + 'は';
        if (outBy) {
            var fielderLong = text.fielderLongName(fielder);
            fielder = text.fielderShortName(fielder);
            switch (outBy) {
                case 'fieldersChoice':
                    statement += '野選(' + fielder + ')で出塁';
                    break;
                case 'line':
                    statement += fielder + '直';
                    break;
                case 'fly':
                    statement += fielder + '飛';
                    break;
                case 'error':
                    statement += 'エラー(' + fielder + ')で出塁';
                    break;
                case 'pop':
                    statement += 'ポップフライで' + fielder + '飛';
                    break;
                case 'ground':
                    statement += fielderLong + 'ゴロに封殺';
                    break;
                case 'thrown':
                    statement += fielder + 'ゴロ';
                    break;
            }
            if (out.length) {
                statement += '。' + out.map(function (runner) {
                    return text(runner);
                }).join(text.comma()) + 'ランナーはアウト';
            }
            if (doublePlay) {
                statement += '。ゲッツー';
            }
        } else {
            fielder = text.fielderShortName(fielder);
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += '内野安打' + '(' + fielder + ')' + 'で出塁';
                    } else {
                        statement += '安打(' + fielder + ')' + 'で出塁';
                    }
                    break;
                case 2:
                    statement += '二塁打（' + fielder + '）で出塁';
                    break;
                case 3:
                    statement += '三塁打（' + fielder + '）で出塁';
                    break;
                case 4:
                    statement += '本塁打（' + fielder + '）';
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(function (base) {
                if (base == 'third') {
                    statement += stop + 'サードランナーホームイン';
                } else {
                    statement += stop + text(base) + 'ランナー進塁';
                }
            });
        }
        statement += stop;
    }
    return statement;
};

exports.text = text;

},{}],34:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballNamespace = require('baseball/namespace');

if (typeof window == 'object') {
    window.Baseball = _baseballNamespace.Baseball;
}

exports.Baseball = _baseballNamespace.Baseball;

},{"baseball/namespace":35}],35:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseballModelAtBat = require('baseball/Model/AtBat');

var _baseballModelField = require('baseball/Model/Field');

var _baseballModelGame = require('baseball/Model/Game');

var _baseballModelManager = require('baseball/Model/Manager');

var _baseballModelPlayer = require('baseball/Model/Player');

var _baseballModelTeam = require('baseball/Model/Team');

var _baseballModelUmpire = require('baseball/Model/Umpire');

var _baseballUtility_utils = require('baseball/Utility/_utils');

var _baseballServices_services = require('baseball/Services/_services');

var _baseballTeamsProvider = require('baseball/Teams/Provider');

var Baseball = {};

Baseball.model = {};
Baseball.model.Game = Baseball.Game = _baseballModelGame.Game;
Baseball.model.Player = Baseball.Player = _baseballModelPlayer.Player;
Baseball.model.Team = Baseball.Team = _baseballModelTeam.Team;

Baseball.service = {};
Baseball.service.Animator = _baseballServices_services.Animator;
Baseball.service.Distribution = _baseballServices_services.Distribution;
Baseball.service.Iterator = _baseballServices_services.Iterator;
Baseball.service.Mathinator = _baseballServices_services.Mathinator;

Baseball.util = {};
Baseball.util.text = _baseballUtility_utils.text;
Baseball.util.Log = _baseballUtility_utils.Log;

Baseball.teams = {};
Baseball.teams.Provider = _baseballTeamsProvider.Provider;

exports.Baseball = Baseball;

},{"baseball/Model/AtBat":1,"baseball/Model/Field":2,"baseball/Model/Game":3,"baseball/Model/Manager":4,"baseball/Model/Player":5,"baseball/Model/Team":6,"baseball/Model/Umpire":7,"baseball/Services/_services":25,"baseball/Teams/Provider":26,"baseball/Utility/_utils":30}],36:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _baseballServicesAnimator = require('baseball/Services/Animator');

var _baseballServicesDistribution = require('baseball/Services/Distribution');

var _baseballServicesIterator = require('baseball/Services/Iterator');

var _baseballServicesMathinator = require('baseball/Services/Mathinator');

exports.Animator = _baseballServicesAnimator.Animator;
exports.Distribution = _baseballServicesDistribution.Distribution;
exports.Iterator = _baseballServicesIterator.Iterator;
exports.Mathinator = _baseballServicesMathinator.Mathinator;

},{"baseball/Services/Animator":21,"baseball/Services/Distribution":22,"baseball/Services/Iterator":23,"baseball/Services/Mathinator":24}]},{},[34]);

IndexController = function($scope, socket) {
    var text = Baseball.util.text;
    var Game = Baseball.Game;
    var Animator = Baseball.service.Animator;

    window.s = $scope;
    $scope.t = text;

    $scope.mode = function(setMode) {
        if (setMode) {
            text.mode = setMode;
        }
        return text.mode;
    };

    $scope.teamJapan = function() {
        var provider = new Baseball.teams.Provider;
        provider.assignTeam($scope.y, 'TeamJapan', 'away');
        var game = $scope.y;
        if (game.half === 'top') {
            game.batter = game.teams.away.lineup[game.batter.order];
            game.deck = game.teams.away.lineup[(game.batter.order + 1) % 9];
            game.hole = game.teams.away.lineup[(game.batter.order + 2) % 9];
        } else {
            game.pitcher = game.teams.away.positions.pitcher;
        }
    };

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        Game.prototype.humanControl = spectateCpu ? 'none' : 'home';
        Game.prototype.quickMode = !!quickMode && quickMode !== 7;
        $scope.y = new Game();
        var game = $scope.y;
        var field = window.location.hash ? window.location.hash.slice(1) : game.teams.home.name + Math.ceil(Math.random()*47);
        if (typeof io !== 'undefined') {
            socket.game = game;
            $scope.socket = io(window.location.hostname + ':64321', {
                reconnection: false
            });
            $scope.socketService = socket;
            socket.socket = $scope.socket;
            socket.start(field);
        }
        window.location.hash = '#' + field;
        s2.y = game;
        bindMethods();
        $('.blocking').remove();
        if (game.humanControl == 'none' && game.quickMode) {
            var n = 0;
            Animator.console = true;
            game.console = true;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
            Animator.console = game.console = false;
            log('sim ended');
            game.debugOut();
        } else if (game.humanControl == 'none') {
            var scalar = game.quickMode ? 0.05 : 1;
            var auto = setInterval(function() {
                if (game.stage == 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function(callback) {
                    game.quickMode ? void 0 : $scope.$apply();
                    $scope.updateFlightPath(callback);
                });
            }, scalar*(game.field.hasRunnersOn() ? Animator.TIME_FROM_SET + 2000 : Animator.TIME_FROM_WINDUP + 2000));
        }
        if (quickMode === 7 && spectateCpu === undefined) {
            Game.prototype.quickMode = true;
            do {
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && game.inning != 7);
            log('sim halted in 7th');
            game.debugOut();
            Game.prototype.quickMode = false;
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl == 'away') {
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl == 'home') {
            $scope.showMessage = true;
        }
        if (!quickMode || quickMode === 7) {
            game.timeOfDay.h = '00';
            var delay = 100,
                interval = 150;
            while (delay < (game.startTime.h - game.timeOfDay.h) * interval) {
                setTimeout(function() {
                    game.passMinutes(60);
                    $scope.$apply();
                }, delay);
                delay += interval;
            }
        }
    };

    var bindMethods = function() {
        var game = $scope.y;
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        $scope.updateFlightPath = Animator.updateFlightPath.bind($scope);

        // avoid scope cycles, any other easy way?
        var bat = $('.target .swing.stance-indicator');
        var showBat = function(event) {
            if (game.humanBatting()) {
                var offset = $('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                var angle = game.setBatAngle(relativeOffset.x, relativeOffset.y);
                bat.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px",
                    transform: "rotate(" + angle + "deg) rotateY("+(game.batter.bats == "left" ? 0 : -0)+"deg)"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    bat.hide();
                } else {
                    bat.show();
                }
            }
        };
        var glove = $('.target .glove.stance-indicator');
        var showGlove = function(event) {
            if (game.humanPitching()) {
                var offset = $('.target').offset();
                var relativeOffset = {
                    x : event.pageX - offset.left,
                    y : 200 - (event.pageY - offset.top)
                };
                glove.css({
                    top: 200-relativeOffset.y + "px",
                    left: relativeOffset.x + "px"
                });
                if (relativeOffset.x > 200 || relativeOffset.x < 0 || relativeOffset.y > 200 || relativeOffset.y < 0) {
                    glove.hide();
                } else {
                    glove.show();
                }
            }
        };

        $scope.selectPitch = function(pitchName) {
            if (game.stage == 'pitch') {
                game.pitchInFlight = $.extend({}, game.pitcher.pitching[pitchName]);
                game.pitchInFlight.name = pitchName;
                game.swingResult.looking = true;
            }
        };
        $scope.allowInput = true;
        $scope.holdUp = function() {
            $('.input-area').click();
            $scope.$apply();
        };
        game.startOpponentPitching = function(callback) {
            $scope.updateFlightPath(callback);
        };
        $scope.indicate = function($event) {
            if (!$scope.allowInput) {
                return;
            }
            if (game.pitcher.windingUp) {
                return;
            }
            if (game.humanPitching()) $scope.allowInput = false;
            var offset = $('.target').offset();
            var relativeOffset = {
                x : $event.pageX - offset.left,
                y : 200 - ($event.pageY - offset.top)
            };
            clearTimeout($scope.lastTimeout);
            while ($scope.holdUpTimeouts.length) {
                clearTimeout($scope.holdUpTimeouts.shift());
            }
            $scope.showMessage = false;
            game.receiveInput(relativeOffset.x, relativeOffset.y, function(callback) {
                $scope.updateFlightPath(callback);
            });
        };
        $scope.abbreviatePosition = function(position) {
            if (text.mode == 'e') {
                return {
                    pitcher : 'P',
                    catcher : 'C',
                    first : '1B',
                    second : '2B',
                    short : 'SS',
                    third : '3B',
                    left : 'LF',
                    center : 'CF',
                    right : 'RF'
                }[position];
            }
            return text.fielderShortName(position);
        };
        $scope.$watch('y.humanBatting()', function() {
            if ($scope.y.humanBatting()) {
                $('.input-area').mousemove(showBat);
            } else {
                $('.input-area').unbind('mousemove', showBat);
                bat.hide();
            }
        });
        $scope.$watch('y.humanPitching()', function() {
            if ($scope.y.humanPitching()) {
                $('.input-area').mousemove(showGlove);
            } else {
                $('.input-area').unbind('mousemove', showGlove);
                glove.hide();
            }
        });
        var aside = {
            left: $('aside.image-panel.left'),
            right: $('aside.image-panel.right')
        };
        //$scope.$watch('y.playResult', function() {
        //    aside.left.hide();
        //    aside.right.hide();
        //    aside.left.fadeIn(1000, function() {
        //        aside.left.fadeOut(1000);
        //        aside.right.fadeIn(1000, function() {
        //            aside.right.fadeOut(1000);
        //        })
        //    });
        //    $scope.imagePanel = {
        //        left: 'url(./public/images/' + $scope.y.playResult.batter + '.png)',
        //        right: 'url(./public/images/' + $scope.y.playResult.fielder + '.png)'
        //    };
        //});
    };


};
var SocketService = function() {
    var Service = function() {};
    var game, socket, NO_OPERATION = function() {},
        animator = Baseball.service.Animator;
    Service.prototype = {
        socket : {},
        game : {},
        connected : false,
        start : function(key) {
            game = this.game;
            socket = this.socket;
            game.opponentService = this;
            this.connected = socket.connected;
            this.on();
            socket.emit('register', key);
            socket.on('connect_failed reconnect_failed', function() {
                console.log('connection unavailable');
            });
        },
        on : function() {
            var giraffe = this;
            socket.on('register', this.register);
            socket.on('connect reconnect', function() {
                giraffe.connected = true;
            });
            socket.on('disconnect', function() {
                giraffe.connected = false;
            });
            socket.on('pitch', function(pitch) {
                //console.log('receive', 'pitch', pitch);
                game.thePitch(0, 0, NO_OPERATION, pitch);
                var scope = window.s;
                animator.updateFlightPath.bind(scope)();
            });
            socket.on('swing', function(swing) {
                //console.log('receive', 'swing', swing);
                game.theSwing(0, 0, NO_OPERATION, swing);
                var scope = window.s;
                animator.updateFlightPath.bind(scope)(function() {
                    if (swing.contact) {
                        animator.animateFieldingTrajectory(game);
                    }
                });
            });
            socket.on('partner_disconnect', function() {
                console.log('The opponent has disconnected');
                game.opponentConnected = false;
                var scope = window.s;
                scope.$digest();
            });
            socket.on('partner_connect', function() {
                game.opponentConnected = true;
                var scope = window.s;
                scope.$digest();
            });
            socket.on('opponent_taking_field', function() {
                console.log('A challenger has appeared! Sending game data.');
                socket.emit('game_data', game.toData());
            });
            socket.on('game_data', function(data) {
                game.fromData(data);
                var scope = window.s;
                scope.$apply();
            });
            socket.on('field_in_use', function() {
                game.opponentConnected = false;
            });
        },
        off : function() {
            socket.on('register', NO_OPERATION);
        },
        register: function(data) {
            console.log(data);
            if (data === 'away') {
                game.humanControl = 'away';
            }
            socket.on('register', NO_OPERATION);
        },
        emitPitch : function(pitch) {
            //console.log('emit', 'pitch', pitch);
            socket.emit('pitch', pitch);
        },
        emitSwing : function(swing) {
            //console.log('emit', 'swing', swing);
            socket.emit('swing', swing);
        },
        swing : function() {

        },
        pitch : function() {

        }
    };
    return new Service;
};
BattersDirective = function() {
    return {
        //scope: {
        //    game: '=',
        //    text: '='
        //},
        templateUrl: 'public/html/views/directives/batters.html?cache='+cacheKey,
        transclude : true,
        //link: function(scope) {
        //    scope.t = scope.text;
        //    scope.y = scope.game;
        //}
    };
};
BatteryDirective = function() {
    return {
        //scope: {
        //    game: '=',
        //    text: '='
        //},
        templateUrl: 'public/html/views/directives/battery.html?cache='+cacheKey,
        transclude : true,
        //link: function(scope) {
        //    scope.t = scope.text;
        //    scope.y = scope.game;
        //}
    };
};
FieldDirective = function() {
    return {
        //scope: {
        //    game: '=',
        //    text: '='
        //},
        templateUrl: 'public/html/views/directives/field.html?cache='+cacheKey,
        transclude : true,
        //link: function(scope) {
        //    scope.t = scope.text;
        //    scope.y = scope.game;
        //}
    };
};
RatingBlockDirective = function() {
    return {
        scope: {
            rating: '='
        },
        transclude: true,
        templateUrl: 'public/html/views/directives/ratingBlock.html?cache='+cacheKey,
        link: function(scope) {
        }
    };
};
ScoreboardDirective = function() {
    return {
        scope: {
            game: '=',
            text: '='
        },
        templateUrl: 'public/html/views/directives/scoreboard.html?cache='+cacheKey,
        link: function(scope) {
            window.s2 = scope;
            scope.t = scope.text;
            scope.y = scope.game;
        }
    };
};
var app = angular.module('YakyuuAikoukai', ['directives'])
    .service('socket', SocketService)
    .controller('IndexController', ['$scope', 'socket', IndexController]);

app.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{{');
    $interpolateProvider.endSymbol('}}');
});

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective)
    .directive('batters', BattersDirective)
    .directive('battery', BatteryDirective)
    .directive('field', FieldDirective)
    .directive('ratingBlock', RatingBlockDirective);
//# sourceMappingURL=sourcemaps/application.js.map
