var Game = function(m) {
    this.init(m);
};

Game.prototype = {
    constructor : Game,
    gamesIntoSeason : 0,
    humanControl : 'none', //home, away, both, none
    quickMode : true,
    init : function(m) {
        if (m) window.mode = m;
        this.gamesIntoSeason = 60 + Math.floor(Math.random()*20);
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
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
        }
    },
    humanPitching : function() {
        if (this.humanControl == 'none') return false;
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'away';
                break;
        }
    },
    end : function() {
        this.stage = 'end';
        var e, n;
        e = this.tally.home.R > this.tally.away.R ? 'Home team wins!' : (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!');
        n = this.tally.home.R > this.tally.away.R ? 'Home team wins!' : (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!');
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
        var pitcher = this.pitcher;
        if (this.stage == 'pitch') {
            jQ('.baseball').addClass('hide');
            pitcher.windingUp = true;
            this.swingResult.looking = true;
            var windup = jQ('.windup');
            windup.css('width', '100%');
            var giraffe = this;
            this.autoPitchSelect();
            if (Math.random() < 0.5) {
                var x = 50 + Math.floor(Math.random()*70) - Math.floor(Math.random()*15);
            } else {
                x = 150 + Math.floor(Math.random()*15) - Math.floor(Math.random()*70);
            }
            var y = 30 + (170 - Math.floor(Math.sqrt(Math.random()*28900)));
            if (this.quickMode) {
                giraffe.thePitch(x, y, callback);
            } else {
                windup.animate({width: 0}, this.field.hasRunnersOn() ? 1500 : 3000, function() {
                    jQ('.baseball.pitch').removeClass('hide');
                    giraffe.thePitch(x, y, callback);
                    pitcher.windingUp = false;
                });
            }
        }
    },
    autoSwing : function(deceptiveX, deceptiveY, callback) {
        var giraffe = this;
        var bonus = this.batter.eye.bonus || 0,
            eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus;

        var x = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15),
            y = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15);
        if (100*Math.random() < eye) {
            var convergence = 1.35 * 5*eye/100,
                convergenceSum = 1 + convergence;
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        } else {
            convergence = 1.35 * 2*eye/100;
            convergenceSum = 1 + convergence;
        }
        x = (deceptiveX*(convergence) + x)/convergenceSum;
        y = (deceptiveY*(convergence) + y)/convergenceSum;

        var swingLikelihood = (200 - Math.abs(100 - x) - Math.abs(100 - y))/2;

        if (x < 60 || x > 140 || y < 50 || y > 150) { // ball
            swingLikelihood = Math.min(swingLikelihood, 100 - eye) - 15*this.umpire.count.balls;
        } else {
            swingLikelihood = Math.max(45, (2*swingLikelihood + eye)/3);
        }
        var chance = Math.random()*100,
            totalLikelihood = swingLikelihood - 35 + 10*(this.umpire.count.balls + 2*this.umpire.count.strikes);

        if (totalLikelihood < chance ) {
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
            this.battersEye = text('looks like: ')+(Math.abs(this.pitchInFlight.breakDirection[0])+Math.abs(this.pitchInFlight.breakDirection[1]) > 40 ?
                text('breaking ball') : text('fastball'));

            var control = this.pitchInFlight.control;
            this.pitchTarget.x = Math.min(199.9, Math.max(0.1, this.pitchTarget.x + (50 - Math.random()*100)/(1+control/100)));
            this.pitchTarget.y = Math.min(199.9, Math.max(0.1, this.pitchTarget.y + (50 - Math.random()*100)/(1+control/100)));

            if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

            this.pitchInFlight.x = Math.floor(this.pitchTarget.x + (this.pitchInFlight.breakDirection[0]
                *((0.5+Math.random()*this.pitchInFlight.break)/100)));
            this.pitchInFlight.y = Math.floor(this.pitchTarget.y + (this.pitchInFlight.breakDirection[1]
                *((0.5+Math.random()*this.pitchInFlight.break)/100))/(0.5 + this.pitchTarget.y/200));
            this.log.notePitch(this.pitchInFlight, this.batter);

            this.stage = 'swing';
            if (this.humanControl != 'none' && (this.humanControl == 'both' || this.teams[this.humanControl] == this.batter.team)) {
                callback();
            } else {
                this.autoSwing(x, y, callback);
            }
        }
    },
    battersEye : '',
    debugOut : function() {
        log('grounders', this.debug.filter(function(a){return !a.caught && !a.foul && a.grounder}).length);
        log('grounders thrown out', this.debug.filter(function(a){return !a.caught && !a.foul && a.grounder && a.thrownOut}).length);
        log('weak outfield hits', this.debug.filter(function(a){return !a.caught && !a.foul && !a.grounder && a.thrownOut}).length);
        log('good outfield hits', this.debug.filter(function(a){return !a.caught && !a.foul && !a.grounder && !a.thrownOut}).length);
        log('singles', this.debug.filter(function(a){return a.bases == 1}).length);
        log('2b', this.debug.filter(function(a){return a.bases == 2}).length);
        log('3b', this.debug.filter(function(a){return a.bases == 3}).length);
        log('homeruns', this.debug.filter(function(a){return a.bases == 4}).length);

        log('fly outs', this.debug.filter(function(a){return !a.grounder && !a.bases && a.caught}).length);
        log('groundouts', this.debug.filter(function(a){return a.grounder && !a.bases && !a.caught}).length);
        var SO = this.teams.away.lineup.map(function(p) {return p.atBats}).reduce(function(a, b) {
            return a + b.filter(function(ab) {return ab == 'SO'}).length;
        });
        SO += this.teams.home.lineup.map(function(p) {return p.atBats.filter(function(ab) {return ab == 'SO'})}).reduce(function(a, b) {
            return a.length + b.length;
        });
        log('strikeouts', this.debug.filter(function(a){return a.grounder && !a.bases && !a.caught}).length);
        log('fouls', this.debug.filter(function(a){return a.foul}).length);
    },
    theSwing : function(x, y, callback) {
        if (this.stage == 'swing') {
            this.batter.fatigue++;
            this.swingResult = {};
            var bonus = this.batter.eye.bonus || 0,
                eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus;
            this.swingResult.x = 100 + (x - 100)*(0.5+Math.random()*eye/200) - this.pitchInFlight.x;
            this.swingResult.y = 100 + (y - 100)*(0.5+Math.random()*eye/200) - this.pitchInFlight.y;

            if (!(x < 0 || x > 200)) {
                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.batter.eye.bonus = Math.max(0, eye -
                        Math.sqrt(Math.pow(this.batter.eye.x - this.pitchInFlight.x, 2) + Math.pow(this.batter.eye.y - this.pitchInFlight.y, 2)) * 1.5);
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
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
    startOpponentPitching : null, // late function
    pitchTarget : {x : 100, y : 100},
    pitchInFlight : {
        x : 100,
        y : 100,
        breakDirection : [0, 0],
        name : 'slider',
        velocity : 50,
        break : 50,
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