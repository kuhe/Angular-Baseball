define(function(){
    var Game = function(baseball) {
        this.init(baseball);
    };

    Game.prototype = {
        init : function(baseball) {
            this.field = new baseball.Field(this);
            this.teams.away = new baseball.Team(baseball);
            this.teams.home = new baseball.Team(baseball);
            this.log = new baseball.utility.Log();
            this.helper = baseball.utility.Helper;
            while (this.teams.away.name == this.teams.home.name) {
                this.teams.away.pickName();
            }
            this.renderer = new baseball.utility.Renderer(this);
            this.umpire = new baseball.Umpire(this);
            if (this.humanControl == 'away' && this.half == 'bottom' || this.half == 'top' && this.humanControl == 'home' || this.humanControl == 'both') {
                this.stage = 'pitch';
            } else {
                this.autoPitch();
            }
        },
        end : function() {
            this.stage = 'end';
        },
        stage : 'pitch', //pitch, swing
        humanControl : 'home', //home, away, both
        receiveInput : function(x, y) {
            if (this.stage == 'pitch') {
                this.thePitch(x, y);
            } else if (this.stage == 'swing') {
                this.theSwing(x, y);
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
        autoPitch : function() {
            this.autoPitchSelect();
            var x = Math.floor(Math.random()*200);
            var y = Math.floor(Math.random()*200);
            this.thePitch(x, y);
        },
        autoSwing : function() {
            this.theSwing(Math.floor(Math.random()*200), Math.floor(Math.random()*200));
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
            strike : true,
            foul : true,
            caught : false,
            contact : true,
            looking : false,
            bases : 0,
            fielder : 'short',
            outs : 0
        },
        pitchSelect : function() {

        },
        thePitch : function(x, y) {
            if (this.stage == 'pitch') {
                this.pitchTarget.x = x;
                this.pitchTarget.y = y;

                this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
                this.battersEye = 'Looks like: '+(Math.abs(this.pitchInFlight.breakDirection[0])+Math.abs(this.pitchInFlight.breakDirection[1]) > 40 ?
                    'breaking ball' : 'fastball');

                if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

                this.pitchInFlight.x = Math.floor(x + (this.pitchInFlight.breakDirection[0]*this.pitchInFlight.break/100));
                this.pitchInFlight.y = Math.floor(y + (this.pitchInFlight.breakDirection[1]*this.pitchInFlight.break/100));

                this.stage = 'swing';
                this.log.notePitch(this.pitchInFlight, this.batter);
                if (this.humanControl == 'both' || this.teams[this.humanControl].lineup[this.batter.team.nowBatting] == this.batter) {

                } else {
                    this.autoSwing();
                }
            }
        },
        battersEye : '',
        theSwing : function(x, y) {
            if (this.stage == 'swing') {
                this.swingResult = {};
                this.swingResult.x = x - this.pitchInFlight.x;
                this.swingResult.y = y - this.pitchInFlight.y;
                if (true || swung) {
                    this.swingResult.looking = false;
                    if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                        this.swingResult.contact = true;
                        this.swingResult = this.field.determineSwingContactResult(this.swingResult);
                    } else {
                        this.swingResult.contact = false;
                    }
                } else {
                    this.swingResult.contact = false;
                    this.swingResult.looking = true;
                }

                this.log.noteSwing(this.swingResult);
                this.umpire.makeCall();

                this.stage = 'pitch';
                if (this.humanControl == 'both' || this.teams[this.humanControl].positions.pitcher == this.pitcher) {

                } else {
                    this.autoPitch();
                }
            }
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
    return Game;
});