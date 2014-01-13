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
            while (this.teams.away.name == this.teams.home.name) {
                this.teams.away.pickName();
            }
            this.renderer = new baseball.utility.Renderer(this);
            this.umpire = new baseball.Umpire(this);
            if (this.humanControl == 'away' && this.half == 'bottom' || this.half == 'top' && this.humanControl == 'home' || this.humanControl == 'both') {
                this.stage = 'pitch';
            } else {
                this.AIPitch();
            }
        },
        stage : 'pitch', //pitch, swing
        humanControl : 'home', //home, away, both
        receiveInput : function(x, y) {
            log(x, y);
            if (this.stage == 'pitch') {
                this.thePitch(x, y);
            } else {
                this.theSwing(x, y);
            }
        },
        AIPitchSelect : function() {
            pitchName = '4-seam';
            var pitch = this.pitcher.pitching.straight[pitchName];
            pitch.name = pitchName;
            this.pitchInFlight.pitch = this.pitcher.pitching.straight;
        },
        AIPitch : function() {
            this.AIPitchSelect();
            var x = Math.floor(Math.random()*200);
            var y = Math.floor(Math.random()*200);
            this.thePitch(x, y);
        },
        AISwing : function() {
            this.theSwing(Math.floor(Math.random()*200), Math.floor(Math.random()*200));
        },
        pitchInFlight : {
            x : 100,
            y : 100,
            breakDirection : [0, 0],
            pitch : {
                name : '4-seam',
                velocity : 50,
                break : 50,
                control : 50
            }
        },
        swingResult : {
            x : 100, //difference to pitch location
            y : 100, //difference to pitch location
            strike : true,
            foul : true,
            ball : false,
            caught : false,
            contact : true
        },
        thePitch : function(x, y) {
            this.pitchInFlight.breakDirection = [0, 0];
            this.pitchInFlight.x = x + this.pitchInFlight.breakDirection[0];
            this.pitchInFlight.y = y + this.pitchInFlight.breakDirection[1];

            this.log.notePitch(this.pitchInFlight);
            if (this.humanControl == 'home' && this.half == 'bottom' || this.half == 'top' && this.humanControl == 'away' || this.humanControl == 'both') {
                this.stage = 'swing';
            } else {
                this.AISwing();
            }
        },
        theSwing : function(x, y) {
            this.swingResult.x = this.pitchInFlight.x - x;
            this.swingResult.y = this.pitchInFlight.y - y;

            if (Math.abs(this.swingResult.x) < 50 && Math.abs(this.swingResult.y < 50)) {
                this.swingResult.contact = true;
            } else {
                this.swingResult.contact = false;
            }

            this.log.noteSwing(this.swingResult);
            this.umpire.makeCall();
            if (this.humanControl == 'away' && this.half == 'bottom' || this.half == 'top' && this.humanControl == 'home' || this.humanControl == 'both') {
                this.stage = 'pitch';
            } else {
                this.AIPitch();
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