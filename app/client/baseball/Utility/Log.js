import { text } from '../Utility/text';

const Log = function() {
    this.init();
};

Log.prototype = {
    game : 'instance of Game',
    init() {
        this.stabilized = {
            pitchRecord : {
                e: ['', '', '', '', '', ''],
                n: ['', '', '', '', '', '']
            },
            shortRecord : {
                e: ['', '', '', '', '', ''],
                n: ['', '', '', '', '', '']
            }
        };
        this.pitchRecord = {
            e: [],
            n: []
        };
        this.shortRecord = {
            e: [],
                n: []
        };
        this.record = {
            e: [],
            n: []
        };
    },
    SINGLE : 'H',
    DOUBLE : '2B',
    TRIPLE : '3B',
    HOMERUN : 'HR',
    WALK : 'BB',
    GROUNDOUT : 'GO',
    FLYOUT : 'FO',
    LINEOUT : 'LO',
    RUN : 'R',
    STRIKEOUT : 'SO',
    SACRIFICE : 'SAC',
    REACHED_ON_ERROR : 'ROE',
    FIELDERS_CHOICE : 'FC',
    GIDP : '(IDP)',
    GITP : '(ITP)',
    STOLEN_BASE : 'SB',
    CAUGHT_STEALING : 'CS',
    stabilizeShortRecord() {
        const rec = this.record.e.slice(0, 6);
        this.shortRecord.e = rec;
        this.stabilized.shortRecord.e = rec.concat(['', '', '', '', '', '']).slice(0, 6);

        const rec2 = this.record.n.slice(0, 6);
        this.shortRecord.n = rec2;
        this.stabilized.shortRecord.n = rec2.concat(['', '', '', '', '', '']).slice(0, 6);
    },
    note(note, noteJ, only) {
        //todo fix don't double language when specifying param [only]
        if (only === 'e') {
            this.record.e.unshift(note);
            this.async(() => {
                console.log(note);
            });
        } else if (only === 'n') {
            this.record.n.unshift(noteJ);
            this.async(() => {
                console.log(noteJ);
            });
        } else {
            this.record.e.unshift(note);
            this.record.n.unshift(noteJ);
            this.async(() => {
                if (text.mode === 'n') {
                    console.log(noteJ);
                } else {
                    console.log(note);
                }
            });
        }
        this.stabilizeShortRecord();
    },
    getBatter(batter) {
        let order = batter.team.nowBatting;
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
        const positions = this.longFormFielder();
        return text('Now batting')+order+text.comma()+positions[batter.position]+text.comma()+
            batter.getUniformNumber()+text.comma()+
            batter.getName();
    },
    noteBatter(batter) {
        const m = text.mode;
        let record;
        let recordJ;
        text.mode = 'e';
        record = this.getBatter(batter);
        text.mode = 'n';
        recordJ = this.getBatter(batter);
        text.mode = m;
        this.note(record, recordJ);
    },
    getPitchLocationDescription(pitchInFlight, batterIsLefty) {
        let x = pitchInFlight.x;
        const y = pitchInFlight.y;
        let say = '';
        let noComma = false, noComma2 = false;
        let ball = false;
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
    notePitch(pitchInFlight, batter) {
        const m = text.mode;
        let record;
        let recordJ;
        text.mode = 'e';
        record = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.pop();
        text.mode = 'n';
        recordJ = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.pop();
        text.mode = m;
    },
    broadcastCount(justOuts) {
        if (!this.game.umpire) return '';
        const count = this.game.umpire.count;
        if (this.lastOuts == 2 && count.outs == 0) {
            outs = 3 + text(' outs');
        } else {
            var outs = count.outs + (count.outs == 1 ? text(' out') : text(' outs'));
        }
        this.lastOuts = count.outs;
        if (justOuts) {
            return outs + text.stop();
        }
        return `${this.game.getInning()}: ${count.strikes}-${count.balls}, ${outs}${text.stop()}`;
    },
    broadcastScore() {
        return `${this.game.teams.away.getName()} ${this.game.tally.away.R}, ${this.game.teams.home.getName()} ${this.game.tally.home.R}${text.stop()}`;
    },
    broadcastRunners() {
        const field = this.game.field;
        const runners = [
            field.first && text('first') || '',
            field.second && text('second') || '',
            field.third && text('third') || ''
        ].filter(x => x);

        let runnerCount = 0;
        runners.map(runner => {
            if (runner) {
                runnerCount++;
            }
        });

        switch (runnerCount) {
            case 0:
                return text('Bases empty') + text.stop();
            case 1:
                return `${text('Runner on')}: ${runners.join(text.comma())}${text.stop()}`;
            default:
                return `${text('Runners on')}: ${runners.join(text.comma())}${text.stop()}`;
        }
    },
    getSwing(swingResult) {
        let result = '';
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
        let steal = '';
        if (swingResult.stoleABase) {
            steal = this.noteStealAttempt(swingResult.stoleABase, true, swingResult.attemptedBase);
        }
        if (swingResult.caughtStealing) {
            steal = this.noteStealAttempt(swingResult.caughtStealing, false, swingResult.attemptedBase);
        }
        if (steal) {
            this.note(steal, steal, text.mode);
        }
        return result + steal;
    },
    noteSwing(swingResult) {
        const m = text.mode;
        let record;
        let recordJ;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;
        text.mode = 'e';
        record = this.getSwing(swingResult);
        pitchRecord.e[0] += record;
        stabilized.e[0] += record;
        text.mode = 'n';
        recordJ = this.getSwing(swingResult);
        pitchRecord.n[0] += recordJ;
        stabilized.n[0] += recordJ;
        text.mode = m;
        recordJ = stabilized.n[0];
        record = stabilized.e[0];
        const giraffe = this;
        record.indexOf('Previous') !== 0 && this.async(() => {
            if (record.indexOf('In play') > -1 && record.indexOf('struck out') > -1) {
                if (text.mode === 'n') {
                    console.log(recordJ);
                } else {
                    console.log(record);
                }
            } else {
                if (text.mode === 'n') {
                    console.log(giraffe.broadcastCount(), recordJ);
                } else {
                    console.log(giraffe.broadcastCount(), record);
                }
            }
        });
    },
    async(fn) {
        if (!this.game.console) {
            setTimeout(fn, 100);
        }
    },
    noteStealAttempt(thief, success, base) {
        return `${text.space() + thief.getName() + text.comma()
    + (success ? text('stolen base') : text('caught stealing')) + text.space()}(${text.baseShortName(base)})${text.stop()}`;
    },
    noteSubstitution(sub, player) {
        return this.note(text.substitution(sub, player, 'e'), text.substitution(sub, player, 'n'));
    },
    getPlateAppearanceResult(game) {
        const r = game.swingResult;
        let record = '';
        const batter = game.batter.getName();
        let out = [];
        if (r.looking) {
            if (r.strike) {
                record = (batter + text(' struck out looking.'));
            } else {
                record = (batter + text(' walked.'));
            }
            let steal = '';
            if (r.stoleABase) {
                steal = this.noteStealAttempt(r.stoleABase, true, r.attemptedBase);
            }
            if (r.caughtStealing) {
                steal = this.noteStealAttempt(r.caughtStealing, false, r.attemptedBase);
            }
            record += steal;
        } else {
            if (r.contact) {
                let fielder = r.fielder, bases = r.bases, outBy;
                if (r.caught) {
                    if (r.flyAngle < 15) {
                        outBy = 'line';
                    } else {
                        if (['left', 'center', 'right'].indexOf(r.fielder) < 0) {
                            outBy = 'pop';
                        } else {
                            outBy = 'fly';
                        }
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
                                if (Math.random() < 0.5) {
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
                            if (r.firstOut) {
                                out = out.concat(r.additionalOuts.filter(runner => runner !== 'batter'));
                                out.doublePlay = r.doublePlay;
                            }
                            if (r.fieldersChoice) {
                                out.push(r.fieldersChoice);
                                if (r.outs == 3) {
                                    outBy = 'ground';
                                } else {
                                    outBy = 'fieldersChoice';
                                }
                            }
                        }
                    }
                }
                record = text.contactResult(batter, fielder, bases, outBy, r.outs === 3 ? [] : r.sacrificeAdvances, out);
            } else {
                record = (batter + text(' struck out swinging.'));
            }
        }
        return record;
    },
    notePlateAppearanceResult(game) {
        const m = text.mode, prevJ = text('Previous: ', 'n'), prev = text('Previous: ', 'e');

        let statement;
        const record = this.record;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;

        text.mode = 'e';
        const result = this.getPlateAppearanceResult(game);
        record.e.unshift(result);
        statement = prev + result;
        pitchRecord.e = [statement];
        stabilized.e = [statement, '', '', '', '', ''];

        text.mode = 'n';
        const resultJ = this.getPlateAppearanceResult(game);
        record.n.unshift(resultJ);
        statement = prevJ + resultJ;
        pitchRecord.n = [statement];
        stabilized.n = [statement, '', '', '', '', ''];

        text.mode = m;
        const giraffe = this;
        this.async(() => {
            if (text.mode === 'n') {
                console.log([`%c${resultJ}`, giraffe.broadcastCount(true), giraffe.broadcastScore(), giraffe.broadcastRunners()].join(' '),
                    'color: darkgreen;');
            } else {
                console.log([`%c${result}`, giraffe.broadcastCount(true), giraffe.broadcastScore(), giraffe.broadcastRunners()].join(' '),
                    'color: darkgreen;');
            }
        });
    },
    pointer : 0,
    stabilized: {
        pitchRecord : {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        },
        shortRecord : {
            e: ['', '', '', '', '', ''],
            n: ['', '', '', '', '', '']
        }
    },
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
    longFormFielder() {
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

export { Log }