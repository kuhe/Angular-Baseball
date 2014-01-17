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
            this.shortRecord = this.record.slice(0, 8);
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
        getPitchLocationDescription : function(pitchInFlight, batterIsLefty) {
            var x = pitchInFlight.x, y = pitchInFlight.y, say = '';
            var noComma = false, noComma2 = false;
            var ball = false;
            if (!batterIsLefty) x = 200 - x;
            if (x < 50) {
                say += 'way outside';
                ball = true;
            } else if (x < 70) {
                say += 'outside';
            } else if (x < 100) {
                say += '';
                noComma = true;
            } else if (x < 130) {
                say += '';
                noComma = true;
            } else if (x < 150) {
                say += 'inside';
            } else {
                say += 'way inside';
                ball = true;
            }
            if (say != '') say += ', ';
            if (y < 35) {
                say += 'way low';
                ball = true;
            } else if (y < 65) {
                say += 'low';
            } else if (y < 135) {
                say += '';
                noComma2 = true;
            } else if (y < 165) {
                say += 'high';
            } else {
                say += 'way high';
                ball = true;
            }
            if (noComma || noComma2) {
                say = say.split(', ').join('');
                if (noComma && noComma2) {
                    say = 'down the middle';
                }
            }
            // say = (ball ? 'Ball, ' : 'Strike, ') + say;
            say = pitchInFlight.name.charAt(0).toUpperCase() + pitchInFlight.name.slice(1) + ' ' + say + '. ';
            return say;
        },
        notePitch : function(pitchInFlight, batter) {
            this.pitchRecord.unshift(
                this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left')
            );
        },
        noteSwing : function(swingResult) {
            if (swingResult.looking) {
                if (swingResult.strike) {
                    this.pitchRecord[0] += 'Strike.'
                } else {
                    this.pitchRecord[0] += 'Ball.'
                }
            } else {
                if (swingResult.contact) {
                    if (swingResult.foul) {
                        this.pitchRecord[0] += 'Fouled off.'
                    } else {
                        if (swingResult.caught) {
                            this.pitchRecord[0] += 'In play.'
                        } else {
                            if (swingResult.thrownOut) {
                                this.pitchRecord[0] += 'In play.'
                            } else {
                                this.pitchRecord[0] += 'In play.'
                            }
                        }
                    }
                } else {
                    this.pitchRecord[0] += 'Swinging strike.'
                }
            }
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