define(function(){
    var Log = function() {
        this.init();
    };

    Log.prototype = {
        init : function() {
            this.pitchRecord = [];
        },
        note : function(note) {
            this.record.unshift(note);
            this.shortRecord = this.record.slice(0, 20);
        },
        noteBatter : function(batter) {
            var order = batter.team.nowBatting;
            order = {
                0 : ' 1st',
                1 : ' 2nd',
                2 : ' 3rd',
                3 : ' 4th',
                4 : ' 5th',
                5 : ' 6th',
                6 : ' 7th',
                7 : ' 8th',
                8 : ' 9th'
            }[order];
            var positions = this.longFormFielder;
            this.note('Now batting'+order+', '+positions[batter.position]+', '+batter.name);
        },
        notePitch : function(pitchInFlight) {
            this.pitchRecord.unshift(pitchInFlight.name + ' ('+Math.floor(pitchInFlight.x)+', '+Math.floor(pitchInFlight.y)+')');
        },
        noteSwing : function(swingResult) {
            this.pitchRecord.unshift(
                'Swung at, ' + ' ('+Math.floor(swingResult.x)+', '
                    +Math.floor(swingResult.y)+')' + (swingResult.contact ? ' and hit.' : ' and missed.')
            );
        },
        notePlateAppearanceResult : function(game) {
            var r = game.swingResult;
            var batter = game.batter.name;
            if (r.looking) {
                if (r.strike) {
                    this.record.unshift(batter+' struck out looking.');
                } else {
                    this.record.unshift(batter+' walked.');
                }
            } else {
                if (r.contact) {
                    if (r.caught) {
                        this.record.unshift(batter+' flew out to '+ r.fielder + '.');
                    } else {
                        if (r.foul) {
                            // not possible to end PA on foul?
                        } else {
                            if (r.thrownOut) {
                                this.record.unshift(batter+' grounded out to '+ r.fielder + '.');
                            } else {
                                switch (r.bases) {
                                    case 1:
                                        this.record.unshift(batter+' reached on single to '+ r.fielder + '.');
                                        break;
                                    case 2:
                                        this.record.unshift(batter+' doubled past '+ r.fielder + '.');
                                        break;
                                    case 3:
                                        this.record.unshift(batter+' reached third on triple past '+ r.fielder + '.');
                                        break;
                                    case 4:
                                        if (r.splay < -15) {
                                            this.record.unshift(batter+' homered to left.');
                                        } else if (r.splay < 15) {
                                            this.record.unshift(batter+' homered to center.');
                                        } else {
                                            this.record.unshift(batter+' homered to right.');
                                        }
                                        break;
                                }
                            }
                        }
                    }
                } else {
                    this.record.unshift(batter+' struck out swinging.');
                }
            }
        },
        pointer : 0,
        pitchRecord : [],
        shortRecord : [],
        record : [],
        longFormFielder : {
            first : 'first baseman',
            second : 'second baseman',
            third : 'third baseman',
            short : 'shortstop',
            pitcher : 'pitcher',
            catcher : 'catcher',
            left : 'left fielder',
            center : 'center fielder',
            right : 'right fielder'
        }
    };
    return Log;
});