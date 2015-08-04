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

},{"baseball/Utility/Log":14}],2:[function(require,module,exports){
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
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         * @type {number}
         */
        var splayAngle = 90 - 1.5 * x + swing.angle * y / 35;
        var flyAngle = -3 * y - swing.angle * y / 35;
        var power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0) / 5;
        var landingDistance = _baseballServices_services.Distribution.landingDistance(power, flyAngle);
        if (flyAngle < 0 && landingDistance > 120) {
            landingDistance = (landingDistance - 120) / 4 + 120;
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
            var fielder = this.game.half == 'top' ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder];
            fielder.fatigue += 4;
            swing.error = false;
            var fieldingEase = fielder.skill.defense.fielding / 100,
                throwingEase = fielder.skill.defense.throwing / 100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel * 1.65;
            if (interceptRating > 0 && flyAngle > 0) {
                //caught cleanly?
                if (_baseballServices_services.Distribution.error(fielder)) {
                    //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                    if (this.game.umpire.count.outs < 2) {
                        var sacrificeThrowInTime = _baseballServices_services.Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, 100);
                        if (this.first && sacrificeThrowInTime > this.first.getBaseRunningTime() + 2.5) {
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
                swing.outFielder = ({ 'left': 1, 'center': 1, 'right': 1 })[swing.fielder] == 1;
                var speed = this.game.batter.skill.offense.speed,
                    baseRunningTime = _baseballServices_services.Mathinator.baseRunningTime(speed);

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
                    if (this.first && this.second && fieldingReturnDelay < this.second.getBaseRunningTime() + 0.6) swing.fieldersChoice = 'second';
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
        return _baseballServices_services.Animator.animateFieldingTrajectory(this.game);
    },
    //printRunnerNames : function() {
    //    return [this.first ? this.first.getName() : '', this.second ? this.second.getName() : '', this.third ? this.third.getname() : ''];
    //},
    /**
     * @param splayAngle
     * @param landingDistance
     * @returns {string|bool}
     */
    findFielder: function findFielder(splayAngle, landingDistance) {
        if (Math.abs(90 - splayAngle) > 50) return false;
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 66 && Math.abs(90 - splayAngle) < 5) {
            return 'pitcher';
        }
        if (landingDistance > 20 && landingDistance + Math.abs(90 - splayAngle) / 90 * 37 < 155) {
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

},{"baseball/Model/Player":5,"baseball/Services/_services":13}],3:[function(require,module,exports){
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
    humanControl: 'none', //home, away, both, none
    console: false,
    quickMode: true,
    debug: [],
    init: function init(m) {
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
    },
    getInning: function getInning() {
        return _baseballUtility_utils.text.mode == 'n' ? this.inning + (this.half == 'top' ? 'オモテ' : 'ウラ') : this.half.toUpperCase() + ' ' + this.inning;
    },
    humanBatting: function humanBatting() {
        if (this.humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'away';
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'home';
        }
    },
    humanPitching: function humanPitching() {
        if (this.humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'home';
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'away';
        }
    },
    end: function end() {
        this.stage = 'end';
        var e, n;
        e = this.tally.home.R > this.tally.away.R ? 'Home team wins!' : this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!';
        n = this.tally.home.R > this.tally.away.R ? this.teams.home.getName() + 'の勝利' : this.tally.home.R == this.tally.away.R ? '引き分け' : this.teams.away.getName() + 'の勝利';
        this.log.note(e, n);
        this.log.note('Reload to play again', 'リロるは次の試合へ');
    },
    stage: 'pitch', //pitch, swing
    simulateInput: function simulateInput(callback) {
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch') {
            this.autoPitch(callback);
        } else if (this.stage == 'swing') {
            if (typeof this.pitchTarget != 'object') {
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
        }, giraffe.field.hasRunnersOn() ? _baseballServices_services.Animator.TIME_FROM_SET + 1200 : _baseballServices_services.Animator.TIME_FROM_WINDUP + 1200);
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
        var pitchName = this.helper.selectRandomPitch();
        while (!this.pitcher.pitching.hasOwnProperty(pitchName)) {
            pitchName = this.helper.selectRandomPitch();
        }
        var pitch = this.pitcher.pitching[pitchName];
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    },
    autoPitch: function autoPitch(callback) {
        var pitcher = this.pitcher,
            giraffe = this;
        if (this.stage == 'pitch') {
            pitcher.windingUp = true;
            if (!this.console) {
                $('.baseball').addClass('hide');
                var windup = $('.windup');
                windup.css('width', '100%');
            }
            this.autoPitchSelect();
            var pitch = _baseballServices_services.Distribution.pitchLocation(),
                x = pitch.x,
                y = pitch.y;
            if (this.quickMode) {
                this.thePitch(x, y, callback);
            } else {
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
            convergence = 1.35 * 5 * eye / 100;
            convergenceSum = 1 + convergence;
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        } else {
            convergence = 1.35 * 2 * eye / 100;
            convergenceSum = 1 + convergence;
        }
        x = (deceptiveX * convergence + x) / convergenceSum;
        y = (deceptiveY * convergence + y) / convergenceSum;

        this.swingResult.x = _baseballServices_services.Distribution.cpuSwing(x, this.pitchInFlight.x, eye);
        this.swingResult.y = _baseballServices_services.Distribution.cpuSwing(y, this.pitchInFlight.y, eye);

        var swingProbability = _baseballServices_services.Distribution.swingLikelihood(eye, x, y, this.umpire);
        if (swingProbability < 100 * Math.random()) {
            x = -20;
        }

        callback(function () {
            giraffe.theSwing(x, y);
        });
    },
    thePitch: function thePitch(x, y, callback) {
        if (this.stage == 'pitch') {
            this.pitcher.fatigue++;
            this.pitchTarget.x = x;
            this.pitchTarget.y = y;

            this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
            this.battersEye = _baseballUtility_utils.text.getBattersEye(this);

            var control = this.pitchInFlight.control;
            this.pitchTarget.x = _baseballServices_services.Distribution.pitchControl(this.pitchTarget.x, control);
            this.pitchTarget.y = _baseballServices_services.Distribution.pitchControl(this.pitchTarget.y, control);

            if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

            var breakEffect = _baseballServices_services.Distribution.breakEffect(this.pitchInFlight, this.pitcher, this.pitchTarget.x, this.pitchTarget.y);

            this.pitchInFlight.x = breakEffect.x;
            this.pitchInFlight.y = breakEffect.y;

            this.log.notePitch(this.pitchInFlight, this.batter);

            this.stage = 'swing';
            if (this.humanControl != 'none' && (this.humanControl == 'both' || this.humanBatting())) {
                callback();
            } else {
                this.autoSwing(x, y, callback);
            }
        }
    },
    battersEye: {
        e: '',
        n: ''
    },
    theSwing: function theSwing(x, y, callback) {
        if (this.stage == 'swing') {
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

                this.swingResult.x = Math.abs(recalculation.x) > 20 ? recalculation.x * precision : recalculation.x;
                this.swingResult.y = -5 + (recalculation.y < 0 ? recalculation.y * precision : recalculation.y);

                //log(recalculation.y, precision);

                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
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

            this.log.noteSwing(this.swingResult);
            this.stage = 'pitch';

            var half = this.half;
            this.umpire.makeCall();
            if (half != this.half) {
                callback = this.startOpponentPitching;
            }

            if (typeof callback == 'function') {
                if (this.humanControl != 'none' && (this.humanControl == 'both' || this.teams[this.humanControl] == this.pitcher.team)) {
                    callback();
                } else {
                    this.autoPitch(callback);
                }
            }
        }
    },
    setBatAngle: function setBatAngle(x, y) {
        var giraffe = this;
        var origin = {
            x: giraffe.batter.bats == 'right' ? -10 : 210,
            y: 160
        };
        var swing = {
            x: x ? x : giraffe.pitchInFlight.x + this.swingResult.x,
            y: y ? y : giraffe.pitchInFlight.y + this.swingResult.y
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
        log('weak fly hits (thrown out)', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle > 0 && a.thrownOut;
        }).length);
        log('good fly hits (not caught)', this.debug.filter(function (a) {
            return !a.caught && !a.foul && a.flyAngle > 0 && !a.thrownOut;
        }).length);

        var PO = {};
        this.debug.map(function (a) {
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
            atBats = atBats.concat(a.atBats);
        });

        var LO = atBats.filter(function (ab) {
            return ab == 'LO';
        }).length;
        log('line outs', LO);
        var FO = atBats.filter(function (ab) {
            return ab == 'FO';
        }).length;
        log('fly outs', FO);
        var GO = atBats.filter(function (ab) {
            return ab == 'GO';
        }).length;
        log('groundouts', GO);
        var SO = atBats.filter(function (ab) {
            return ab == 'SO';
        }).length;
        log('strikeouts', SO);
        log('fouls', this.debug.filter(function (a) {
            return a.foul;
        }).length);
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

},{"baseball/Model/Field":2,"baseball/Model/Team":6,"baseball/Model/Umpire":7,"baseball/Services/_services":13,"baseball/Utility/Log":14,"baseball/Utility/_utils":15}],4:[function(require,module,exports){
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
        this.team.positions.pitcher.number = jerseyNumber++;
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], 'right');
        this.team.positions.catcher.position = 'catcher';
        this.team.positions.catcher.number = jerseyNumber++;
        _baseballServices_services.Iterator.each(this.team.bench, function (key, player) {
            player.number = jerseyNumber++;
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

},{"baseball/Services/_services":13}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _baseballUtility_utils = require('baseball/Utility/_utils');

var _baseballServices_services = require('baseball/Services/_services');

var _baseballModel_models = require('baseball/Model/_models');

var Player = function Player(team) {
    this.init(team);
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
    // let's just say we're about X games into the season
    var gamesIntoSeason = this.team.game.gamesIntoSeason;
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
    var so = Math.floor(randBetween(33, 2, 'eye') * paRemaining / 100);
    paRemaining -= so;
    var h = Math.floor(randBetween(185, 472, 'eye power speed') * paRemaining / 1000);
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
            getERA: function getERA() {
                return 9 * this.ER / Math.max(1 / 3, this.IP[0] + this.IP[1] / 3);
            },
            ERA: null,
            ER: ER,
            H: 0, // in game
            HR: 0, // in game
            BB: 0, // in game
            IP: [IP, 0]
        },
        batting: {
            getBA: function getBA() {
                return this.h / Math.max(1, this.ab);
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
    this.stats.batting.ba = this.stats.batting.getBA();
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
        if (jSurname.length == 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length == 1 && jSurname.indexOf('・') < 0) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.surname = _baseballUtility_utils.data.surnames[surnameKey];
        this.surnameJ = _baseballUtility_utils.data.surnamesJ[surnameKey];
        this.atBats = [];
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
    randomizeSkills: function randomizeSkills(hero) {
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
        if (Math.random() < 0.17) {
            // can pitch!
            if (Math.random() > 0.6) {
                this.pitching['2-seam'] = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.18) {
                this.pitching.fork = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() > 0.77) {
                this.pitching.cutter = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.21) {
                this.pitching.sinker = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.4) {
                this.pitching.curve = {
                    velocity: randValue(true),
                    'break': randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.9) {
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

},{"baseball/Model/_models":8,"baseball/Services/_services":13,"baseball/Utility/_utils":15}],6:[function(require,module,exports){
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
        this.game = game;
        for (var j = 0; j < 20; j++) {
            this.bench.push(new _baseballModelPlayer.Player(this));
        }
        if (this.bench.length == 20) {
            this.manager = new _baseballModelManager.Manager(this);
            this.manager.makeLineup();
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

},{"baseball/Model/Manager":4,"baseball/Model/Player":5,"baseball/Utility/_utils":15}],7:[function(require,module,exports){
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
        this.game.half = 'top';
        this.game.inning = 1;
        this.game.batter = this.game.teams.away.lineup[0];
        this.game.batterRunner = this.game.teams.away.lineup[0];
        this.game.deck = this.game.teams.away.lineup[1];
        this.game.hole = this.game.teams.away.lineup[2];
        this.game.pitcher = this.game.teams.home.positions.pitcher;
        var n = '一回のオモテ、' + this.game.teams.away.getName() + 'の攻撃対' + this.game.teams.home.getName() + '、ピッチャーは' + this.game.teams.home.positions.pitcher.getName() + '。',
            e = 'Top 1, ' + this.game.teams.away.name + ' offense vs. ' + this.game.teams.home.positions.pitcher.name + ' starting for ' + this.game.teams.home.name;
        this.game.log.note(e, n);
        this.game.log.noteBatter(this.game.batter);
    },
    makeCall: function makeCall() {
        this.says = '';

        var result = this.game.swingResult;
        var pitcher = this.game.pitcher;
        var batter = this.game.batter;

        if (this.game.swingResult.fielder) {
            var fielder = this.game.teams[this.game.half == 'top' ? 'home' : 'away'].positions[result.fielder];
        } else {
            fielder = null;
        }

        this.game.batterRunner = this.game.batter;

        pitcher.stats.pitching.pitches++;
        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            if (result.contact) {
                if (result.caught) {
                    batter.stats.batting.pa++;
                    pitcher.stats.pitching.IP[1]++;
                    if (result.sacrificeAdvances.length && this.count.outs < 2) {
                        batter.stats.batting.sac++;
                        this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.SACRIFICE);
                        this.advanceRunners(false, null, result.sacrificeAdvances);
                    } else {
                        batter.stats.batting.ab++;
                        if (result.flyAngle < 15) {
                            this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.LINEOUT);
                        } else {
                            this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.FLYOUT);
                        }
                    }
                    this.count.outs++;
                    this.newBatter();
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        pitcher.stats.pitching.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.fieldersChoice && this.count.outs < 2) {
                            result.bases = 0;
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.FIELDERS_CHOICE);
                            this.advanceRunners(false, result.fieldersChoice);
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
                            this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GROUNDOUT);
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
                                this.game.tally[this.game.half == 'top' ? 'away' : 'home'][_baseballUtility_utils.Log.prototype.SINGLE]++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    this.game.tally[this.game.half == 'top' ? 'home' : 'away'].E++;
                                    fielder.stats.fielding.E++;
                                }
                            }
                            var bases = result.bases;
                            switch (bases) {
                                case 0:
                                    this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.GROUNDOUT);
                                    break;
                                case 1:
                                    if (result.error) {
                                        this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.REACHED_ON_ERROR);
                                    } else {
                                        this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.SINGLE);
                                        batter.stats.batting.h++;
                                    }
                                    break;
                                case 2:
                                    this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.DOUBLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3:
                                    this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.TRIPLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4:
                                    this.game.batter.atBats.push(_baseballUtility_utils.Log.prototype.HOMERUN);
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
                pitcher.stats.pitching.strikes++;
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
        this.game.field.first = this.game.batter;
        this.game.field.first.fatigue += 2;
        return this;
    },
    advanceRunners: function advanceRunners(isWalk, fieldersChoice, sacrificeAdvances) {
        isWalk = !!isWalk;
        var first = this.game.field.first,
            second = this.game.field.second,
            third = this.game.field.third,
            game = this.game,
            swing = this.game.swingResult;

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
                    first = this.game.field.first;
                    second = this.game.field.second;
                    third = this.game.field.third;
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
        this.game.log.pitchRecord = {
            e: [],
            n: []
        };
        this.count.balls = this.count.strikes = 0;
        this.game.log.notePlateAppearanceResult(this.game);
        var team = this.game.half == 'bottom' ? this.game.teams.home : this.game.teams.away;
        this.game.batter = team.lineup[(team.nowBatting + 1) % 9];
        this.game.deck = team.lineup[(team.nowBatting + 2) % 9];
        this.game.hole = team.lineup[(team.nowBatting + 3) % 9];
        team.nowBatting = (team.nowBatting + 1) % 9;
        if (this.count.outs < 3) {
            this.game.log.noteBatter(this.game.batter);
        }
    },
    changeSides: function changeSides() {
        this.game.swingResult = {};
        this.game.swingResult.looking = true; // hide bat
        this.game.pitchInFlight.x = null; // hide ball
        this.game.pitchInFlight.y = null; // hide ball
        this.game.log.pitchRecord = {
            e: [],
            n: []
        };
        var offense, defense;
        this.game.field.first = null;
        this.game.field.second = null;
        this.game.field.third = null;
        if (this.game.half == 'top') {
            if (this.game.inning == 9 && this.game.tally.home.R > this.game.tally.away.R) {
                return this.game.end();
            }
            this.game.half = 'bottom';
        } else {
            if (this.game.inning + 1 > 9) {
                return this.game.end();
            }
            this.game.inning++;
            this.game.half = 'top';
        }
        offense = this.game.half == 'top' ? 'away' : 'home';
        defense = this.game.half == 'top' ? 'home' : 'away';
        var n = this.game.inning + '回の' + (this.game.half == 'top' ? 'オモテ' : 'ウラ') + '、' + this.game.teams[this.game.half == 'top' ? 'away' : 'home'].getName() + 'の攻撃。',
            e = (this.game.half == 'top' ? 'Top' : 'Bottom') + ' ' + this.game.inning;
        this.game.log.note(e, n);
        var team = this.game.teams[offense];
        this.game.batter = team.lineup[team.nowBatting];
        this.game.batterRunner = this.game.batter;
        this.game.deck = team.lineup[(team.nowBatting + 1) % 9];
        this.game.hole = team.lineup[(team.nowBatting + 2) % 9];

        this.game.pitcher = this.game.teams[defense].positions.pitcher;
        this.game.log.noteBatter(this.game.batter);
        this.game.autoPitchSelect();
    },
    says: 'Play ball!',
    game: null
};

exports.Umpire = Umpire;

},{"baseball/Model/Player":5,"baseball/Utility/_utils":15}],8:[function(require,module,exports){
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

},{"baseball/Model/AtBat":1,"baseball/Model/Field":2,"baseball/Model/Game":3,"baseball/Model/Manager":4,"baseball/Model/Player":5,"baseball/Model/Team":6,"baseball/Model/Umpire":7}]
IndexController = function($scope) {
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

    $scope.proceedToGame = function(quickMode, spectateCpu) {
        Game.prototype.humanControl = spectateCpu ? 'none' : 'home';
        Game.prototype.quickMode = !!quickMode;
        $scope.y = new Game();
        var game = $scope.y;
        s2.y = game;
        bindMethods();
        $('.blocking').remove();
        if (game.humanControl == 'none' && game.quickMode) {
            var n = 0;
            do {
                n++;
                game.simulateInput(function(callback) {
                    typeof callback == 'function' && callback();
                });
            } while (game.stage != 'end' && n < 500);
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
        if (game.humanControl == 'away') {
            game.simulateInput(function(callback) {
                $scope.updateFlightPath(callback);
            });
        }
        if (game.humanControl == 'home') {

        }
    };

    var bindMethods = function() {
        var game = $scope.y;
        $scope.holdUpTimeouts = [];
        $scope.expandScoreboard = false;
        var animator = new Animator();
        $scope.updateFlightPath = animator.updateFlightPath.bind($scope);

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
            $('.no-swing').click();
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
                $('.target').mousemove(showBat);
            } else {
                $('.target').unbind('mousemove', showBat);
                bat.hide();
            }
        });
        $scope.$watch('y.humanPitching()', function() {
            if ($scope.y.humanPitching()) {
                $('.target').mousemove(showGlove);
            } else {
                $('.target').unbind('mousemove', showGlove);
                glove.hide();
            }
        });
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
var app = angular.module('YakyuuAikoukai', ['directives']);

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective);

angular.module('controllers', [])
    .controller('IndexController', IndexController);

// var socket = io('ws://' + window.location.hostname + ':3000');
//# sourceMappingURL=sourcemaps/application.js.map