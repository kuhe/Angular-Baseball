var Log = function() {
    this.init();
};

Log.prototype = {
    game : 'instance of Game',
    init : function() {
        this.pitchRecord = {
            e: [],
            n: []
        };
    },
    note : function(note, noteJ) {
        this.record.e.unshift(note);
        this.shortRecord.e = this.record.e.slice(0, 6);

        this.record.n.unshift(noteJ);
        this.shortRecord.n = this.record.n.slice(0, 6);
    },
    getBatter : function(batter) {
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
        return text('Now batting')+order+text.comma()+positions[batter.position]+text.comma()+batter.getName();
    },
    noteBatter : function(batter) {
        var m = mode, record, recordJ;
        mode = 'e';
        record = this.getBatter(batter);
        mode = 'n';
        recordJ = this.getBatter(batter);
        mode = m;
        this.note(record, recordJ);
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
        var m = mode, record, recordJ;
        mode = 'e';
        record = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.e.unshift(record);
        mode = 'n';
        recordJ = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.n.unshift(recordJ);
        mode = m;
    },
    getSwing : function(swingResult) {
        var result = '';
        if (swingResult.looking) {
            if (swingResult.strike) {
                result += text('Strike.')
            } else {
                result += text('Ball.')
            }
        } else {
            if (swingResult.contact) {
                if (swingResult.foul) {
                    result += text('Fouled off.')
                } else {
                    if (swingResult.caught) {
                        result += text('In play.')
                    } else {
                        if (swingResult.thrownOut) {
                            result += text('In play.')
                        } else {
                            result += text('In play.')
                        }
                    }
                }
            } else {
                result += text('Swinging strike.')
            }
        }
        return result;
    },
    noteSwing : function(swingResult) {
        var m = mode, record, recordJ;
        mode = 'e';
        record = this.getSwing(swingResult);
        this.pitchRecord.e[0] += record;
        mode = 'n';
        recordJ = this.getSwing(swingResult);
        this.pitchRecord.n[0] += recordJ;
        mode = m;
    },
    getPlateAppearanceResult : function(game) {
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
        return record;
    },
    notePlateAppearanceResult : function(game) {
        var m = mode, record, recordJ;
        mode = 'e';
        record = this.getPlateAppearanceResult(game);
        this.record.e.unshift(record);
        this.pitchRecord.e = [text('Previous: ')+record];
        mode = 'n';
        recordJ = this.getPlateAppearanceResult(game);
        this.record.n.unshift(recordJ);
        this.pitchRecord.n = [text('Previous: ')+recordJ];
        mode = m;
    },
    pointer : 0,
    pitchRecord : {
        e: [],
        n: []
    },
    shortRecord : {
        e: [],
        n: []
    },
    record : {
        e: [],
        n: []
    },
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