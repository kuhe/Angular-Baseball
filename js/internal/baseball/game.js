var Game = function(baseball) {
    this.init(baseball);
};

Game.prototype = {
    constructor : Game,
    gamesIntoSeason : 0,
    humanControl : 'home', //home, away, both, none
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
        this.log.note(this.tally.home.R > this.tally.away.R ? 'Home team wins!' : (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!'));
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

            windup.animate({width: 0}, this.field.hasRunnersOn() ? 1500 : 3000, function() {
                if (giraffe.batter.skill.offense.eye > Math.random()*100) {
                    jQ('.baseball.break').removeClass('hide');
                } else {
                    jQ('.baseball.break').removeClass('hide');
                }
                jQ('.baseball.pitch').removeClass('hide');
                giraffe.thePitch(x, y, callback);
                pitcher.windingUp = false;
            });
        }
    },
    autoSwing : function(deceptiveX, deceptiveY, callback) {
        var giraffe = this;
        var x = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15),
            y = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15);
        var convergence = 1.35 * this.batter.skill.offense.eye/100,
            convergenceSum = 1 + convergence;
        if (100*Math.random() < this.batter.skill.offense.eye) {
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        }
        x = (deceptiveX*(convergence) + x)/convergenceSum;
        y = (deceptiveY*(convergence) + y)/convergenceSum;

        var swingLikelihood = (200 - Math.abs(100 - x) - Math.abs(100 - y))/2;

        if (x < 60 || x > 140 || y < 50 || y > 150) { // ball
            swingLikelihood = Math.min(swingLikelihood, 100 - this.batter.skill.offense.eye);
        } else {
            swingLikelihood = Math.max(45, (2*swingLikelihood + this.batter.skill.offense.eye)/3);
        }
        var chance = Math.random()*100,
            totalLikelihood = swingLikelihood - 10*(this.umpire.count.balls - this.umpire.count.strikes);

        if (totalLikelihood < chance ) {
            x = -20;
        }
        callback(function() {
            giraffe.theSwing(x, y);
        });
    },
    thePitch : function(x, y, callback) {
        if (this.stage == 'pitch') {
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
    theSwing : function(x, y, callback) {
        if (this.stage == 'swing') {
            this.swingResult = {};
            this.swingResult.x = 100 + (x - 100)*(0.5+Math.random()*this.batter.skill.offense.eye/200) - this.pitchInFlight.x;
            this.swingResult.y = 100 + (y - 100)*(0.5+Math.random()*this.batter.skill.offense.eye/200) - this.pitchInFlight.y;

            if (!(x < 0 || x > 200)) {
                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
                } else {
                    this.swingResult.contact = false;
                }
            } else {
                this.swingResult.strike = this.pitchInFlight.x > 50 && this.pitchInFlight.x < 150
                    && this.pitchInFlight.y > 35 && this.pitchInFlight.y < 165;
                this.swingResult.contact = false;
                this.swingResult.looking = true;
            }

            this.log.noteSwing(this.swingResult);
            this.stage = 'pitch';

            this.umpire.makeCall();

            if (typeof callback == 'function') {
                if (this.humanControl != 'none' && (this.humanControl == 'both' || this.teams[this.humanControl] == this.pitcher.team)) {
                    callback();
                } else {
                    this.autoPitch(callback);
                }
            }
        }
    },
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