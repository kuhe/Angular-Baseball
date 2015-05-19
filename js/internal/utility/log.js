var Log = function() {
    this.init();
};

Log.prototype = {
    game : 'instance of Game',
    init : function() {
        this.pitchRecord = [];
    },
    note : function(note) {
        this.record.unshift(note);
        this.shortRecord = this.record.slice(0, 6);
    },
    noteBatter : function(batter) {
        var order = batter.team.nowBatting;
        order = {
            0 : text(' 1st'),
            1 : text(' 2nd'),
            2 : text(' 3rd'),
            3 : text(' 4th'),
            4 : text(' 5th'),
            5 : text(' 6th'),
            6 : text(' 7th'),
            7 : text(' 8th'),
            8 : text(' 9th')
        }[order];
        var positions = this.longFormFielder();
        this.note(text('Now batting')+order+text.comma()+positions[batter.position]+text.comma()+batter.getName());
    },
    getPitchLocationDescription : function(pitchInFlight, batterIsLefty) {
        var x = pitchInFlight.x, y = pitchInFlight.y, say = '';
        var noComma = false, noComma2 = false;
        var ball = false;
        if (!batterIsLefty) x = 200 - x;
        if (x < 50) {
            say += text('way outside');
            ball = true;
        } else if (x < 70) {
            say += text('outside');
        } else if (x < 100) {
            say += '';
            noComma = true;
        } else if (x < 130) {
            say += '';
            noComma = true;
        } else if (x < 150) {
            say += text('inside');
        } else {
            say += text('way inside');
            ball = true;
        }
        if (say != '') say += text.comma();
        if (y < 35) {
            say += text('way low');
            ball = true;
        } else if (y < 65) {
            say += text('low');
        } else if (y < 135) {
            say += '';
            noComma2 = true;
        } else if (y < 165) {
            say += text('high');
        } else {
            say += text('way high');
            ball = true;
        }
        if (noComma || noComma2) {
            say = say.split(text.comma()).join('');
            if (noComma && noComma2) {
                say = text('down the middle');
            }
        }
        // say = (ball ? 'Ball, ' : 'Strike, ') + say;
        say = text.namePitch(pitchInFlight) + text.comma() + say + text.stop();
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
                this.pitchRecord[0] += text('Strike.')
            } else {
                this.pitchRecord[0] += text('Ball.')
            }
        } else {
            if (swingResult.contact) {
                if (swingResult.foul) {
                    this.pitchRecord[0] += text('Fouled off.')
                } else {
                    if (swingResult.caught) {
                        this.pitchRecord[0] += text('In play.')
                    } else {
                        if (swingResult.thrownOut) {
                            this.pitchRecord[0] += text('In play.')
                        } else {
                            this.pitchRecord[0] += text('In play.')
                        }
                    }
                }
            } else {
                this.pitchRecord[0] += text('Swinging strike.')
            }
        }
    },
    notePlateAppearanceResult : function(game) {
        var r = game.swingResult;
        var record = '';
        var batter = game.batter.getName();
        if (r.looking) {
            if (r.strike) {
                record = (batter + text(' struck out looking.'));
            } else {
                record = (batter + text(' walked.'));
            }
        } else {
            if (r.contact) {
                var fielder = r.fielder, bases = r.bases, outBy;
                if (r.caught) {
                    if (['left', 'center', 'right'].indexOf(r.fielder) < 0) {
                        outBy = 'pop';
                    } else {
                        outBy = 'fly';
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
                                if (Math.random() > 0.5) {
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
                        }
                    }
                }
                record = text.contactResult(batter, fielder, bases, outBy);
            } else {
                record = (batter+text(' struck out swinging.'));
            }
        }
        this.record.unshift(record);
        this.pitchRecord = [text('Previous: ')+record];
    },
    pointer : 0,
    pitchRecord : [],
    shortRecord : [],
    record : [],
    longFormFielder : function() {
        return {
            first : text('first baseman'),
            second : text('second baseman'),
            third : text('third baseman'),
            short : text('shortstop'),
            pitcher : text('pitcher'),
            catcher : text('catcher'),
            left : text('left fielder'),
            center : text('center fielder'),
            right : text('right fielder')
        }
    }
};