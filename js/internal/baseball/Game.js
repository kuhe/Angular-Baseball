var Game = function(m) {
    this.init(m);
};

Game.prototype = {
    constructor : Game,
    gamesIntoSeason : 0,
    humanControl : 'none', //home, away, both, none
    console : false,
    quickMode : true,
    init : function(m) {
        if (m) window.mode = m;
        this.gamesIntoSeason = 1 + Math.floor(Math.random()*142);
        this.field = new Field(this);
        this.teams.away = new Team(this);
        this.teams.home = new Team(this);
        this.log = new Log();
        this.log.game = this;
        this.helper = helper;
        while (this.teams.away.name == this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.umpire = new Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        }
    },
    getInning : function() {
        return mode == 'n' ? (this.inning + (this.half == 'top' ? 'オモテ' : 'ウラ')) : this.half.toUpperCase() + ' ' + this.inning;
    },
    humanBatting : function() {
        if (this.humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'away';
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'home';
        }
    },
    humanPitching : function() {
        if (this.humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'home';
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'away';
        }
    },
    end : function() {
        this.stage = 'end';
        var e, n;
        e = this.tally.home.R > this.tally.away.R ? 'Home team wins!' :
            (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!');
        n = this.tally.home.R > this.tally.away.R ? this.teams.home.getName()+'の勝利' :
            (this.tally.home.R == this.tally.away.R ? '引き分け' : this.teams.away.getName()+'の勝利');
        this.log.note(e, n);
    },
    stage : 'pitch', //pitch, swing
    simulateInput : function(callback) {
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch') {
            this.autoPitch(callback);
        } else if (this.stage == 'swing') {
            if (typeof this.pitchTarget != 'object') {
                this.pitchTarget = {x: 100, y: 100};
            }
            this.autoSwing(this.pitchTarget.x, this.pitchTarget.y, callback);
        }
    },
    simulatePitchAndSwing : function(callback) {
        if (this.stage == 'end') {
            return;
        }
        this.autoPitch(callback);
        var giraffe = this;
        setTimeout(function() {
            if (typeof giraffe.pitchTarget != 'object') {
                giraffe.pitchTarget = {x: 100, y: 100};
            }
            giraffe.autoSwing(giraffe.pitchTarget.x, giraffe.pitchTarget.y, function(callback) {callback();});
        }, giraffe.field.hasRunnersOn() ? 2400 : 3900);
    },
    /**
     * generically receive click input and decide what to do
     * @param x
     * @param y
     * @param callback
     */
    receiveInput : function(x, y, callback) {
        if (this.humanControl == 'none') {
            return;
        }
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch' && this.humanPitching()) {
            this.thePitch(x, y, callback);
        } else if (this.stage == 'swing'  && this.humanBatting()) {
            this.theSwing(x, y, callback);
        }
    },
    autoPitchSelect : function() {
        var pitchName = this.helper.selectRandomPitch();
        while (!this.pitcher.pitching.hasOwnProperty(pitchName)) {
            pitchName = this.helper.selectRandomPitch();
        }
        var pitch = this.pitcher.pitching[pitchName];
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    },
    autoPitch : function(callback) {
        var pitcher = this.pitcher,
            giraffe = this;
        if (this.stage == 'pitch') {
            pitcher.windingUp = true;
            if (!this.console) {
                jQ('.baseball').addClass('hide');
                var windup = jQ('.windup');
                windup.css('width', '100%');
            }
            this.autoPitchSelect();
            var pitch = Distribution.pitchLocation(),
                x = pitch.x,
                y = pitch.y;
            if (this.quickMode) {
                this.thePitch(x, y, callback);
            } else {
                windup.animate({width: 0}, this.field.hasRunnersOn() ? 1500 : 3000, function() {
                    !giraffe.console && jQ('.baseball.pitch').removeClass('hide');
                    giraffe.thePitch(x, y, callback);
                    pitcher.windingUp = false;
                });
            }
        }
    },
    autoSwing : function(deceptiveX, deceptiveY, callback) {
        var giraffe = this;
        var bonus = this.batter.eye.bonus || 0,
            eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus,
            convergence, convergenceSum;

        var x = Distribution.centralizedNumber(),
            y = Distribution.centralizedNumber();
        if (100*Math.random() < eye) {
            convergence = 1.35 * 5*eye/100;
            convergenceSum = 1 + convergence;
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        } else {
            convergence = 1.35 * 2*eye/100;
            convergenceSum = 1 + convergence;
        }
        x = (deceptiveX*(convergence) + x)/convergenceSum;
        y = (deceptiveY*(convergence) + y)/convergenceSum;

        var swingProbability = Distribution.swingLikelihood(eye, x, y, this.umpire);
        if (swingProbability < 100*Math.random()) {
            x = -20;
        }
        callback(function() {
            giraffe.theSwing(x, y);
        });
    },
    thePitch : function(x, y, callback) {
        if (this.stage == 'pitch') {
            this.pitcher.fatigue++;
            this.pitchTarget.x = x;
            this.pitchTarget.y = y;

            this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
            this.battersEye = text.getBattersEye(this);

            var control = this.pitchInFlight.control;
            this.pitchTarget.x = Distribution.pitchControl(this.pitchTarget.x, control);
            this.pitchTarget.y = Distribution.pitchControl(this.pitchTarget.y, control);

            if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

            var breakEffect = Distribution.breakEffect(this.pitchInFlight, this.pitchTarget.x, this.pitchTarget.y);

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
    battersEye : {
        e: '',
        n: ''
    },
    theSwing : function(x, y, callback) {
        if (this.stage == 'swing') {
            this.batter.fatigue++;
            this.swingResult = {};
            var bonus = this.batter.eye.bonus || 0,
                eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus;
            this.swingResult.x = Distribution.swing(x, this.pitchInFlight.x, eye);
            this.swingResult.y = Distribution.swing(y, this.pitchInFlight.y, eye);

            this.swingResult.angle = this.setBatAngle();

            var recalculation = Mathinator.getAngularOffset(this.swingResult, this.swingResult.angle);
            this.swingResult.x = recalculation.x;
            this.swingResult.y = recalculation.y;

            if (x >= 0 && x <= 200) {
                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.batter.eye.bonus = Math.max(0, eye -
                        Math.sqrt(Math.pow(this.batter.eye.x - this.pitchInFlight.x, 2) + Math.pow(this.batter.eye.y - this.pitchInFlight.y, 2)) * 1.5);
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
                    // log(this.swingResult.flyAngle, Math.floor(this.swingResult.x), Math.floor(this.swingResult.y));
                    this.debug.push(this.swingResult);
                } else {
                    this.swingResult.contact = false;
                }
            } else {
                this.swingResult.strike = this.pitchInFlight.x > 50 && this.pitchInFlight.x < 150
                    && this.pitchInFlight.y > 35 && this.pitchInFlight.y < 165;
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
    setBatAngle : function(x, y) {
        var giraffe = this;
        var origin = {
            x: giraffe.batter.bats == 'right' ? -10 : 210,
            y: 160
        };
        var swing = {
            x: x ? x : giraffe.pitchInFlight.x + this.swingResult.x,
            y: y ? y : giraffe.pitchInFlight.y + this.swingResult.y
        };
        return Mathinator.battingAngle(origin, swing);
    },
    debugOut : function() {
        log('slugging', this.debug.filter(function(a){return a.bases == 1;}).length,
            this.debug.filter(function(a){return a.bases == 2;}).length,
            this.debug.filter(function(a){return a.bases == 3;}).length,
            this.debug.filter(function(a){return a.bases == 4;}).length
        );
        log('grounders', this.debug.filter(function(a){return !a.caught && !a.foul && a.flyAngle < -5;}).length);
        log('grounders thrown out', this.debug.filter(function(a){return !a.caught && !a.foul && a.flyAngle < -5 && a.thrownOut;}).length);
        log('weak fly hits (thrown out)', this.debug.filter(function(a){return !a.caught && !a.foul && a.flyAngle > 0 && a.thrownOut;}).length);
        log('good fly hits (not caught)', this.debug.filter(function(a){return !a.caught && !a.foul && a.flyAngle > 0 && !a.thrownOut;}).length);

        var PO = {};
        this.debug.map(function(a) {
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
        hitters.map(function(a) {atBats = atBats.concat(a.atBats);});

        var LO = atBats.filter(function(ab) {return ab == 'LO';}).length;
        log('line outs', LO);
        var FO = atBats.filter(function(ab) {return ab == 'FO';}).length;
        log('fly outs', FO);
        var GO = atBats.filter(function(ab) {return ab == 'GO';}).length;
        log('groundouts', GO);
        var SO = atBats.filter(function(ab) {return ab == 'SO';}).length;
        log('strikeouts', SO);
        log('fouls', this.debug.filter(function(a){return a.foul;}).length);
    },
    startOpponentPitching : null, // late function
    pitchTarget : {x : 100, y : 100},
    pitchInFlight : {
        x : 100,
        y : 100,
        breakDirection : [0, 0],
        name : 'slider',
        velocity : 50,
        'break' : 50,
        control : 50
    },
    swingResult : {
        x : 100, //difference to pitch location
        y : 100, //difference to pitch location
        strike : false,
        foul : false,
        caught : false,
        contact : false,
        looking : true,
        bases : 0,
        fielder : 'short',
        outs : 0
    },
    pitchSelect : function() {

    },
    field : null,
    teams : {
        away : null,
        home : null
    },
    log : null,
    half : 'top',
    inning : 1,
    scoreboard : {
        away : {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
            6 : 0,
            7 : 0,
            8 : 0,
            9 : 0
        },
        home : {
            1 : 0,
            2 : 0,
            3 : 0,
            4 : 0,
            5 : 0,
            6 : 0,
            7 : 0,
            8 : 0,
            9 : 0
        }
    },
    tally : {
        away : {
            H : 0,
            R : 0,
            E : 0
        },
        home : {
            H : 0,
            R : 0,
            E : 0
        }
    }
};

exports.Game = Game;