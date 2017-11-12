(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./Utility/text.js
const text_text = (phrase, override) => {
    if (!text_text.mode) text_text.mode = 'e';
    const string = {
        n : {
            empty: '-',
            ' 1st' : '1番',
            ' 2nd' : '2番',
            ' 3rd' : '3番',
            ' 4th' : '4番',
            ' 5th' : '5番',
            ' 6th' : '6番',
            ' 7th' : '7番',
            ' 8th' : '8番',
            ' 9th' : '9番',
            'Now batting' : '次のバッター',
            'way outside' : '相当外角',
            'outside' : '外角',
            'inside' : '内角',
            'way inside' : '相当内角',
            'way low' : '相当低め',
            'low' : '低め',
            'high' : '高め',
            'way high' : '相当高め',
            'down the middle' : '真ん中',
            'first baseman': 'ファースト',
            'second baseman': 'セカンド',
            'third baseman': 'サード',
            'shortstop': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left fielder': 'レフト',
            'center fielder': 'センター',
            'right fielder': 'ライト',
            'Strike.' : 'ストライク。',
            'Ball.' : 'ボール。',
            'Fouled off.': 'ファウル。',
            'In play.': 'インプレー。',
            'Swinging strike.': '空振り。',
            ' outs': 'アウト',
            ' out': 'アウト',
            '4-seam': 'ストレート',
            '2-seam': 'シュート',
            'slider': 'スライダー',
            'fork': 'フォーク',
            'cutter': 'カット',
            'sinker': 'シンカー',
            'curve': 'カーブ',
            'change': 'チェンジ',
            ' struck out looking.': '、見逃し三振。',
            ' walked.': '、フォアボール。',
            ' struck out swinging.': '、空振り三振。',
            'Previous: ': '前：',
            'looks like: ': '予想',
            'breaking ball': '変化球',
            'fastball': 'ストレート',
            'Batting, ': '打球',
            'Catching, pitch selection': '捕球選択',
            'Season': '記録',
            'Game': '今試合',
            'Pitch': '球',
            'Control': '制球',
            'Velocity': '速度',
            'Break': '変化',
            'At Bat': 'バッター',
            'On Deck': '次バッター',
            'Eye': '目',
            'Power': '力',
            'Speed': '速',
            'Up to Bat': '打席',
            'Fielding': '守備',
            'Pitching': '投球',
            'BA' : '打率',
            'OBP' : '出塁',
            'SLG' : '長打',
            'PA' : '打席',
            'H 2B 3B HR' : '安 二 三 本',
            'H' : '安',
            '2B' : '二',
            '3B' : '三',
            'HR' : '本塁打',
            'RBI' : '打点',
            'R' : '得点',
            'BB' : '四球',
            'SO' : '三振',

            'ERA': '防御率',
            'W': '勝',
            'K' : '三振',

            'first' : 'ファースト',
            'second' : 'セカンド',
            'third' : 'サード',
            'Runner on' : 'ランナー',
            'Runners on' : 'ランナー',
            'Bases empty': 'ランナーなし',
            'base' : '塁',

            'stolen base' : '盗塁成功',
            'caught stealing' : '盗塁失敗',

            'Steal' : '盗塁',
            'Opportunistic' : '自由',
            'Hold' : '止まれ',

            'Select Language:' : '言語',
            'Run Fast Simulation' : 'シミュレーションを試合終了まで行う',
            'Play Ball!' : 'プレーボール',
            'Spectate the CPU': 'CPU観戦',
            'Play from the 7th': '７回からプレーする',

            'Throws/Bats' : ' ',
            'LHP' : '左投',
            'RHP' : '右投',
            'LHB' : '左打',
            'RHB' : '右打',
            'L' : '左投',
            'R ' : '右投',
            ' L ' : '左打',
            ' R ' : '右打',
            '#' : '背番号',

            'Opponent connected' : '相手選手見参',
            'Click Here' : 'ここにクリック',

            'Amateur Baseball Club' : '野球愛好会',
            'Amateur Baseball Team' : '愛好球団',
            'College Team' : '大学球団',
            'Industrial League Team' : '社会人球団',
            'Training Squad' : '練習軍',
            'Team Japan': '日本代表',

            'Substituted' : '交代',
            'Bench': 'ベンチ',

            'Batter Ready' : '打撃準備',

            // descriptors pitching
            'Ace' : 'エース',
            'Control pitcher' : '技巧派',
            'Flamethrower' : '速球派',
            'Breaking ball' : '変化球',
            // descriptors batting
            'Genius batter' : '天才',
            'Contact' : 'バットコントロール',
            'Power hitter' : '主砲',
            'Speedster' : '足速い',
            'Inept': '不器用',
            'Weak swing': '弱い',
            'Strikes out': '三振がち',
            'Leisurely runner': '悠長',
            //'' : '',
            //'' : '',
            // descriptors fielding
            'Defensive wizard' : '守備万能',
            'Glove' : '好守',
            'Range' : 'レンジ',
            'Strong throw' : '肩強い',
            //'' : '',
            //'' : '',
            'Very late': 'とても遅め',
            'Late': '遅め',
            '': '',
            'Early': '早め',
            'Very Early': 'とても早め',

            'Sim At Bat': '自動打撃'
        },
        e : {
            empty: '-',
            'Season': 'Season',
            Fielding: 'F%',
            Pitching: 'P',
            Eye: 'Eye',
            Power: 'Pow',
            Speed: 'Spd'
        }
    }[override ? override : text_text.mode][phrase];
    return string ? string : phrase;
};

text_text.substitution = (sub, player, mode) => {
    const originalMode = text_text.mode;
    mode = mode || text_text.mode;
    const order = {
        0 : text_text(' 1st', mode),
        1 : text_text(' 2nd', mode),
        2 : text_text(' 3rd', mode),
        3 : text_text(' 4th', mode),
        4 : text_text(' 5th', mode),
        5 : text_text(' 6th', mode),
        6 : text_text(' 7th', mode),
        7 : text_text(' 8th', mode),
        8 : text_text(' 9th', mode)
    }[player.order];
    const position = text_text.fielderShortName(player.position, mode);

    if (mode === 'n') {
        text_text.mode = 'n';
        var output = `${sub.getName() + text_text.comma() + player.getName()}の交代${text_text.comma()}${order}(${position})`;
    } else {
        text_text.mode = 'e';
        output = `${sub.getName()} replaces ${player.getName()} at ${position}, batting${order}`;
    }
    text_text.mode = originalMode;
    return output;
};

text_text.getBattersEye = game => {
    const eye = {}, breaking = Math.abs(game.pitchInFlight.breakDirection[0]) + Math.abs(game.pitchInFlight.breakDirection[1]) > 40;
    eye.e =
        text_text('looks like: ', 'e')+
        breaking ? text_text('breaking ball', 'e') : text_text('fastball', 'e');
    eye.n =
        text_text('looks like: ', 'n')+
        breaking ? text_text('breaking ball', 'n') : text_text('fastball', 'n');
    return eye;
};

text_text.baseShortName = base => {
    if (text_text.mode == 'n') {
        return {
            '1st': '一',
            '2nd': '二',
            '3rd': '三',
            'home' : '本',
            'Home' : '本',

            'left': '左',
            'center': '中',
            'right': '右'
        }[base];
    }
    return base;
};

text_text.fielderShortName = (fielder, override) => {
    const mode = override || text_text.mode;
    if (mode === 'n') {
        return {
            'first': '一',
            'second': '二',
            'third': '三',
            'short': '遊',
            'pitcher': '投',
            'catcher': '捕',
            'left': '左',
            'center': '中',
            'right': '右'
        }[fielder];
    }
    return fielder;
};

text_text.slash = () => {
    if (text_text.mode == 'n') {
        return '・';
    }
    return '/';
};

text_text.fielderLongName = fielder => {
    if (text_text.mode == 'n') {
        return {
            'first': 'ファースト',
            'second': 'セカンド',
            'third': 'サード',
            'short': 'ショート',
            'pitcher': 'ピッチャー',
            'catcher': 'キャッチャー',
            'left': 'レフト',
            'center': 'センター',
            'right': 'ライト'
        }[fielder]
    }
    return {
        first : text_text('first baseman'),
        second : text_text('second baseman'),
        third : text_text('third baseman'),
        short : text_text('shortstop'),
        pitcher : text_text('pitcher'),
        catcher : text_text('catcher'),
        left : text_text('left fielder'),
        center : text_text('center fielder'),
        right : text_text('right fielder')
    }[fielder];
};

text_text.comma = () => ({n: '、', e: ', '})[text_text.mode];
text_text.space = () => ({n: '', e: ' '})[text_text.mode];
text_text.stop = () => ({n: '。', e: '. '})[text_text.mode];

text_text.namePitch = pitch => {
    if (text_text.mode == 'e') {
        return pitch.name.charAt(0).toUpperCase() + pitch.name.slice(1)
    }
    if (text_text.mode == 'n') {
        return text_text(pitch.name)
    }
};

text_text.contactResult = (batter, fielder, bases, outBy, sacrificeAdvances, out) => {
    let statement = '';
    const infield = ['left', 'center', 'right'].indexOf(fielder) < 0;
    const doublePlay = out.doublePlay;
    if (text_text.mode == 'e') {
        statement += batter;
        if (outBy) {
            switch (outBy) {
                case 'fieldersChoice':
                    play = out.length === 2 ? 'double play ' : '';
                    statement += ` reached on a fielder's choice ${play}by ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'line':
                    statement += ` lined out to ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'fly':
                    statement += ` flew out to ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'error':
                    statement += ` reached on error by ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'pop':
                    statement += ` popped out to ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'ground':
                    var play = doublePlay ? 'into a double play by' : 'out to';
                    statement += ` grounded ${play} ${text_text.fielderShortName(fielder)}`;
                    break;
                case 'thrown':
                    play = doublePlay ? ' on a double play' : '';
                    statement += ` was thrown out by ${text_text.fielderShortName(fielder)}${play}`;
                    break;
            }
            if (out.length) {
                const plural = out.length > 1;
                const runner = plural ? 'Runners' : 'Runner';
                const is = plural ? 'are' : 'is';
                statement += `. ${runner} from ${text_text(out.join(text_text.comma()))} ${is} out`;
            }
        } else {
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += ` reached on an infield hit to ${text_text.fielderShortName(fielder)}`;
                    } else {
                        statement += ` reached on a single to ${text_text.fielderShortName(fielder)}`;
                    }
                    break;
                case 2:
                    statement += ` doubled past ${text_text.fielderShortName(fielder)}`;
                    break;
                case 3:
                    statement += ` tripled past ${text_text.fielderShortName(fielder)}`;
                    break;
                case 4:
                    statement += ` homered to ${text_text.fielderShortName(fielder)}`;
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(base => {
                if (base == 'third') {
                    statement += `${text_text.stop()}Runner on third scores`;
                } else {
                    statement += `${text_text.stop()}Runner on ${base} advances`;
                }
            });
        }
        statement += text_text.stop();
    }
    if (text_text.mode == 'n') {
        const stop = text_text.stop();
        statement += `${batter}は`;
        if (outBy) {
            const fielderLong = text_text.fielderLongName(fielder);
            fielder = text_text.fielderShortName(fielder);
            switch (outBy) {
                case 'fieldersChoice':
                    statement += `野選(${fielder})で出塁`;
                    break;
                case 'line':
                    statement += `${fielder}直`;
                    break;
                case 'fly':
                    statement += `${fielder}飛`;
                    break;
                case 'error':
                    statement += `エラー(${fielder})で出塁`;
                    break;
                case 'pop':
                    statement += `ポップフライで${fielder}飛`;
                    break;
                case 'ground':
                    statement += `${fielderLong}ゴロに封殺`;
                    break;
                case 'thrown':
                    statement += `${fielder}ゴロ`;
                    break;
            }
            if (out.length) {
                statement += `。${out.map(runner => text_text(runner)).join(text_text.comma())}ランナーはアウト`;
            }
            if (doublePlay) {
                statement += '。ゲッツー';
            }
        } else {
            fielder = text_text.fielderShortName(fielder);
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += `内野安打(${fielder})で出塁`;
                    } else {
                        statement += `安打(${fielder})で出塁`;
                    }
                    break;
                case 2:
                    statement += `二塁打（${fielder}）で出塁`;
                    break;
                case 3:
                    statement += `三塁打（${fielder}）で出塁`;
                    break;
                case 4:
                    statement += `本塁打（${fielder}）`;
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(base => {
                if (base === 'third') {
                    statement += `${stop}サードランナーホームイン`;
                } else {
                    statement += `${stop + text_text(base)}ランナー進塁`;
                }
            });
        }
        statement += stop;
    }
    return statement;
};



const abbreviatePosition = function (position) {
    if (text_text.mode === 'e') {
        return {
            pitcher : 'P',
            catcher : 'C',
            first : '1B',
            second : '2B',
            short : 'SS',
            third : '3B',
            left : 'LF',
            center : 'CF',
            right : 'RF'
        }[position];
    }
    return text_text.fielderShortName(position);
};

// CONCATENATED MODULE: ./Utility/Log.js


const Log = function() {
    this.init();
};

Log.prototype = {
    game : 'instance of Game',
    init() {
        this.lastSwing = '';
        this.lastSwingJ = '';
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
                if (text_text.mode === 'n') {
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
            0 : text_text(' 1st'),
            1 : text_text(' 2nd'),
            2 : text_text(' 3rd'),
            3 : text_text(' 4th'),
            4 : text_text(' 5th'),
            5 : text_text(' 6th'),
            6 : text_text(' 7th'),
            7 : text_text(' 8th'),
            8 : text_text(' 9th')
        }[order];
        const positions = this.longFormFielder();
        return text_text('Now batting')+order+text_text.comma()+positions[batter.position]+text_text.comma()+
            batter.getUniformNumber()+text_text.comma()+
            batter.getName();
    },
    noteBatter(batter) {
        const m = text_text.mode;
        let record;
        let recordJ;
        text_text.mode = 'e';
        record = this.getBatter(batter);
        text_text.mode = 'n';
        recordJ = this.getBatter(batter);
        text_text.mode = m;
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
            say += text_text('way outside');
            ball = true;
        } else if (x < 70) {
            say += text_text('outside');
        } else if (x < 100) {
            say += '';
            noComma = true;
        } else if (x < 130) {
            say += '';
            noComma = true;
        } else if (x < 150) {
            say += text_text('inside');
        } else {
            say += text_text('way inside');
            ball = true;
        }
        if (say != '') say += text_text.comma();
        if (y < 35) {
            say += text_text('way low');
            ball = true;
        } else if (y < 65) {
            say += text_text('low');
        } else if (y < 135) {
            say += '';
            noComma2 = true;
        } else if (y < 165) {
            say += text_text('high');
        } else {
            say += text_text('way high');
            ball = true;
        }
        if (noComma || noComma2) {
            say = say.split(text_text.comma()).join('');
            if (noComma && noComma2) {
                say = text_text('down the middle');
            }
        }
        // say = (ball ? 'Ball, ' : 'Strike, ') + say;
        say = text_text.namePitch(pitchInFlight) + text_text.comma() + say + text_text.stop();
        return say;
    },
    notePitch(pitchInFlight, batter) {
        const m = text_text.mode;
        let record;
        let recordJ;
        text_text.mode = 'e';
        record = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.unshift(record);
        this.stabilized.pitchRecord.e.pop();
        text_text.mode = 'n';
        recordJ = this.getPitchLocationDescription(pitchInFlight, batter.bats == 'left');
        this.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.unshift(recordJ);
        this.stabilized.pitchRecord.n.pop();
        text_text.mode = m;
    },
    broadcastCount(justOuts) {
        if (!this.game.umpire) return '';
        const count = this.game.umpire.count;
        if (this.lastOuts == 2 && count.outs == 0) {
            outs = 3 + text_text(' outs');
        } else {
            var outs = count.outs + (count.outs == 1 ? text_text(' out') : text_text(' outs'));
        }
        this.lastOuts = count.outs;
        if (justOuts) {
            return outs + text_text.stop();
        }
        return `${this.game.getInning()}: ${count.strikes}-${count.balls}, ${outs}${text_text.stop()}`;
    },
    broadcastScore() {
        return `${this.game.teams.away.getName()} ${this.game.tally.away.R}, ${this.game.teams.home.getName()} ${this.game.tally.home.R}${text_text.stop()}`;
    },
    broadcastRunners() {
        const field = this.game.field;
        const runners = [
            field.first && text_text('first') || '',
            field.second && text_text('second') || '',
            field.third && text_text('third') || ''
        ].filter(x => x);

        let runnerCount = 0;
        runners.map(runner => {
            if (runner) {
                runnerCount++;
            }
        });

        switch (runnerCount) {
            case 0:
                return text_text('Bases empty') + text_text.stop();
            case 1:
                return `${text_text('Runner on')}: ${runners.join(text_text.comma())}${text_text.stop()}`;
            default:
                return `${text_text('Runners on')}: ${runners.join(text_text.comma())}${text_text.stop()}`;
        }
    },
    getSwing(swingResult) {
        let result = '';
        if (swingResult.looking) {
            if (swingResult.strike) {
                result += text_text('Strike.')
            } else {
                result += text_text('Ball.')
            }
        } else {
            const timing = [
                'Very late',
                'Late',
                '',
                'Early',
                'Very Early'
            ][Math.max(0, Math.min(4,
                ((swingResult.timing|0) + 175)/70 | 0
            ))];
            if (timing) {
                result += '('+text_text(timing)+')' + text_text.space();
            }

            if (swingResult.contact) {
                if (swingResult.foul) {
                    result += text_text('Fouled off.')
                } else {
                    if (swingResult.caught) {
                        result += text_text('In play.')
                    } else {
                        if (swingResult.thrownOut) {
                            result += text_text('In play.')
                        } else {
                            result += text_text('In play.')
                        }
                    }
                }
            } else {
                result += text_text('Swinging strike.')
            }
        }
        let steal = '';
        const lineup = this.game.batter.team.lineup;
        if (!isNaN(swingResult.stoleABase)) {
            const thief = lineup[swingResult.stoleABase];
            steal = this.noteStealAttempt(thief, true, swingResult.attemptedBase);
        }
        if (!isNaN(swingResult.caughtStealing)) {
            const thief = lineup[swingResult.caughtStealing];
            steal = this.noteStealAttempt(thief, false, swingResult.attemptedBase);
        }
        if (steal) {
            this.note(steal, steal, text_text.mode);
        }
        return result + steal;
    },
    noteSwing(swingResult) {
        const m = text_text.mode;
        let record;
        let recordJ;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;
        text_text.mode = 'e';
        record = this.getSwing(swingResult);
        pitchRecord.e[0] += record;
        stabilized.e[0] += record;
        text_text.mode = 'n';
        recordJ = this.getSwing(swingResult);
        pitchRecord.n[0] += recordJ;
        stabilized.n[0] += recordJ;
        text_text.mode = m;
        recordJ = stabilized.n[0];
        record = stabilized.e[0];
        const giraffe = this;

        this.lastSwing = record;
        this.lastSwingJ = recordJ;

        record.indexOf('Previous') !== 0 && this.async(() => {
            if (record.indexOf('In play') > -1 && record.indexOf('struck out') > -1) {
                if (text_text.mode === 'n') {
                    console.log(recordJ);
                } else {
                    console.log(record);
                }
            } else {
                if (text_text.mode === 'n') {
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
        return `${text_text.space() + thief.getName() + text_text.comma()
    + (success ? text_text('stolen base') : text_text('caught stealing')) + text_text.space()}(${text_text.baseShortName(base)})${text_text.stop()}`;
    },
    noteSubstitution(sub, player) {
        return this.note(text_text.substitution(sub, player, 'e'), text_text.substitution(sub, player, 'n'));
    },
    getPlateAppearanceResult(game) {
        const r = game.swingResult;
        let record = '';
        const batter = game.batter.getName();
        let out = [];
        if (r.looking) {
            if (r.strike) {
                record = (batter + text_text(' struck out looking.'));
            } else {
                record = (batter + text_text(' walked.'));
            }
            let steal = '';
            const lineup = this.game.batter.team.lineup;
            if (!isNaN(r.stoleABase)) {
                const thief = lineup[r.stoleABase];
                steal = this.noteStealAttempt(thief, true, r.attemptedBase);
            }
            if (!isNaN(r.caughtStealing)) {
                const thief = lineup[r.caughtStealing];
                steal = this.noteStealAttempt(thief, false, r.attemptedBase);
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
                record = text_text.contactResult(batter, fielder, bases, outBy, r.outs === 3 ? [] : r.sacrificeAdvances, out);
            } else {
                record = (batter + text_text(' struck out swinging.'));
            }
        }
        return record;
    },
    notePlateAppearanceResult(game) {
        const m = text_text.mode, prevJ = text_text('Previous: ', 'n'), prev = text_text('Previous: ', 'e');

        let statement;
        const record = this.record;
        const pitchRecord = this.pitchRecord;
        const stabilized = this.stabilized.pitchRecord;

        text_text.mode = 'e';
        const result = this.getPlateAppearanceResult(game);
        record.e.unshift(result);
        statement = prev + this.lastSwing + text_text.space() + result;
        pitchRecord.e = [statement];
        stabilized.e = [statement, '', '', '', '', ''];

        text_text.mode = 'n';
        const resultJ = this.getPlateAppearanceResult(game);
        record.n.unshift(resultJ);
        statement = prevJ + this.lastSwingJ + text_text.space() + resultJ;
        pitchRecord.n = [statement];
        stabilized.n = [statement, '', '', '', '', ''];

        text_text.mode = m;
        const giraffe = this;
        this.async(() => {
            if (text_text.mode === 'n') {
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
            first : text_text('first baseman'),
            second : text_text('second baseman'),
            third : text_text('third baseman'),
            short : text_text('shortstop'),
            pitcher : text_text('pitcher'),
            catcher : text_text('catcher'),
            left : text_text('left fielder'),
            center : text_text('center fielder'),
            right : text_text('right fielder')
        }
    }
};


// CONCATENATED MODULE: ./Model/AtBat.js


/**
 *
 * e.g. "HR++" (HR and 2 extra runs), "SO" strikeout, "FO" flyout
 *
 */
class AtBat_AtBat {
    constructor(text) {
        this.infield = text.includes(AtBat_AtBat.prototype.INFIELD_HIT_INDICATOR) ? AtBat_AtBat.prototype.INFIELD_HIT_INDICATOR : '';
        text = text.replace(AtBat_AtBat.prototype.INFIELD_HIT_INDICATOR, '');
        this.text = text.split(AtBat_AtBat.prototype.RBI_INDICATOR)[0];
        this.rbi = (`${text.split(this.text)[1]}`);

        const log = new Log();

        const beneficial = [
            log.WALK, log.SINGLE, log.HOMERUN, log.DOUBLE, log.TRIPLE, log.SACRIFICE, log.REACHED_ON_ERROR,
            log.STOLEN_BASE, log.RUN
        ];
        if (beneficial.includes(this.text)) {
            this.beneficial = true;
        }
    }
    toString() {
        return `${this.infield}${this.text}${this.rbi}`;
    }
}

AtBat_AtBat.prototype.constructor = AtBat_AtBat;
AtBat_AtBat.prototype.identifier = 'AtBat';
AtBat_AtBat.prototype.INFIELD_HIT_INDICATOR = '';
AtBat_AtBat.prototype.RBI_INDICATOR = '+';


// CONCATENATED MODULE: ./Utility/data.js
const data_data = {
    surnames : [
        'Sato',
        'Suzuki',
        'Takahashi',
        'Tanaka',
        'Watanabe',
        'Ito',
        'Nakamura',
        'Kobayashi',
        'Yamamoto',
        'Kato',
        'Yoshida',
        'Yamada',
        'Sasaki',
        'Yamaguchi',
        'Matsumoto',
        'Inoue',
        'Kimura',
        'Shimizu',
        'Hayashi',
        'Saito',
        'Saito',
        'Yamazaki',
        'Nakajima',
        'Mori',
        'Abe',
        'Ikeda',
        'Hashimoto',
        'Ishikawa',
        'Yamashita',
        'Ogawa',
        'Ishii',
        'Hasegawa',
        'Goto',
        'Okada',
        'Kondo',
        'Maeda',
        'Fujita',
        'Endo',
        'Aoki',
        'Sakamoto',
        'Murakami',
        'Ota',
        'Kaneko',
        'Fujii',
        'Fukuda',
        'Nishimura',
        'Miura',
        'Takeuchi',
        'Nakagawa',
        'Okamoto',
        'Matsuda',
        'Harada',
        'Nakano'
    ],
    surnamesJ : [
        '佐藤',
        '鈴木',
        '高橋',
        '田中',
        '渡辺',
        '伊藤',
        '中村',
        '小林',
        '山本',
        '加藤',
        '吉田',
        '山田',
        '佐々木',
        '山口',
        '松本',
        '井上',
        '木村',
        '清水',
        '林',
        '斉藤',
        '斎藤',
        '山崎',
        '中島',
        '森',
        '阿部',
        '池田',
        '橋本',
        '石川',
        '山下',
        '小川',
        '石井',
        '長谷川',
        '後藤',
        '岡田',
        '近藤',
        '前田',
        '藤田',
        '遠藤',
        '青木',
        '坂本',
        '村上',
        '太田',
        '金子',
        '藤井',
        '福田',
        '西村',
        '三浦',
        '竹内',
        '中川',
        '岡本',
        '松田',
        '原田',
        '中野'
    ],

    namesJ: [
        '匠',
        'ヒカル',
        'ゆうき',
        '翔太',
        '冬馬',
        '漣',
        '港区',
        'ルイ',
        '樹',
        '賢治',
        '五木',
        '春',
        '光一',
        '宗介',
        'こうすけ',
        '雄太',
        '大樹',
        '瑛太',
        // newer set
        '宏',
        '亨',
        '道夫',
        '聡',
        '昭',
        '茂雄',
        '勝',
        '純一',
        '和夫',
        '勲',
        '省三',
        '隆',
        '達夫',
        '正一',
        '輝夫',
        '俊夫',
        '史郎',
        '勇',
        '義弘',
        '良雄',
        '登',
        '義明',
        '正義',
        '秀夫',
        '肇',
        '月',
        '克己',
        '正男',
        '光男',
        '久',
        '耕三',
        '清',
        '次郎',
        '正博',
        '明子',
        '武',
        '勉',
        '晴夫',
        '裕二',
        '稔',
        '障子',
        '和子',
        '敦',
        '茂',
        '信夫',
        '恵一',
        '忠',
        '高尾',
        '薫',
        'ケン',
        '健治',
        '哲夫',
        '啓二',
        '光一',
        '真一',
        '貞夫',
        '靖',
        '武',
        '雄',
        '文雄',
        '久雄',
        '一朗',
        '健一',
        '正明',
        '五郎',
        '誠',
        '昭夫',
        '誠司',
        '洋一',
        '康夫',
        '誠一',
        '正美',
        '則夫',
        '幸雄',
        '忠雄',
        '仁',
        'シンジ',
        '豊',
        '邦雄',
        '修',
        '雅之',
        '三郎',
        '英治',
        '浩二',
        '栄一',
        '恒夫',
        '義郎',
        '進',
        '博之',
        '巌'
    ],
    names : [
        'Takumi',
        'Hikaru',
        'Yuuki',
        'Shouta',
        'Touma',
        'Ren',
        'Minato',
        'Rui',
        'Tatsuki',
        'Kenji',
        'Itsuki',
        'Haru',
        'Kouichi',
        'Sousuke',
        'Kousuke',
        'Yuuta',
        'Daiki',
        'Eita',
        // newer set
        'Hiroshi',
        'Toru',
        'Michio',
        'Satoshi',
        'Akira',
        'Shigeo',
        'Masaru',
        'Junichi',
        'Kazuo',
        'Isao',
        'Shozo',
        'Takashi',
        'Tatsuo',
        'Shoichi',
        'Teruo',
        'Toshio',
        'Shiro',
        'Isamu',
        'Yoshihiro',
        'Yoshio',
        'Noboru',
        'Yoshiaki',
        'Tadayoshi',
        'Hideo',
        'Hajime',
        'Akari',
        'Katsumi',
        'Masao',
        'Mitsuo',
        'Hisashi',
        'Kozo',
        'Kiyoshi',
        'Jiro',
        'Masahiro',
        'Akiko',
        'Takeshi',
        'Tsutomu',
        'Haruo',
        'Yuji',
        'Minoru',
        'Shoji',
        'Kazuko',
        'Atsushi',
        'Shigeru',
        'Shinobu',
        'Keiichi',
        'Tadashi',
        'Takao',
        'Kaoru',
        'Ken',
        'Kenji',
        'Tetsuo',
        'Keiji',
        'Koichi',
        'Shinichi',
        'Sadao',
        'Yasushi',
        'Takeshi',
        'Yu',
        'Fumio',
        'Hisao',
        'Ichiro',
        'Kenichi',
        'Masaaki',
        'Goro',
        'Makoto',
        'Akio',
        'Seiji',
        'Yoichi',
        'Yasuo',
        'Seiichi',
        'Masami',
        'Norio',
        'Yukio',
        'Tadao',
        'Hitoshi',
        'Shinji',
        'Yutaka',
        'Kunio',
        'Osamu',
        'Masayuki',
        'Saburo',
        'Eiji',
        'Koji',
        'Eiichi',
        'Tsuneo',
        'Yoshio',
        'Susumu',
        'Hiroyuki',
        'Iwao'
    ],
    teamNamesJ : [
        '横浜',
        '大阪',
        '名古屋',
        '札幌',
        '神戸',
        '京都',
        '福岡',
        '川崎',
        '埼玉県',
        '広島',
        '仙台',
        '千葉県',
        '新潟',
        '浜松',
        '静岡',
        '相模原',
        '岡山',
        '熊本',
        '鹿児島',
        '船橋',
        '川口',
        '姫路',
        '松山',
        '宇都宮',
        '松戸',
        '西宮',
        '倉敷',
        '市川',
        '福山',
        '尼崎',
        '金沢',
        '長崎',
        '横須賀',
        '富山',
        '高松',
        '町田',
        '岐阜',
        '枚方',
        '藤沢',
        '柏',
        '豊中',
        '長野県',
        '豊橋',
        '一宮',
        '和歌山',
        '岡崎',
        '宮崎',
        '奈良',
        '吹田',
        '高槻',
        '旭川',
        'いわき',
        '高崎',
        '所沢',
        '川越',
        '秋田',
        '越谷',
        '前橋',
        '那覇',
        '四日市',
        '青森',
        '久留米',
        '春日井',
        '盛岡',
        '明石',
        '福島',
        '下関',
        '長岡',
        '市原',
        '函館',
        '茨城県',
        '福井',
        '加古川',
        '徳島',
        '水戸',
        '平塚',
        '佐世保',
        '呉',
        '八戸',
        '佐賀',
        '寝屋川',
        '富士',
        '春日部',
        '茅ヶ崎',
        '松本',
        '厚木',
        '大和',
        '上尾',
        '宝塚',
        '筑波',
        '沼津',
        '熊谷',
        '伊勢崎',
        '岸和田',
        '鳥取',
        '小田原',
        '鈴鹿',
        '松江',
        '日立'
    ],
    teamNames : [
        'Yokohama',
        'Osaka',
        'Nagoya',
        'Sapporo',
        'Kobe',
        'Kyoto',
        'Fukuoka',
        'Kawasaki',
        'Saitama',
        'Hiroshima',
        'Sendai',
        'Chiba',
        'Niigata',
        'Hamamatsu',
        'Shizuoka',
        'Sagamihara',
        'Okayama',
        'Kumamoto',
        'Kagoshima',
        'Funabashi',
        'Kawaguchi',
        'Himeji',
        'Matsuyama',
        'Utsunomiya',
        'Matsudo',
        'Nishinomiya',
        'Kurashiki',
        'Ichikawa',
        'Fukuyama',
        'Amagasaki',
        'Kanazawa',
        'Nagasaki',
        'Yokosuka',
        'Toyama',
        'Takamatsu',
        'Machida',
        'Gifu',
        'Hirakata',
        'Fujisawa',
        'Kashiwa',
        'Toyonaka',
        'Nagano',
        'Toyohashi',
        'Ichinomiya',
        'Wakayama',
        'Okazaki',
        'Miyazaki',
        'Nara',
        'Suita',
        'Takatsuki',
        'Asahikawa',
        'Iwaki',
        'Takasaki',
        'Tokorozawa',
        'Kawagoe',
        'Akita',
        'Koshigaya',
        'Maebashi',
        'Naha',
        'Yokkaichi',
        'Aomori',
        'Kurume',
        'Kasugai',
        'Morioka',
        'Akashi',
        'Fukushima',
        'Shimonoseki',
        'Nagaoka',
        'Ichihara',
        'Hakodate',
        'Ibaraki',
        'Fukui',
        'Kakogawa',
        'Tokushima',
        'Mito',
        'Hiratsuka',
        'Sasebo',
        'Kure',
        'Hachinohe',
        'Saga',
        'Neyagawa',
        'Fuji',
        'Kasukabe',
        'Chigasaki',
        'Matsumoto',
        'Atsugi',
        'Yamato',
        'Ageo',
        'Takarazuka',
        'Tsukuba',
        'Numazu',
        'Kumagaya',
        'Isesaki',
        'Kishiwada',
        'Tottori',
        'Odawara',
        'Suzuka',
        'Matsue',
        'Hitachi'
    ]
};


// CONCATENATED MODULE: ./Utility/helper.js
const helper = {
    /**
     * rotation angle from 0 to 360 where 180 is a fastball's backspin and 90 is a slider's, 0 for curveball
     * in the direction (CW for righty), CCW for lefty.
     *
     * x movement, y movement, speed ratio, rotation angle, RPM from RHP perspective where left is smaller X
     */
    pitchDefinitions : {
        // fastball, kinda
        '4-seam' :      [  0,    0, 1   ,   180, 1000],
        '2-seam' :      [ 20,  -20, 0.90,   -45, 1200],
        'cutter' :      [-25,  -20, 0.95,    75, 1200],
        'sinker' :      [ 15,  -30, 0.95,   -45, 1500],

        // breaking ball
        'slider' :      [-50,  -35, 0.88 ,    80, 2000],
        'fork'   :      [  0,  -70, 0.87,    20,  500],
        'curve'  :      [  0, -110, 0.82,    10, 2500],

        // change-up
        'change' :      [  0,  -10, 0.86,   -15, 1000]
    },
    selectRandomPitch() {
        return [
            '4-seam', '2-seam', 'cutter', 'sinker',
            'slider', 'fork', 'curve',
            'change'
        ][Math.floor(Math.random()*8)]
    }
};


// CONCATENATED MODULE: ./Utility/_utils.js






// CONCATENATED MODULE: ./Services/Distribution.js

const pitchDefinitions = helper.pitchDefinitions;

/**
 * For Probability!
 * @constructor
 */
const Distribution = () => {
};

const random = Math.random, min = Math.min, max = Math.max, floor = Math.floor, ceil = Math.ceil, abs = Math.abs, pow = Math.pow, sqrt = Math.sqrt;

Distribution.prototype = {
    identifier : 'Distribution',
    constructor : Distribution,
    /**
     * @param scale {number}
     * @returns {number}
     */
    chance(scale) {
        if (!scale) scale = 1;
        return random() * scale;
    },
    /**
     * @param fielder {Player}
     * @returns {boolean}
     */
    error(fielder) {
        return (100-fielder.skill.defense.fielding) * 0.1 + 3.25 > random()*100;
    },
    /**
     * @param power
     * @param flyAngle
     * @param x {number} batting offset horizontal
     * @param y {number} batting offset vertical
     * @returns {number}
     */
    landingDistance(power, flyAngle, x, y) {
        x = min(5, abs(x)|0);
        y = min(5, abs(y)|0);
        const goodContactBonus = 8 - sqrt(x*x + y*y);

        const scalar = pow(random(), 1 - goodContactBonus * 0.125);

        return (10 + scalar * 320 + power/300
            + (random() * power/75) * 150)

            * (1 - abs(flyAngle - 30)/60);
    },
    /**
     * @param count {{strikes: number, balls: number}}
     * @returns {{x: number, y: number}}
     */
    pitchLocation(count) {
        let x, y;
        if (random() < 0.5) {
            x = 50 + floor(random()*90) - floor(random()*30);
        } else {
            x = 150 + floor(random()*30) - floor(random()*90);
        }
        y = 30 + (170 - floor(sqrt(random()*28900)));

        const sum = count.strikes + count.balls + 3;

        x = ((3 + count.strikes)*x + count.balls*100)/sum;
        y = ((3 + count.strikes)*y + count.balls*100)/sum;

        return {x, y};
    },
    /**
     * swing centering basis
     * @returns {number}
     */
    centralizedNumber() {
        return 100 + floor(random()*15) - floor(random()*15);
    },
    /**
     * @param eye {Player.skill.offense.eye}
     * @param x
     * @param y
     * @param umpire {Umpire}
     */
    swingLikelihood(eye, x, y, umpire) {
        let swingLikelihood = (200 - abs(100 - x) - abs(100 - y))/2;
        if (x < 60 || x > 140 || y < 50 || y > 150) { // ball
            /** 138 based on avg O-Swing of 30% + 8% for fun, decreased by better eye */
            swingLikelihood = (swingLikelihood + 138 - eye)/2 - 15*umpire.count.balls;
        } else {
            /** avg Swing rate of 65% - 8% for laughs, increased by better eye */
            swingLikelihood = (57 + (2*swingLikelihood + eye)/3)/2;
        }
        // higher late in the count
        return swingLikelihood - 35 + 2*(umpire.count.balls + 8*umpire.count.strikes);
    },
    /**
     * @param target {number} 0-200
     * @param control {number} 0-100
     * @returns {number}
     */
    pitchControl(target, control) {
        const effect = (50 - random()*100)/(1+control/100);
        return min(199.9, max(0.1, target + effect));
    },
    /**
     * @param pitch {Game.pitchInFlight}
     * @param pitcher {Player}
     * @param x {number}
     * @param y {number}
     * @returns {object|{x: number, y: number}}
     * 0.5 to 1.5 of the pitch's nominal breaking effect X
     * 0.5 to 1.5 of the pitch's nominal breaking effect Y, magnified for lower Y
     */
    breakEffect(pitch, pitcher, x, y) {
        const effect = {};
        effect.x = floor(x + (pitch.breakDirection[0]
            * ((0.50 + 0.5*random() + (pitcher.pitching[pitch.name]).break/200))));
        effect.y = floor(y + (pitch.breakDirection[1]
            * ((0.50 + 0.5*random() + (pitcher.pitching[pitch.name]).break/200)/(0.5 + y/200))));
        return effect;
    },
    /**
     * Determine the swing target along an axis
     * @param target {number} 0-200
     * @param actual {number} 0-200
     * @param eye {number} 0-100
     * @returns {number} 0-200
     */
    cpuSwing(target, actual, eye) {
        eye = min(eye, 100); // higher eye would overcompensate here
        return 100 + (target - 100)*(0.5+random()*eye/200) - actual;
    },
    /**
     * Determine the swing scalar
     * @param eye {number} 0-100
     * @returns {number}
     */
    swing(eye) {
        return 100/(eye + 25 + random()*50);
    },
    /**
     * @param pitch {Object} game.pitchInFlight
     * @param catcher {Player}
     * @param thief {Player}
     * @param base {Number} 1,2,3,4
     * @param volitional {boolean} whether the runner decided to steal
     * @returns {boolean}
     */
    stealSuccess(pitch, catcher, thief, base, volitional) {
        let rand = random();
        const rand2 = random();

        if (base == 4) {
            rand = rand/100;
        }

        const smoothedRand2 = (1 + rand2)/2;

        const pitchBaseSpeedMultiplier = (pitchDefinitions[pitch.name] || ['','',0.6])[2];

        return ((volitional|0) * 35 + thief.skill.offense.eye + (base * -25 + 45)) * rand
            + 10 + thief.skill.offense.speed*2 - thief.fatigue
            > (pitchBaseSpeedMultiplier * pitch.velocity * smoothedRand2
            + (catcher.skill.defense.catching + catcher.skill.defense.throwing) * rand2);
    },
    /**
     * @param pitch {Object} game.pitchInFlight
     * @param catcher {Player}
     * @param thief {Player}
     * @param base {Number} 1,2,3,4
     * @returns {boolean}
     */
    willSteal(pitch, catcher, thief, base) {
        if (base == 4) return false;
        return (random() < 0.15) && this.stealSuccess(pitch, catcher, thief, base, false) && (random() < 0.5);
    }
};

for (const fn in Distribution.prototype) {
    if (Distribution.prototype.hasOwnProperty(fn)) {
        Distribution[fn] = Distribution.prototype[fn];
    }
}

Distribution.main = () => {
    const ump = {
        count: {
            balls: 0,
            strikes: 0
        }
    };
    while (ump.count.balls < 4) {
        while (ump.count.strikes < 3) {
            console.log('S', ump.count.strikes, 'B', ump.count.balls);
            console.log('middle', [15, 35, 55, 75, 95].map(x => {
                return Distribution.swingLikelihood(x, 100, 100, ump)|0;
            }));
            console.log('corner', [15, 35, 55, 75, 95].map(x => {
                return Distribution.swingLikelihood(x, 50, 50, ump)|0;
            }));
            console.log('ball', [15, 35, 55, 75, 95].map(x => {
                return Distribution.swingLikelihood(x, 15, 15, ump)|0;
            }));
            ump.count.strikes++;
        }
        ump.count.balls++;
        ump.count.strikes = 0;
    }
};


// CONCATENATED MODULE: ./Services/Mathinator.js
/**
 * For Math!
 * @constructor
 */
const Mathinator = function () {};

/**
 * @param n
 * @returns {number}
 */
Mathinator.square = n => n * n;

Mathinator.prototype = {
    identifier : 'Mathinator',
    constructor : Mathinator,
    /**
     * CONST
     */
    RADIAN : Math.PI / 180,
    SPLAY_INDICATOR_LEFT : -4,
    /**
     * @param offset {{x: number, y: number}}
     * @param angle {number}
     * @returns {{x: number, y: number}}
     */
    getAngularOffset(offset, angle) {
        const xScalar = offset.x < 0 ? -1 : 1, yScalar = offset.y < 0 ? -1 : 1;
        const originalAngle = Math.atan(offset.x / offset.y)/this.RADIAN;
        const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y), angledY = yScalar * Math.cos((angle - originalAngle) * this.RADIAN) * distance, angledX = xScalar * Math.sqrt(distance * distance - angledY * angledY);
        return {
            x: angledX,
            y: angledY
        };
    },
    /**
     * @param a {Array<Number>}
     * @param b {Array<Number>}
     * @returns {number}
     */
    getPolarDistance(a, b) {
        const radians = this.RADIAN;
        return Math.sqrt(a[1]*a[1] + b[1]*b[1] - 2*a[1]*b[1]*Math.cos(a[0]*radians - b[0]*radians));
    },
    /**
     * @param origin
     * @param target
     * @returns {number}
     * 0 is flat (left-right), positive is clockwise.
     * We use 125 instead of 180 to account for natural hand-height adjustments
     * of various swing heights.
     */
    battingAngle(origin, target) {
        return Math.atan((origin.y - target.y)/(target.x - origin.x))/Math.PI * 125;
    },
    memory : {},
    /**
     * @param percent {number} 0-100
     * @param quarter {number} seconds
     * @param step {number} 0 and up
     * @param [givenApexHeight] feet
     * @param [givenDistance] in feet
     * @param [givenSplayAngle] where 0 is up the middle and 90 is right foul
     * @returns {{bottom: number, left: number, padding: number, borderWidth: number, delay: number, ease: (r.easeOut|*)}}
     */
    transitionalTrajectory(percent, quarter, step, givenApexHeight, givenDistance, givenSplayAngle) {
        if (givenApexHeight) Mathinator.prototype.memory.apexHeight = givenApexHeight;
        if (givenDistance) Mathinator.prototype.memory.distance = givenDistance;
        if (givenSplayAngle) Mathinator.prototype.memory.splay = givenSplayAngle;
        const apexHeight = Mathinator.prototype.memory.apexHeight, distance = Mathinator.prototype.memory.distance, splay = Mathinator.prototype.memory.splay;
        let bottom, left, padding, borderWidth;
        const bounding = Mathinator.prototype.memory.bounding, radian = this.RADIAN;

        if (bounding) {
            quarter *= 4;
            percent = Math.floor(Math.sqrt(percent/100)*100);
        }

        bottom = Math.cos(splay * radian) * percent/100 * distance * 95/300;
        left = Math.sin(splay * radian) * percent/100 * distance * 95/300 + this.SPLAY_INDICATOR_LEFT;

        const apexRatio = Math.sqrt((50 - Math.abs(percent - 50))/100)*(1/0.7071);
        if (bounding) {
            padding = 1;
            borderWidth = 1;
        } else {
            padding = apexRatio * apexHeight/90 * 15;
            borderWidth = 2 + (apexRatio * 2);
        }
        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 100), -100);
        padding = Math.max(Math.min(padding, 12), 0);
        return {
            bottom,
            left,
            padding,
            borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        };
    },
    /**
     * @param percent {number} 0-100
     * @param quarter {number} seconds
     * @param step {number} 0 and up
     * @param [givenApexHeight] feet
     * @param [givenDistance] in feet
     * @param [givenSplayAngle] where 0 is up the middle and 90 is right foul
     * @param [givenOrigin] Object with x, y -- pitchInFlight
     * @returns {{top: number, left: number, padding: number, borderWidth: number, delay: number, ease: (r.easeOut|*)}}
     */
    transitionalCatcherPerspectiveTrajectory(
        percent,
        quarter,
        step,
        givenApexHeight,
        givenDistance,
        givenSplayAngle,
        givenOrigin) {
        const memory = Mathinator.prototype.memory;
        if (givenApexHeight) memory.apexHeight = givenApexHeight;
        if (givenDistance) memory.distance = givenDistance;
        if (givenSplayAngle) memory.splay = givenSplayAngle;
        if (givenOrigin) memory.origin = givenOrigin;
        const apexHeight = memory.apexHeight, distance = memory.distance, splay = memory.splay, origin = memory.origin;
        let top, left, padding, borderWidth;
        const bounding = Mathinator.prototype.memory.bounding, radian = this.RADIAN;

        if (bounding) {
            percent = Math.floor(Math.sqrt(percent/100)*100);
        }

        const height = apexHeight - Math.pow(Math.abs(50 - percent)/50, 1.2) * apexHeight, currentDistance = distance * percent/100;

        const projection = Math.pow((500 - currentDistance)/500, 2); // reduction of dimensions due to distance

        top = (200 - origin.y) - (height * 20) * projection + (percent/100 * (origin.y - 85)) * projection;
        left = origin.x + Math.sin(splay * radian) * (currentDistance * 8) * projection;
        padding = 12 * projection * projection;
        borderWidth = Math.max(Math.min(padding/3, 4), 0);

        top = Math.max(Math.min(top, 500), -10000);
        left = Math.max(Math.min(left, 10000), -10000);
        padding = Math.max(Math.min(padding, 24), 1);

        //console.log('height', height|0, apexHeight|0, projection, 'left/pad/border', left|0, padding|0, borderWidth|0, 'top', top);

        return {
            top,
            left,
            padding,
            borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        };
    },
    /**
     * @param swingResult
     * @returns {Game.swingResult}
     */
    translateSwingResultToStylePosition(swingResult) {
        // CF HR bottom: 95px, centerline: left: 190px;
        let bottom, left;

        bottom = Math.cos(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300;
        left = Math.sin(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300 + this.SPLAY_INDICATOR_LEFT;

        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 100), -100);

        swingResult.bottom = `${bottom}px`;
        swingResult.left = `${left}px`;
        return swingResult;
    },
    /**
     * @param left {number} 0-200
     * @param top {number} 0-200
     * @param originLeft {number} 0-200
     * @param originTop {number} 0-200
     * @param quarter {number} seconds
     * @param maxPadding {number} px padding at full size
     * @param maxBorderWidth {number} px border width at full size
     * @returns {Function}
     */
    pitchTransition(top, left, originTop, originLeft, quarter, maxPadding, maxBorderWidth) {
        /**
         * @param percent {number} 0-100
         * @param step {number} 0 and up
         * @param [breakTop] {number} 0-200 override
         * @param [breakLeft] {number} 0-200 override
         * @returns {{top: number, left: number, padding: string, borderWidth: string, transform: string, delay: number, ease: *}}
         */
        return (percent, step, breakTop, breakLeft) => {
            let _top, _left;
            _top = breakTop || top;
            _left = breakLeft || left;
            _top = originTop + Mathinator.square(percent/100)*(_top - originTop);
            if (step == 1) {
                _top -= 2;
            }
            if (step == 2) {
                _top -= 1;
            }
            _left = originLeft + Mathinator.square(percent/100)*(_left - originLeft);
            const padding = Math.max(Mathinator.square(percent/100)*maxPadding, 1), borderWidth = Math.max(Mathinator.square(percent/100)*maxBorderWidth, 1);
            return {
                top: _top,
                left: _left ,
                padding: `${padding}px`,
                borderWidth: `${borderWidth}px`,
                transform: 'translateZ(0)',
                delay: quarter * step,
                ease: Linear.easeNone
            };
        };
    },
    /**
     * @param distance {number} feet
     * @param throwing {number} 0-1
     * @param fielding {number} 0-1
     * @param intercept {number} approx. -140 to 140
     * @returns {number} seconds
     */
    fielderReturnDelay(distance, throwing, fielding, intercept) {
        return distance/90 // bip distance (up to 3s+)
            + (5*((distance)/310) // worst case time to reach the ball,
            * (Math.min(intercept - 120, 0))/-240) // a good intercept rating will cut the base down to 0
            + 1 - (0.2 + fielding * 0.8) // gather time (up to 0.8s)
            + (distance/90)/(0.5 + throwing/2); // throwing distance (up to 2s)
    },
    /**
     * @param player {Player}
     * @returns {number} ~2.0
     */
    infieldThrowDelay(player) {
        const fielding = player.skill.defense.fielding, throwing = player.skill.defense.throwing;
        return 3.5 - (fielding + throwing)/200;
    },
    /**
     * @param speed {number} 0-100
     * @returns {number} seconds
     */
    baseRunningTime(speed) {
        return 7.0 - (speed/100 * 4.1)
    },
    /**
     * @param x {Number} bat offset
     * @param y {Number} bat offset
     * @param angle {Number} batting angle where 0 is horizontal, RHB clockwise increasing
     * {
     *   splay: -90 to 90 where 0 is up the middle,
     *   fly: 0, flat, to 90, vertical pop up
     * }
     * @param eye {Number} 0 - 100 skill rating
     * @param timing {Number} milliseconds early
     * @param lefty {Boolean} whether the batter is lefty
     * @returns {{splay: number, fly: number}}
     */
    getSplayAndFlyAngle(x, y, angle, eye, timing, lefty) {

        const pullDirection = lefty ? 1 : -1;
        // Let's say that you have a 100ms window in which to hit the ball fair, with an additional 40ms for
        // playing this game interface.
        // With this formula, 140ms early will pull the ball by ~50 degrees
        let pull = pullDirection * ((50/140 * timing) + (Math.random() * 10 * (100/(50 + eye))));

        pull /= Math.abs(100 / (100 + angle)); // diluted by angle

        let splay = -1.5*x - (y * angle / 20) + pull;

        return {
            splay,
            fly: -3*y / ((Math.abs(angle) + 25) / 35 ) // more difficult to hit a pop fly on a angled bat
        }
    },
    /**
     * @param velocityRating {Number} 0-100
     * @param velocityScalar {Number} approx 1
     * @returns {number}
     */
    getFlightTime(velocityRating, velocityScalar) {
        return (1.3 - 0.6*(velocityRating + 300)/400)/(velocityScalar);
    }
};

for (const fn in Mathinator.prototype) {
    if (Mathinator.prototype.hasOwnProperty(fn)) {
        Mathinator[fn] = Mathinator.prototype[fn];
    }
}


// CONCATENATED MODULE: ./Services/Iterator.js
const Iterator = () => {
};

Iterator.prototype = {
    identifier : 'Iterator',
    constructor : Iterator,
    each(collection, map) {
        let keys, i;
        if (collection instanceof Array) {
            for (i = 0; i < collection.length; i++) {
                map(i, collection[i]);
            }
        } else {
            keys = Object.keys(collection);
            for (i = 0; i < keys.length; i++) {
                map(keys[i], collection[keys[i]]);
            }
        }
    }
};

for (const fn in Iterator.prototype) {
    if (Iterator.prototype.hasOwnProperty(fn)) {
        Iterator[fn] = Iterator.prototype[fn];
    }
}


// CONCATENATED MODULE: ./Model/TeamConstants.js
/* harmony default export */ var TeamConstants = ({
    RUNNERS_DISCRETION: 'runnersDiscretion',
    RUNNER_GO: 'go',
    RUNNER_HOLD: 'hold'
});

// CONCATENATED MODULE: ./Model/Player.js







/**
 *
 * @param team \the team to assign the player to (bench)
 * @param hero \whether the player should be generated with elite skills
 * @constructor
 *
 */
const Player = function(team, hero) {
    this.init(team, hero);
    this.resetStats(this.team.game && this.team.game.gamesIntoSeason || 72);
};

Player.prototype = {
    constructor : Player,
    /**
     * @see {Player}
     */
    init(team, hero) {
        this.position = 'bench';
        this.ready = false;
        this.fatigue = 0;
        this.throws = Math.random() > 0.86 ? 'left' : 'right';
        this.bats = Math.random() > 0.75 ? 'left' : 'right';
        this.team = team;
        this.skill = {};
        this.eye = {
            x: 100,
            y: 100
        };
        this.pitching = {averaging : []};
        this.number = 0;
        this.randomizeSkills(hero || (Math.random() > 0.9));
        const surnameKey = Math.floor(Math.random()*data_data.surnames.length), nameKey = Math.floor(Math.random()*data_data.names.length);

        this.name = `${data_data.surnames[surnameKey]} ${data_data.names[nameKey]}`;
        const jSurname = data_data.surnamesJ[surnameKey], jGivenName = data_data.namesJ[nameKey];
        this.spaceName(jSurname, jGivenName);
        this.surname = data_data.surnames[surnameKey];
        this.surnameJ = data_data.surnamesJ[surnameKey];
        this.atBats = [];
        this.definingBattingCharacteristic = {};
        this.definingPitchingCharacteristic = {};
        this.definingCharacteristic = {};
    },
    /**
     * inserts the Japanese middle dot at the correct position, allowing a 4-width
     * @param jSurname
     * @param jGivenName
     */
    spaceName(jSurname, jGivenName) {
        if (jSurname.length === 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length === 1 && !jSurname.includes('・') && jSurname.length <= 2) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.surnameJ = jSurname;
    },
    /**
     * for websocket transfer
     */
    toData() {
        const team = this.team;
        delete this.team;
        const data = JSON.parse(JSON.stringify(this));
        this.team = team;
        return data;
    },
    /**
     * @param data
     * inverts @see #serialize()
     */
    fromData(data) {
        const giraffe = this;
        Iterator.each(data, (key, value) => {
            giraffe[key] = value;
        });
        delete this.atBatObjects;
        this.getAtBats();
    },

    /**
     *
     * take over the other player's position and batting order immediately, sending him/her to the bench
     * @param {Player} player
     * @returns {boolean}
     *
     */
    substitute(player) {
        if (player.team !== this.team) return false;
        const order = player.order, position = player.position;
        player.team.substituted.push(player);
        player.team.positions[position] = this;
        player.team.lineup[order] = this;

        this.position = position;
        this.order = order;

        const game = this.team.game;
        if (game.pitcher === player) game.pitcher = this;
        if (game.batter === player) game.batter = this;
        if (game.deck === player) game.deck = this;
        if (game.hole === player) game.hole = this;

        const field = game.field;
        if (field.first === player) field.first = this;
        if (field.second === player) field.second = this;
        if (field.third === player) field.third = this;

        const bench = this.team.bench, bullpen = this.team.bullpen;
        if (bench.includes(this)) {
            bench.splice(bench.indexOf(this), 1);
        }
        if (bullpen.includes(this)) {
            bullpen.splice(bullpen.indexOf(this), 1);
        }
        game.log.noteSubstitution(this, player);
    },
    /**
     * resets the player's statistics
     * @param gamesIntoSeason
     * @returns {*}
     */
    resetStats(gamesIntoSeason=72) {
        const offense = this.skill.offense;
        const defense = this.skill.defense;
        const randBetween = (a, b, skill) => {
            let total = 0, count = 0;
            skill += '';
            if (!skill) skill = '';
            Iterator.each(skill.split(' '), (key, value) => {
                let skill = value;
                if (offense[skill]) skill = offense[skill];
                if (defense[skill]) skill = defense[skill];
                if (isNaN(skill)) skill = 50;
                total += skill;
                count++;
            });

            skill = Math.sqrt(0.05 + Math.random()*0.95)*(total/(count * 0.97));
            return Math.floor((skill/100) * (b - a) + a);
        };
        let IP, ER, GS, W, L;
        if (this.skill.pitching > 65) {
            IP = (this.skill.pitching - 65)*gamesIntoSeason/20;
            ER = (IP/9)*randBetween(800, 215, this.skill.pitching)/100;
            if (IP > gamesIntoSeason) {
                //starter
                GS = Math.floor(gamesIntoSeason/5);
                W = randBetween(GS * 0.1, GS * 0.8, this.skill.pitching/1.20);
                L = randBetween((GS - W), 0, this.skill.pitching/3);
            } else {
                //reliever
                GS = Math.floor(gamesIntoSeason/40);
                W = randBetween(0, GS*0.6, this.skill.pitching);
                L = randBetween((GS - W), 0, this.skill.pitching);
            }
        } else {
            IP = 0;
            ER = 0;
            GS = 0; W = 0; L = 0;
        }
        const pa = randBetween(gamesIntoSeason*3, gamesIntoSeason*5, 'speed eye');
        let paRemaining = pa;
        const bb = Math.floor(randBetween(0, 18, 'power eye')*paRemaining/100);
        paRemaining -= bb;
        const ab = paRemaining;
        const so = Math.floor(randBetween(25, 2, 'eye')*paRemaining/100);
        paRemaining -= so;
        const h = Math.floor(randBetween(185, 372, 'eye power speed')*paRemaining/1000);
        paRemaining -= h;
        const sb = randBetween(0, (h + bb)/6, 'speed') | 0;
        const cs = randBetween(sb, 0, 'speed eye') | 0;

        const doubles = randBetween(0, h/4, 'power speed');
        const triples = randBetween(0, h/12, 'speed');
        const hr = Math.max(0, randBetween(-h/20, h/5, 'power eye'));
        const r = randBetween(h/8, (h + bb)/3, 'speed') + hr;
        const rbi = randBetween(h/8, (h)/2, 'power eye') + hr;
        const hbp = randBetween(0, gamesIntoSeason/25);
        const sac = randBetween(0, gamesIntoSeason/5, 'eye');

        const chances = randBetween(gamesIntoSeason * 5, pa - bb - so - hr, 'fielding');
        const E = randBetween(chances/10, 0, 'fielding');
        const PO = chances - E;

        this.stats = {
            pitching : {
                pitches : 0, // in game
                GS,
                W,
                L,
                strikes : 0, // in game
                K : 0, // in game
                getK9() {
                    return this.K / (this.IP[0]/9);
                },
                getERA() {
                    const val = 9 * this.ER / Math.max(1/3, this.IP[0] + this.IP[1]/3);
                    return (val + '00').slice(0, 4);
                },
                ERA : null,
                ER,
                H : 0, // in game
                HR : 0, // in game
                BB : 0, // in game
                IP : [IP,0],
                WHIP : 0,
                getWHIP() {
                    return (this.H + this.BB)/(this.IP[0] ? this.IP[0] : 1);
                }
            },
            batting : {
                getBA() {
                    return this.h / (Math.max(1, this.ab));
                },
                getBABIP() {
                    return (this.h - this.hr) / (this.ab - this.so - this.hr + this.sac);
                },
                ba : null,
                getOBP() {
                    return (this.h + this.bb + this.hbp)/(this.ab + this.bb + this.hbp + this.sac);
                },
                obp : null,
                getSLG() {
                    return ((this.h - this['2b'] - this['3b'] - this.hr) + 2*this['2b'] + 3*this['3b'] + 4*this.hr)/this.ab;
                },
                getSlash() {
                    this.slash = this.slash || [this.getBA() || '.---', this.getOBP(), this.getSLG()].map(x => {
                            if (isNaN(x)) return '.---';
                            if (x < 1) return (`${x}0000`).slice(1, 5);
                            return (`${x}0000`).slice(0, 5);
                        }).join('/');
                    return this.slash;
                },
                slg : null,
                pa,
                ab,
                so,
                bb,
                h,
                '2b' : doubles,
                '3b' : triples,
                hr,
                r,
                rbi,
                hbp,
                sac,
                sb,
                cs
            },
            fielding : {
                E,
                PO, // should depend on position
                A : Math.floor(Math.random()*5) + 1 // ehh should depend on position
            }
        };
        this.stats.pitching.ERA = this.stats.pitching.getERA();
        this.stats.pitching.K9 = this.stats.pitching.getK9();
        this.stats.pitching.WHIP = this.stats.pitching.getWHIP();
        this.stats.batting.ba = this.stats.batting.getBA();
    },
    /**
     * a list of at bat results {AtBat[]}
     */
    atBatObjects : [],
    getAtBats() {
        if (this.atBats.length > this.atBatObjects.length) {
            this.atBatObjects = this.atBats.map(item => new AtBat_AtBat(item));
        }
        return this.atBatObjects;
    },
    recordRBI() {
        this.atBats[this.atBats.length - 1] += AtBat_AtBat.prototype.RBI_INDICATOR;
    },
    recordInfieldHit() {
        this.atBats[this.atBats.length - 1] += AtBat_AtBat.prototype.INFIELD_HIT_INDICATOR;
    },
    /**
     * @returns {number}
     */
    getBaseRunningTime() {
        return Mathinator.baseRunningTime(this.skill.offense.speed);
    },
    /**
     * live game steal
     * @param game
     * @param base
     * @returns {Player.attemptSteal}
     */
    attemptSteal(game, base) {
        const pitch = game.pitchInFlight;
        const success = Distribution.stealSuccess(pitch, game.pitcher.team.positions.catcher,
            this, base, this.team.stealAttempt === TeamConstants.RUNNERS_DISCRETION);
        if (success) {
            game.swingResult.stoleABase = this.order;
            game.swingResult.caughtStealing = undefined;
        } else {
            game.swingResult.stoleABase = undefined;
            game.swingResult.caughtStealing = this.order;
        }
        switch (base) {
            case 1:
                base = '1st';
                break;
            case 2:
                base = '2nd';
                break;
            case 3:
                base = '3rd';
                break;
            case 4:
                base = 'Home';
        }
        game.swingResult.attemptedBase = base;
        return this;
    },
    /**
     * used for other calculations/orderings
     * @returns {number}
     */
    defensiveAverage() {
        const _this = this.skill.defense;
        return (_this.speed + _this.fielding + _this.throwing) / 3
    },
    /**
     * randomizes the player's skills, usually called at init
     * @param hero
     * @param allPitches
     */
    randomizeSkills(hero, allPitches) {
        this.hero = hero;
        const giraffe = this;
        const randValue = isPitching => {
            let value = Math.floor(Math.pow(Math.random(), 0.75)*80 + Math.random()*20);
            if (hero) {
                value += Math.floor((100 - value)*Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value;
        };
        this.skill.offense = {
            eye : randValue(),
            power : randValue(),
            speed : randValue()
        };
        this.skill.defense = {
            catching : randValue(),
            fielding : randValue(),
            speed : randValue(),
            throwing : randValue()
        };
        this.pitching.averaging = [];
        this.pitching['4-seam'] = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        this.pitching.slider = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        if (Math.random() < 0.85 || allPitches) {
            // can pitch!
            if (Math.random() > 0.6 || allPitches) {
                this.pitching['2-seam'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() < 0.18 || allPitches) {
                this.pitching.fork = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() > 0.77 || allPitches) {
                this.pitching.cutter = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
            if (Math.random() < 0.21 || allPitches) {
                this.pitching.sinker = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }

            if (Math.random() < 0.4 || allPitches) {
                this.pitching.curve = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }

            if (Math.random() < 0.9 || allPitches) {
                this.pitching.change = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                };
            }
        }

        const averages = this.pitching.averaging.sort((a, b) => b - a).slice(0, 4);
        const pitchingAverage = averages.reduce((a, b) => a + b) / 4;

        this.skill.pitching = Math.floor(pitchingAverage);
        delete this.pitching.averaging;
    },
    /**
     * language-sensitive
     * @returns {String}
     */
    getSurname() {
        return text_text.mode === 'n' ? this.surnameJ : this.surname;
    },
    /**
     * language-sensitive
     * @returns {String}
     */
    getName() {
        return text_text.mode === 'n' ? this.nameJ : this.name;
    },
    getUniformNumber() {
        return text_text('#') + this.number;
    },
    /**
     * language-sensitive, for text representation of batting order
     * @returns {String}
     */
    getOrder() {
        return text_text([' 1st', ' 2nd', ' 3rd', ' 4th', ' 5th', ' 6th', '7th', ' 8th', ' 9th'][this.order]);
    },
    /**
     * Where positive is an early swing and negative is a late swing.
     * @returns {Number} in milliseconds between -200ms and 200ms
     */
    getAISwingTiming() {
        return (Math.random() - 0.5) * 280 * (60 / (60 + this.skill.offense.eye));
    },
    /**
     * a localized description of this player's defining batting characteristic e.g. "contact hitter"
     * @returns {string}
     */
    getDefiningBattingCharacteristic() {
        if (!this.definingBattingCharacteristic[text_text.mode]) {
            this.definingBattingCharacteristic[text_text.mode] = this.getDefiningCharacteristic(true);
        }
        return this.definingBattingCharacteristic[text_text.mode];
    },
    /**
     * a localized description of this player's defining pitching characteristic e.g. "control pitcher"
     * @returns {string}
     */
    getDefiningPitchingCharacteristic() {
        if (!this.definingPitchingCharacteristic[text_text.mode]) {
            this.definingPitchingCharacteristic[text_text.mode] = this.getDefiningCharacteristic(false, true);
        }
        return this.definingPitchingCharacteristic[text_text.mode];
    },
    /**
     * a localized phrase describing a strong trait of this player e.g. "ace" or "power hitter".
     * @param battingOnly to return only their defining batting characteristic.
     * @param {boolean} pitchingOnly to return only a pitching characteristic.
     * @returns {string}
     */
    getDefiningCharacteristic(battingOnly, pitchingOnly) {
        if (this.definingCharacteristic[text_text.mode] && !battingOnly) {
            return this.definingCharacteristic[text_text.mode];
        }
        let out = '';
        const o = this.skill.offense, d = this.skill.defense, pitcherRating = this.skill.pitching;
        const p = this.pitching;
        const ELITE = 90;
        const EXCELLENT = 80;
        const GOOD = 60;

        const POOR = 40;
        const BAD = 30;
        const INEPT = 20;

        const skills = [o.eye, o.power, o.speed, d.fielding, d.speed, d.throwing, pitcherRating];
        const offense = [o.eye, o.power, o.speed];
        const defense = [d.fielding, d.speed, d.throwing];

        const sum = x => x.reduce((a,b) => a + b);

        let pitching =  [0, 0, 0]; // control, speed, break
        const pitchingKeys = Object.keys(p);
        pitchingKeys.map(x => {
            pitching[0] += p[x].control;
            pitching[1] += p[x].velocity;
            pitching[2] += p[x].break;
        });
        const pitches = pitchingKeys.length;
        pitching = pitching.map(x => x/pitches | 0);

        if (pitchingOnly || (pitcherRating > 90 && !battingOnly)) {
            if (pitcherRating > 94) {
                out = text_text('Ace');
            } else if (pitching[0] > EXCELLENT) {
                out = text_text('Control pitcher');
            } else if (pitching[1] > EXCELLENT) {
                out = text_text('Flamethrower');
            } else if (pitching[2] > EXCELLENT) {
                out = text_text('Breaking ball');
            }
        } else {
            if (battingOnly || sum([offense[0] * 2, offense[1] * 0.50, offense[2]]) > sum(defense)) {
                if (offense[0] > 98 || (sum(offense) > ELITE * 3)) {
                    out = text_text('Genius batter');
                } else if (offense[1] > EXCELLENT && offense[1] > offense[0]) {
                    out = text_text('Power hitter');
                } else if (offense[0] > EXCELLENT) {
                    out = text_text('Contact');
                } else if (offense[2] > EXCELLENT) {
                    out = text_text('Speedster');
                } else if (offense[0] < INEPT || (sum(offense) < POOR * 3)) {
                    out = text_text('Inept');
                } else if (offense[1] < INEPT && offense[1] < offense[0]) {
                    out = text_text('Weak swing');
                } else if (offense[0] < BAD) {
                    out = text_text('Strikes out');
                } else if (offense[2] < POOR) {
                    out = text_text('Leisurely runner');
                }
            } else {
                if (sum(defense) > EXCELLENT * 3) {
                    out = text_text('Defensive wizard');
                } else if (defense[0] > EXCELLENT) {
                    out = text_text('Glove');
                } else if (defense[1] > EXCELLENT) {
                    out = text_text('Range');
                } else if (defense[2] > ELITE) {
                    out = text_text('Strong throw');
                }
            }
        }
        if (battingOnly || pitchingOnly) return out;
        return this.definingCharacteristic[text_text.mode] = out;
    },
    /**
     * to ease comparison in Angular (?)
     */
    toString() {
        return `${this.name} #${this.number}`;
    }
};


// CONCATENATED MODULE: ./Render/mesh/AbstractMesh.js
/**
 * Each class should adhere to this pattern.
 * When a scene object has been positioned correctly and its trajectory set,
 * it should use ::join to attach itself to the scene.
 *
 * While attached, the animate method will be called on each frame.
 * Typically the animate method can run through the trajectory queue and then
 * detach itself. @see Ball
 *
 * For static meshes the animate method will do nothing, leaving the mesh permanently attached.
 */
class AbstractMesh {
    /**
     * attach and detach should be used to maintain the correct object list
     * todo use the built in object list of the scene object
     */
    attach() {
        const objects = this.loop.objects;
        if (objects.indexOf(this) === -1) {
            objects.push(this);
        }
        this.loop.scene.add(this.mesh);
    }
    detach() {
        const objects = this.loop.objects;
        const index = objects.indexOf(this);
        if (index !== -1) {
            this.loop.objects.splice(index, 1);
        }
        this.loop.scene.remove(this.mesh);
    }
    join(loop) {
        this.loop = loop || this.loop;
        // Non-circular typecheck for [Loop]
        if (this.loop && this.loop.loop) {
            this.attach();
        }
    }
    animate() {

    }
}

/**
 * since we are using (0, 0, 0) vector for the center of the strike zone, the actual ground level will be offset
 * downward
 * @type {number}
 */
AbstractMesh.WORLD_BASE_Y = -4;


// CONCATENATED MODULE: ./Render/mesh/Indicator.js


class Indicator extends AbstractMesh {
    constructor(loop) {
        super();
        let n = 60;
        this.trajectory = [];
        while (n--) {
            this.trajectory.push(1);
        }
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const THREE = window.THREE;
        const geometry	= new THREE.CircleGeometry(0.30, 32);
        const material	= new THREE.MeshPhongMaterial({
            color: 0xFFFFFF
        });
        this.mesh = new THREE.Mesh(geometry, material);
        return this.mesh;
    }
    animate() {
        this.trajectory.shift();

        if (!this.trajectory.length) {
            this.detach();
        }
    }
}


// CONCATENATED MODULE: ./Render/LoopConstants.js
/**
 * the constants should be tuned so that the camera coincides with the DOM's strike zone overlay
 * @type {number}
 */
const VERTICAL_CORRECTION = -0.2;
const INITIAL_CAMERA_DISTANCE = 8;

// CONCATENATED MODULE: ./Render/mesh/Ball.js






/**
 * on the DOM the pitch zone is 200x200 pixels
 * here we scale the strike zone to 4.2 units (feet)
 * for display purposes. It is only approximately related to actual pitch zone dimensions.
 * @type {number}
 */
const SCALE = 2.1/100;

const INDICATOR_DEPTH = -5;

class Ball_Ball extends AbstractMesh {
    /**
     *
     * @param loop
     * @param trajectory {Array<Vector3>} incremental vectors applied each frame
     * e.g. for 1 second of flight time there should be 60 incremental vectors
     */
    constructor(loop, trajectory) {
        super();
        if (!(loop && loop.loop) && loop instanceof Array) {
            trajectory = loop;
        }
        this.hasIndicator = false;
        this.trajectory = trajectory ? trajectory : [];
        this.breakingTrajectory = [];
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
        this.setType('4-seam', 1);
        this.bounce = 1;
    }
    getMesh() {
        /** @see threex.sportballs */
        const baseURL	= 'public/';
        const THREE = window.THREE;
        const loader = new THREE.TextureLoader();
        const textureColor= loader.load(`${baseURL}images/BaseballColor.jpg`);
        const textureBump	= loader.load(`${baseURL}images/BaseballBump.jpg`);
        const geometry	= new THREE.SphereGeometry(0.36, 32, 16); // real scale is 0.12
        const material	= new THREE.MeshPhongMaterial({
            map	: textureColor,
            bumpMap	: textureBump,
            bumpScale: 0.01
        });
        this.mesh = new THREE.Mesh(geometry, material);
        return this.mesh;
    }

    /**
     * Leave an indicator when crossing the home plate front plane,
     * and rotate while moving (default 1000 RPM)
     */
    animate() {
        const frame = this.trajectory.shift(), pos = this.mesh.position;

        if (frame) {
            pos.x += frame.x;
            pos.y += frame.y * this.bounce;
            pos.z += frame.z;
            if (pos.y < AbstractMesh.WORLD_BASE_Y) {
                this.bounce *= -1;
            }
            if (frame.x + frame.y + frame.z !== 0) {
                this.rotate();
            }
        }
        if (pos.z > INDICATOR_DEPTH && !this.hasIndicator) {
            this.spawnIndicator();
        }
        if (!frame) {
            this.detach();
            this.loop.resetCamera();
        }
    }
    setType(type, handednessScalar) {
        const rpm = helper.pitchDefinitions[type][4];
        const rotationAngle = helper.pitchDefinitions[type][3];
        this.setRotation(rpm, rotationAngle * (handednessScalar || 1));
    }
    rotate() {
        const rotation = this.rotation;
        const meshRotation = this.mesh.rotation;
        meshRotation.x += rotation.x;
        meshRotation.y += rotation.y;
    }
    setRotation(rpm, rotationAngle) {
        this.RPM = rpm;
        this.RPS = this.RPM / 60;
        const rotationalIncrement = this.RP60thOfASecond = this.RPS / 60;

        // calculate rotational components
        // +x is CCW along x axis increasing
        // +y is CW along y axis increasing
        // +z (unused) is CW along z axis increasing

        // 0   --> x:1 y:0
        // 45  --> x:+ y:+
        // 90  --> x:0 y:1
        // 180 --> x:-1 y:0

        const xComponent = rotationalIncrement * Math.cos(rotationAngle / 180 * Math.PI);
        const yComponent = rotationalIncrement * Math.sin(rotationAngle / 180 * Math.PI);

        this.rotation = {
            x: xComponent * 360 * Math.PI / 180,
            y: yComponent * 360 * Math.PI / 180
        };
    }
    exportPositionTo(mesh) {
        mesh.position.x = this.mesh.position.x;
        mesh.position.y = this.mesh.position.y;
        mesh.position.z = this.mesh.position.z;
    }
    spawnIndicator() {
        if (this.hasIndicator) {
            return;
        }
        this.hasIndicator = true;
        const indicator = new Indicator();
        indicator.mesh.position.x = this.mesh.position.x;
        indicator.mesh.position.y = this.mesh.position.y;
        indicator.mesh.position.z = this.mesh.position.z;
        indicator.join(this.loop.background);
    }
    derivePitchingTrajectory(game) {
        this.setType(game.pitchInFlight.name, game.pitcher.throws === 'right' ? 1 : -1);
        const top = 200 - game.pitchTarget.y,
              left = game.pitchTarget.x,
              breakTop = 200 - game.pitchInFlight.y,
              breakLeft = game.pitchInFlight.x,
              flightTime = Mathinator.getFlightTime(game.pitchInFlight.velocity,
                  helper.pitchDefinitions[game.pitchInFlight.name][2]);

        const scale = SCALE;
        const origin = {
            x: (game.pitcher.throws == 'left' ? 1.5 : -1.5),
            y: AbstractMesh.WORLD_BASE_Y + 6,
            z: -60.5 // mound distance
        };
        this.mesh.position.x = origin.x;
        this.mesh.position.y = origin.y;
        this.mesh.position.z = origin.z;

        const ARC_APPROXIMATION_Y_ADDITIVE = 38; // made up number
        const terminus = {
            x: (left - 100) * scale,
            y: (100 - top + 2 * ARC_APPROXIMATION_Y_ADDITIVE) * scale + VERTICAL_CORRECTION,
            z: INDICATOR_DEPTH
        };
        const breakingTerminus = {
            x: (breakLeft - 100) * scale,
            y: (100 - breakTop) * scale + VERTICAL_CORRECTION,
            z: INDICATOR_DEPTH
        };

        let lastPosition = {
                x: origin.x, y: origin.y, z: origin.z
            },
            lastBreakingPosition = {
                x: origin.x, y: origin.y, z: origin.z
            };

        const frames = [];
        const breakingFrames = [];
        const frameCount = flightTime * 60 | 0;
        let counter = frameCount * 1.08 | 0;
        let frame = 0;

        const xBreak = breakingTerminus.x - terminus.x, yBreak = breakingTerminus.y - terminus.y;
        const breakingDistance = Math.sqrt(Math.pow(xBreak, 2) + Math.pow(yBreak, 2));
        /**
         * @type {number} 1.0+, an expression of how late the pitch breaks
         */
        const breakingLateness = breakingDistance/(2 * ARC_APPROXIMATION_Y_ADDITIVE)/scale, breakingLatenessMomentumExponent = 0.2 + Math.pow(0.45, breakingLateness);

        while (counter--) {
            const progress = (++frame)/frameCount;

            // linear position
            const position = {
                x: origin.x + (terminus.x - origin.x) * progress,
                y: origin.y + (terminus.y - origin.y) * progress,
                z: origin.z + (terminus.z - origin.z) * progress
            };
            // linear breaking position
            const breakingInfluencePosition = {
                x: origin.x + (breakingTerminus.x - origin.x) * progress,
                y: origin.y + (breakingTerminus.y - origin.y) * progress,
                z: origin.z + (breakingTerminus.z - origin.z) * progress
            };
            if (progress > 1) {
                momentumScalar = 1 - Math.pow(progress, breakingLateness);
            } else {
                var momentumScalar = Math.pow(1 - progress, breakingLatenessMomentumExponent);
            }
            const breakingScalar = 1 - momentumScalar, scalarSum = momentumScalar + breakingScalar;
            // adjustment toward breaking ball position
            const breakingPosition = {
                x: (position.x * momentumScalar + breakingInfluencePosition.x * breakingScalar)/scalarSum,
                y: (position.y * momentumScalar + breakingInfluencePosition.y * breakingScalar)/scalarSum,
                z: (position.z * momentumScalar + breakingInfluencePosition.z * breakingScalar)/scalarSum
            };
            const increment = {
                x: position.x - lastPosition.x,
                y: position.y - lastPosition.y,
                z: position.z - lastPosition.z
            };
            const breakingIncrement = {
                x: breakingPosition.x - lastBreakingPosition.x,
                y: breakingPosition.y - lastBreakingPosition.y,
                z: breakingPosition.z - lastBreakingPosition.z
            };

            lastPosition = position;
            lastBreakingPosition = breakingPosition;

            breakingFrames.push(breakingIncrement);
            frames.push(increment);
        }

        let pause = 60;
        while (pause--) {
            breakingFrames.push({x:0, y:0, z:0});
            frames.push({x:0, y:0, z:0});
        }

        this.breakingTrajectory = breakingFrames;
        this.trajectory = frames;
        return frames;
    }
    deriveTrajectory(result, pitch) {
        const dragScalarApproximation = {
            distance: 1,
            apexHeight: 0.57,
            airTime: 0.96
        };

        let flyAngle = result.flyAngle;
        let distance = Math.abs(result.travelDistance);
        const scalar = result.travelDistance < 0 ? -1 : 1;
        const flightScalar = flyAngle < 7 ? -1 : 1;
        const splay = result.splay;

        if (flightScalar < 0 && result.travelDistance > 0) {
            distance = Math.max(90, distance);
        }

        flyAngle = 1 + Math.abs(flyAngle); // todo why plus 1?
        if (flyAngle > 90) flyAngle = 180 - flyAngle;

        // velocity in m/s, I think
        const velocity = dragScalarApproximation.distance * Math.sqrt(9.81 * distance / Math.sin(2*Math.PI*flyAngle/180));
        const velocityVerticalComponent = Math.sin(Mathinator.RADIAN * flyAngle) * velocity;
        // in feet
        const apexHeight = velocityVerticalComponent*velocityVerticalComponent/(2*9.81) * dragScalarApproximation.apexHeight;
        // in seconds
        const airTime = 1.5 * Math.sqrt(2*apexHeight/9.81) * dragScalarApproximation.airTime; // 2x freefall equation

        this.airTime = airTime;

        const scale = SCALE;

        const origin = {
            x: pitch.x + result.x - 100,
            y: pitch.y + result.y - 100,
            z: 0
        };

        this.mesh.position.x = origin.x * scale;
        this.mesh.position.y = origin.y * scale;
        this.mesh.position.z = origin.z;

        const extrema = {
            x: Math.sin(splay / 180 * Math.PI) * distance,
            y: apexHeight,
            z: -Math.cos(splay / 180 * Math.PI) * distance
        };

        const frames = [];
        const frameCount = airTime * 60 | 0;
        let counter = frameCount;
        let frame = 0;

        let lastHeight = 0;

        while (counter--) {
            const progress = (++frame)/frameCount, percent = progress * 100;

            // this equation is approximate
            if (flightScalar < 0) {
                const currentDistance = progress * distance;
                y = (origin.y * scale
                    + apexHeight*Math.abs(Math.sin(3 * Math.pow(currentDistance, 1.1) / distance * Math.PI/2)))
                    * ((100 - percent)/100)
                    + AbstractMesh.WORLD_BASE_Y * (progress);
            } else {
                var y = apexHeight - Math.pow(Math.abs(50 - percent)/50, 2) * apexHeight;
            }

            frames.push({
                x: extrema.x/frameCount,
                y: (y - lastHeight),
                z: extrema.z/frameCount
            });

            lastHeight = y;
        }
        this.trajectory = frames;
        return frames;
    }
}

Ball_Ball.prototype.DEFAULT_RPM = 1000;
Ball_Ball.prototype.RPM = 1000;
Ball_Ball.prototype.RPS = 1000 / 60;
Ball_Ball.prototype.RP60thOfASecond = 1000 / 60 / 60;
Ball_Ball.prototype.rotation = {
    x: Ball_Ball.prototype.RP60thOfASecond * 360 * Math.PI / 180, // in radians per 60th of a second
    y: Ball_Ball.prototype.RP60thOfASecond * 360 * Math.PI / 180
};



// CONCATENATED MODULE: ./Render/mesh/Mound.js


class Mound_Mound extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xDCB096
        });

        const mesh = new THREE.Mesh(
            new THREE.CircleGeometry(
                9
            ),
            material
        );

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = 45/180 * Math.PI;

        mesh.position.x = 0;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.9;
        mesh.position.z = -60.5;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/Base.js


class Base_Base extends AbstractMesh {
    constructor(loop, base) {
        super();
        this.base = base;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                0.3,
                1.5,
                8, 8, 8
            ),
            material
        );

        mesh.rotation.x = -0/180 * Math.PI;
        mesh.rotation.y = 45/180 * Math.PI;
        mesh.rotation.z = 0/180 * Math.PI;

        switch (this.base) {
            case 'first':
                mesh.position.x = 69;
                mesh.position.z = -64;
                break;
            case 'second':
                mesh.position.x = 0;
                mesh.position.z = -128;
                break;
            case 'third':
                mesh.position.x = -69;
                mesh.position.z = -64;
                break;
            case 'home':
                mesh.position.x = 0;
                mesh.position.z = 0;

                mesh.rotation.y = 0;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.5;
        mesh.position.z -= 0;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/FoulLine.js


class FoulLine_FoulLine extends AbstractMesh {
    constructor(loop, side) {
        super();
        this.side = side;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xFFFFFF
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                0.35,
                300,
                1,
                1
            ),
            material
        );

        const left = this.side === 'left';

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0/180 * Math.PI;

        if (left) {
            mesh.rotation.z = 45/180 * Math.PI;
            mesh.position.x = -108;
            mesh.position.z = -102;
        } else {
            mesh.rotation.z = -45/180 * Math.PI;
            mesh.position.x = 108;
            mesh.position.z = -102;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.35;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {
    }
}


// CONCATENATED MODULE: ./Render/mesh/FoulPole.js


class FoulPole_FoulPole extends AbstractMesh {
    constructor(loop, side) {
        super();
        this.side = side;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xE3EF6E
        });

        const mesh = new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.35, 0.35,
                180,
                8,
                8
            ),
            material
        );

        const left = this.side === 'left';

        if (left) {
            mesh.position.x = -218;
            mesh.position.z = -212;
        } else {
            mesh.position.x = 218;
            mesh.position.z = -212;
        }
        mesh.position.y = AbstractMesh.WORLD_BASE_Y;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {
    }
}


// CONCATENATED MODULE: ./Render/mesh/Field.js


class Field_Field extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xDCB096
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                160,
                160,
                32,
                32
            ),
            material
        );

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = 45/180 * Math.PI;

        mesh.position.x = 0;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y;
        mesh.position.z = -102;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/Grass.js


class Grass_Grass extends AbstractMesh {
    constructor(loop, infield) {
        super();
        this.infield = infield;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: this.infield ? 0x284C19: 0x284C19 //0x486D1F
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(
                this.infield ? 94 : 8000,
                this.infield ? 94 : 8000,
                16,
                16
            ),
            material
        );

        if (this.infield) {
            mesh.rotation.x = -90/180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 45/180 * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.2;
            mesh.position.z = -62;
        } else {
            mesh.rotation.x = -90/180 * Math.PI;
            mesh.rotation.y = 0;
            mesh.rotation.z = 45/180 * Math.PI;

            mesh.position.x = 0;
            mesh.position.y = AbstractMesh.WORLD_BASE_Y - 0.2;
            mesh.position.z = -570;
        }

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/BaseDirt.js


class BaseDirt_BaseDirt extends AbstractMesh {
    constructor(loop, base) {
        super();
        this.base = base;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0xDCB096
        });
        const home = this.base.base === 'home';

        const mesh = new THREE.Mesh(
            new THREE.CircleGeometry(
                home ? 18 : 12, 32
            ),
            material
        );

        mesh.rotation.x = -90/180 * Math.PI;
        mesh.rotation.y = 0;
        mesh.rotation.z = 45/180 * Math.PI;

        const base = this.base.getMesh().position;

        mesh.position.x = base.x * 0.9;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0.3;
        mesh.position.z = base.z;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/BattersEye.js


class BattersEye_BattersEye extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0x3F4045
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                200,
                45,
                4,
                16, 16, 16
            ),
            material
        );

        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0;
        mesh.position.z -= 310;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/Wall.js


class Wall_Wall extends AbstractMesh {
    constructor(loop, angle) {
        super();
        this.angle = angle;
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    getMesh() {
        const material = new THREE.MeshLambertMaterial({
            color: 0x3F4045
        });

        const mesh = new THREE.Mesh(
            new THREE.BoxGeometry(
                120,
                15,
                4,
                16, 16, 16
            ),
            material
        );

        const radians = this.angle / 180 * Math.PI;
        mesh.rotation.y = -radians;

        const hypotenuse = 300;
        const distance = Math.cos(radians) * hypotenuse;
        const offset = Math.sin(radians) * hypotenuse;

        mesh.position.x += offset;
        mesh.position.y = AbstractMesh.WORLD_BASE_Y + 0;
        mesh.position.z -= distance;

        this.mesh = mesh;
        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/Sky.js


class Sky extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
    }
    setUniforms(uniforms) {
        this.uniforms = uniforms;
        const sky = this.sky;
        for (const key in uniforms) { if (uniforms.hasOwnProperty(key)) {
            if (!sky.uniforms[key]) {
                sky.uniforms[key] = uniforms[key];
            }
            if (typeof uniforms[key] === 'object') {
                sky.uniforms[key].value = uniforms[key].value;
            }
        }}
    }
    getMesh() {
        const uniforms = this.uniforms = {
            luminance:	 { type: "f", value: 1.10 },
            turbidity:	 { type: "f", value: 1 },
            reileigh:	 { type: "f", value: 1.30 },
            mieCoefficient:	 { type: "f", value: 0.0022 },
            mieDirectionalG: { type: "f", value: 0.99 },
            sunPosition: 	 { type: "v3", value: new THREE.Vector3() },
            inclination: 0.18, // elevation / inclination
            azimuth: 0.75,
            sun: false
        };

        const sky = new THREE.Sky();
        this.sky = sky;
        this.mesh = sky.mesh;

        this.setUniforms(uniforms);

        return this.mesh;
    }
    animate() {

    }
}


// CONCATENATED MODULE: ./Render/mesh/Sun.js


class Sun extends AbstractMesh {
    constructor(loop) {
        super();
        this.getMesh();
        if (loop && loop.loop) {
            this.join(loop);
        }
        this.targetTime = {
            h: 0,
            m: 0
        };
        this.time = {
            h: 0,
            m: 0
        };
    }
    setTargetTime(hours, minutes) {
        this.targetTime.h = hours;
        this.targetTime.m = minutes;
    }
    getMesh() {
        const sun = new THREE.Mesh(
            new THREE.SphereGeometry( 20000, 16, 8 ),
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true })
        );
        sun.position.z = -950000; // initialize away from scene
        sun.position.y = -100000;
        sun.position.x = -200000;
        sun.visible = false;

        this.mesh = sun;
        return this.mesh;
    }

    /**
     * @param sky Sky
     */
    derivePosition(sky) {
        const distance = 400000;
        const uniforms = sky.uniforms;

        const theta = Math.PI * (uniforms.inclination - 0.5);
        const phi = 2 * Math.PI * (uniforms.azimuth - 0.5);

        const mesh = this.mesh;

        mesh.position.z = distance * Math.cos(phi);
        mesh.position.y = distance * Math.sin(phi) * Math.sin(theta);
        mesh.position.x = -(distance * Math.sin(phi) * Math.cos(theta));

        mesh.visible = uniforms.sun;

        sky.uniforms.sunPosition.value.copy(mesh.position);
    }
    animate() {
        if (this.time.h !== this.targetTime.h || this.time.m !== this.targetTime.m) {
            this.loop.addMinutes(1);
            this.time.m += 1;
            if (this.time.m >= 60) {
                this.time.h++;
                this.time.m -= 60;
                this.time.h %= 24;
            }
        }
    }
}


// CONCATENATED MODULE: ./Render/scene/lighting.js
const lighting = {
    addTo(scene) {
        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1.0);
        scene.add(light);
        const sun = new THREE.DirectionalLight(0xffffbb, 0.45);
        light.position.set(-1, 1, 1);
        this.light = light;
        this.sun = sun;
        scene.add(sun);
    },
    setLuminosity(level) {
        this.light.intensity = level;
        this.sun.intensity = level/2;
    }
};


// CONCATENATED MODULE: ./Render/Shaders/SkyShader.js
/**
 * @author zz85 / https://github.com/zz85
 *
 * Based on "A Practical Analytic Model for Daylight"
 * aka The Preetham Model, the de facto standard analytic skydome model
 * http://www.cs.utah.edu/~shirley/papers/sunsky/sunsky.pdf
 *
 * First implemented by Simon Wallner
 * http://www.simonwallner.at/projects/atmospheric-scattering
 *
 * Improved by Martin Upitis
 * http://blenderartists.org/forum/showthread.php?245954-preethams-sky-impementation-HDR
 *
 * Three.js integration by zz85 http://twitter.com/blurspline
 */

const loadSkyShader = () => {

    THREE.ShaderLib[ 'sky' ] = {

        uniforms: {
            luminance:	 { type: "f", value: 1 },
            turbidity:	 { type: "f", value: 2 },
            reileigh:	 { type: "f", value: 1 },
            mieCoefficient:	 { type: "f", value: 0.005 },
            mieDirectionalG: { type: "f", value: 0.8 },
            sunPosition: 	 { type: "v3", value: new THREE.Vector3() }
        },

        vertexShader: [
            "varying vec3 vWorldPosition;",

            "void main() {",

            "vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",
            "vWorldPosition = worldPosition.xyz;",

            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

            "}"
        ].join( "\n" ),

        fragmentShader: [

            "uniform sampler2D skySampler;",
            "uniform vec3 sunPosition;",
            "varying vec3 vWorldPosition;",

            "vec3 cameraPos = vec3(0., 0., 0.);",
            "// uniform sampler2D sDiffuse;",
            "// const float turbidity = 10.0; //",
            "// const float reileigh = 2.; //",
            "// const float luminance = 1.0; //",
            "// const float mieCoefficient = 0.005;",
            "// const float mieDirectionalG = 0.8;",

            "uniform float luminance;",
            "uniform float turbidity;",
            "uniform float reileigh;",
            "uniform float mieCoefficient;",
            "uniform float mieDirectionalG;",

            "// constants for atmospheric scattering",
            "const float e = 2.71828182845904523536028747135266249775724709369995957;",
            "const float pi = 3.141592653589793238462643383279502884197169;",

            "const float n = 1.0003; // refractive index of air",
            "const float N = 2.545E25; // number of molecules per unit volume for air at",
            "// 288.15K and 1013mb (sea level -45 celsius)",
            "const float pn = 0.035;	// depolatization factor for standard air",

            "// wavelength of used primaries, according to preetham",
            "const vec3 lambda = vec3(680E-9, 550E-9, 450E-9);",

            "// mie stuff",
            "// K coefficient for the primaries",
            "const vec3 K = vec3(0.686, 0.678, 0.666);",
            "const float v = 4.0;",

            "// optical length at zenith for molecules",
            "const float rayleighZenithLength = 8.4E3;",
            "const float mieZenithLength = 1.25E3;",
            "const vec3 up = vec3(0.0, 1.0, 0.0);",

            "const float EE = 1000.0;",
            "const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;",
            "// 66 arc seconds -> degrees, and the cosine of that",

            "// earth shadow hack",
            "const float cutoffAngle = pi/1.95;",
            "const float steepness = 1.5;",


            "vec3 totalRayleigh(vec3 lambda)",
            "{",
            "return (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn));",
            "}",

            // see http://blenderartists.org/forum/showthread.php?321110-Shaders-and-Skybox-madness
            "// A simplied version of the total Reayleigh scattering to works on browsers that use ANGLE",
            "vec3 simplifiedRayleigh()",
            "{",
            "return 0.0005 / vec3(94, 40, 18);",
            // return 0.00054532832366 / (3.0 * 2.545E25 * pow(vec3(680E-9, 550E-9, 450E-9), vec3(4.0)) * 6.245);
            "}",

            "float rayleighPhase(float cosTheta)",
            "{	 ",
            "return (3.0 / (16.0*pi)) * (1.0 + pow(cosTheta, 2.0));",
            "//	return (1.0 / (3.0*pi)) * (1.0 + pow(cosTheta, 2.0));",
            "//	return (3.0 / 4.0) * (1.0 + pow(cosTheta, 2.0));",
            "}",

            "vec3 totalMie(vec3 lambda, vec3 K, float T)",
            "{",
            "float c = (0.2 * T ) * 10E-18;",
            "return 0.434 * c * pi * pow((2.0 * pi) / lambda, vec3(v - 2.0)) * K;",
            "}",

            "float hgPhase(float cosTheta, float g)",
            "{",
            "return (1.0 / (4.0*pi)) * ((1.0 - pow(g, 2.0)) / pow(1.0 - 2.0*g*cosTheta + pow(g, 2.0), 1.5));",
            "}",

            "float sunIntensity(float zenithAngleCos)",
            "{",
            "return EE * max(0.0, 1.0 - exp(-((cutoffAngle - acos(zenithAngleCos))/steepness)));",
            "}",

            "// float logLuminance(vec3 c)",
            "// {",
            "// 	return log(c.r * 0.2126 + c.g * 0.7152 + c.b * 0.0722);",
            "// }",

            "// Filmic ToneMapping http://filmicgames.com/archives/75",
            "float A = 0.15;",
            "float B = 0.50;",
            "float C = 0.10;",
            "float D = 0.20;",
            "float E = 0.02;",
            "float F = 0.30;",
            "float W = 1000.0;",

            "vec3 Uncharted2Tonemap(vec3 x)",
            "{",
            "return ((x*(A*x+C*B)+D*E)/(x*(A*x+B)+D*F))-E/F;",
            "}",


            "void main() ",
            "{",
            "float sunfade = 1.0-clamp(1.0-exp((sunPosition.y/450000.0)),0.0,1.0);",

            "// luminance =  1.0 ;// vWorldPosition.y / 450000. + 0.5; //sunPosition.y / 450000. * 1. + 0.5;",

            "// gl_FragColor = vec4(sunfade, sunfade, sunfade, 1.0);",

            "float reileighCoefficient = reileigh - (1.0* (1.0-sunfade));",

            "vec3 sunDirection = normalize(sunPosition);",

            "float sunE = sunIntensity(dot(sunDirection, up));",

            "// extinction (absorbtion + out scattering) ",
            "// rayleigh coefficients",

            // "vec3 betaR = totalRayleigh(lambda) * reileighCoefficient;",
            "vec3 betaR = simplifiedRayleigh() * reileighCoefficient;",

            "// mie coefficients",
            "vec3 betaM = totalMie(lambda, K, turbidity) * mieCoefficient;",

            "// optical length",
            "// cutoff angle at 90 to avoid singularity in next formula.",
            "float zenithAngle = acos(max(0.0, dot(up, normalize(vWorldPosition - cameraPos))));",
            "float sR = rayleighZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));",
            "float sM = mieZenithLength / (cos(zenithAngle) + 0.15 * pow(93.885 - ((zenithAngle * 180.0) / pi), -1.253));",



            "// combined extinction factor	",
            "vec3 Fex = exp(-(betaR * sR + betaM * sM));",

            "// in scattering",
            "float cosTheta = dot(normalize(vWorldPosition - cameraPos), sunDirection);",

            "float rPhase = rayleighPhase(cosTheta*0.5+0.5);",
            "vec3 betaRTheta = betaR * rPhase;",

            "float mPhase = hgPhase(cosTheta, mieDirectionalG);",
            "vec3 betaMTheta = betaM * mPhase;",


            "vec3 Lin = pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * (1.0 - Fex),vec3(1.5));",
            "Lin *= mix(vec3(1.0),pow(sunE * ((betaRTheta + betaMTheta) / (betaR + betaM)) * Fex,vec3(1.0/2.0)),clamp(pow(1.0-dot(up, sunDirection),5.0),0.0,1.0));",

            "//nightsky",
            "vec3 direction = normalize(vWorldPosition - cameraPos);",
            "float theta = acos(direction.y); // elevation --> y-axis, [-pi/2, pi/2]",
            "float phi = atan(direction.z, direction.x); // azimuth --> x-axis [-pi/2, pi/2]",
            "vec2 uv = vec2(phi, theta) / vec2(2.0*pi, pi) + vec2(0.5, 0.0);",
            "// vec3 L0 = texture2D(skySampler, uv).rgb+0.1 * Fex;",
            "vec3 L0 = vec3(0.1) * Fex;",

            "// composition + solar disc",
            "//if (cosTheta > sunAngularDiameterCos)",
            "float sundisk = smoothstep(sunAngularDiameterCos,sunAngularDiameterCos+0.00002,cosTheta);",
            "// if (normalize(vWorldPosition - cameraPos).y>0.0)",
            "L0 += (sunE * 19000.0 * Fex)*sundisk;",


            "vec3 whiteScale = 1.0/Uncharted2Tonemap(vec3(W));",

            "vec3 texColor = (Lin+L0);   ",
            "texColor *= 0.04 ;",
            "texColor += vec3(0.0,0.001,0.0025)*0.3;",

            "float g_fMaxLuminance = 1.0;",
            "float fLumScaled = 0.1 / luminance;     ",
            "float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (g_fMaxLuminance * g_fMaxLuminance)))) / (1.0 + fLumScaled); ",

            "float ExposureBias = fLumCompressed;",

            "vec3 curr = Uncharted2Tonemap((log2(2.0/pow(luminance,4.0)))*texColor);",
            "vec3 color = curr*whiteScale;",

            "vec3 retColor = pow(color,vec3(1.0/(1.2+(1.2*sunfade))));",


            "gl_FragColor.rgb = retColor;",

            "gl_FragColor.a = 1.0;",
            "}"
        ].join( "\n" )
    };

    THREE.Sky = function() {

        const skyShader = THREE.ShaderLib[ "sky" ];
        const skyUniforms = THREE.UniformsUtils.clone(skyShader.uniforms);

        const skyMat = new THREE.ShaderMaterial({
            fragmentShader: skyShader.fragmentShader,
            vertexShader: skyShader.vertexShader,
            uniforms: skyUniforms,
            side: THREE.BackSide
        });

        const skyGeo = new THREE.SphereBufferGeometry(450000, 32, 15);
        const skyMesh = new THREE.Mesh(skyGeo, skyMat);

        // Expose variables
        this.mesh = skyMesh;
        this.uniforms = skyUniforms;
    };
};


// CONCATENATED MODULE: ./Render/Loop.js

















let ahead, initialPosition;

const AHEAD = () => {
    if (ahead) {
        return ahead;
    }
    if (typeof THREE !== 'undefined') {
        return ahead = new THREE.Vector3(0, VERTICAL_CORRECTION, -60.5)
    }
};
const INITIAL_POSITION = () => {
    if (initialPosition) {
        return initialPosition;
    }
    if (typeof THREE !== 'undefined') {
        return initialPosition = new THREE.Vector3(0, VERTICAL_CORRECTION, INITIAL_CAMERA_DISTANCE);
    }
};

/**
 * manager for the rendering loop
 */
class Loop_Loop {

    /**
     * @param {string} elementClass
     * @param {boolean} background
     * @param {Class} Animator
     */
    constructor(elementClass, background, Animator) {
        this.overwatchMoveTarget = null;
        this.lighting = lighting;
        this.Animator = Animator;
        this.loop = this.loop.bind(this);
        this.onResize = this.onResize.bind(this);

        this.elementClass = elementClass;

        /** @type {HTMLElement} */
        this.element = null;

        loadSkyShader();

        /** @type {Loop} */
        this.foreground = null;

        /** @type {Loop} */
        this.background = null;

        window.loop = this;
        this.timeOfDay = {
            h: 5,
            m: 30
        };
        this.main(background);
    }

    /**
     *
     * Caution: this is the main animation loop, do activate more than one per rendering layer.
     * Individual objects<AbstractMesh> can attach and detach to the manager to be rendered.
     *
     */
    loop() {
        this.loop.active = true;
        requestAnimationFrame(this.loop);

        this.panToward(this.target);
        const omt = this.overwatchMoveTarget;
        this.moveToward(this.moveTarget || {
            x: omt.x,
            y: omt.y + 12,
            z: omt.z
        });

        this.moveSpeed = 0.05;
        this.panSpeed = 0.3;

        this.objects.forEach(object => object.animate());
        //this.breathe();
        this.renderer.render(this.scene, this.camera);
    }

    /**
     * initialize lights, camera, action
     */
    main(background) {

        this.objects = [];

        if (this.getThree()) {

            const THREE = this.THREE;

            const scene = this.scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2( 0x838888, 0.002 );
            if (this.attach()) {
                lighting.addTo(scene);
                const camera = this.camera = new THREE.PerspectiveCamera(60, this.getAspect(), 0.1, 1000000);

                this.target = new THREE.Vector3(0, 0, -60.5);
                this._target = new THREE.Vector3(0, 0, -60.5);
                this.moveTarget = camera.position;

                this.resetCamera();
                if (!this.loop.active) {
                    this.loop();
                }
                if (background) {
                    this.addStaticMeshes();
                }
            } else {
                setTimeout(() => {
                    this.main(background);
                }, 2000);
            }

        }
    }

    /**
     * @param addition
     */
    addMinutes(addition) {
        let hours = this.timeOfDay.h, minutes = this.timeOfDay.m;
        minutes += addition;
        while (minutes >= 60) {
            minutes -= 60;
            hours += 1;
            hours %= 24;
        }
        this.setTimeOfDay(hours, minutes);
    }

    /**
     * @param hours
     * @param minutes
     * gradual transition
     */
    setTargetTimeOfDay(hours, minutes) {
        if (this.background) {
            var sun = this.background.sun;
        } else {
            sun = this.sun;
        }
        if (sun) {
            sun.setTargetTime(hours, minutes);
        } else {
            setTimeout(() => {
                this.setTargetTimeOfDay(hours, minutes);
            }, 500);
        }
    }

    /**
     * @param hours {Number} 0-24
     * @param minutes {Number} 0-60
     * instant transition
     */
    setTimeOfDay(hours, minutes) {
        this.timeOfDay = {
            h: hours,
            m: minutes
        };
        if (this.background) {
            var sky = this.background.sky,
                sun = this.background.sun;
        } else {
            sky = this.sky;
            sun = this.sun;
        }
        if (hours < 7.5) {
            hours += 24;
        }
        const azimuth = ((hours - 7.5)/24 + (minutes/60)/24);
        sky.uniforms.azimuth = azimuth;

        //if (azimuth > 0.5) {
        //    sky.uniforms.inclination = 0.48;
        //} else {
            sky.uniforms.inclination = 0.31;
        //}
        sun.time.h = hours;
        sun.time.m = minutes;
        sun.derivePosition(sky);
        const luminosity = (-0.5 + Math.max(Math.abs(1.25 - azimuth), Math.abs(0.25 - azimuth))) * 2;
        if (this.Animator) {
            this.Animator.setLuminosity(0.1 + luminosity/1.4);
        }
    }

    /**
     * used by the background layer
     */
    addStaticMeshes() {
        new Field_Field().join(this);
        new Mound_Mound().join(this);
        new Grass_Grass().join(this);
        new Grass_Grass(this, true);
        new BattersEye_BattersEye().join(this);
        const sun = new Sun(), sky = new Sky();
        sun.derivePosition(sky);
        sky.join(this);
        sun.join(this);

        this.sky = sky;
        this.sun = sun;

        new Wall_Wall(this, -34);
        new Wall_Wall(this, -15);
        new Wall_Wall(this, 15);
        new Wall_Wall(this, 34);

        const b1 = new Base_Base(this, 'first');
        const b2 = new Base_Base(this, 'second');
        const b3 = new Base_Base(this, 'third');
        const b4 = new Base_Base(this, 'home');

        new BaseDirt_BaseDirt(this, b1);
        new BaseDirt_BaseDirt(this, b2);
        new BaseDirt_BaseDirt(this, b3);
        new BaseDirt_BaseDirt(this, b4);

        new FoulLine_FoulLine(this, 'left');
        new FoulLine_FoulLine(this, 'right');

        new FoulPole_FoulPole(this, 'left');
        new FoulPole_FoulPole(this, 'right');

    }

    /**
     * experimental camera bobbing
     */
    breathe() {
        const pos = this.camera.position;
        const x = pos.x, y = pos.y, z = pos.z;
        const rate = 0.0005 * this.bob || 1;
        if (y > 0.6) {
            this.bob = -1;
        } else if (y < -0.6) {
            this.bob = 1;
        }
        //pos.x += rate;
        pos.y += rate;
        pos.z += rate;
    }
    getThree() {
        if (this.THREE === Loop_Loop.prototype.THREE && typeof window === 'object' && window.THREE) {
            return this.THREE = window.THREE;
        }
        return true;
    }

    /**
     * attach to the DOM
     * @returns {THREE.WebGLRenderer|Boolean}
     */
    attach() {
        window.removeEventListener('resize', this.onResize, false);
        window.addEventListener('resize', this.onResize, false);

        this.element = document.getElementsByClassName(this.elementClass)[0];

        const { element } = this;
        if (element) {
            element.innerHTML = '';
            const THREE = this.THREE;
            const renderer = new THREE.WebGLRenderer({ alpha: true });
            this.setSize(renderer);
            //renderer.setClearColor(0xffffff, 0);

            element.appendChild(renderer.domElement);

            this.renderer = renderer;
            return renderer;
        }
        return false;
    }

    /**
     * higher FOV on lower view widths
     */
    onResize() {
        const element = this.element;
        this.camera.aspect = this.getAspect();
        this.camera.fov = Math.max(90 - 30 * (element.offsetWidth / 1200), 55);
        this.camera.updateProjectionMatrix();
        this.setSize(this.renderer);
    }
    setSize(renderer) {
        const element = this.element;
        const width = element.offsetWidth;
        renderer.setSize(width, HEIGHT);
    }
    getAspect() {
        const element = this.element;
        return element.offsetWidth / HEIGHT;
    }

    /**
     * incrementally pan toward the vector given
     * @param vector
     */
    panToward(vector) {
        const maxIncrement = this.panSpeed;
        this.forAllLoops(loop => {
            const target = loop._target;
            if (target) {
                target.x = target.x + Math.max(Math.min((vector.x - target.x)/100, maxIncrement), -maxIncrement);
                target.y = target.y + Math.max(Math.min((vector.y - target.y)/100, maxIncrement), -maxIncrement);
                target.z = target.z + Math.max(Math.min((vector.z - target.z)/100, maxIncrement), -maxIncrement);
                loop.camera.lookAt(target);
            }
        });
    }

    /**
     * incrementally move the camera to the vector
     * @param vector
     */
    moveToward(vector) {
        const maxIncrement = this.moveSpeed;
        this.forAllLoops(loop => {
            const position = loop.camera && loop.camera.position;
            if (position) {
                position.x += Math.max(Math.min((vector.x - position.x), maxIncrement), -maxIncrement);
                position.y += Math.max(Math.min((vector.y - position.y), maxIncrement), -maxIncrement);
                position.z += Math.max(Math.min((vector.z - position.z), maxIncrement), -maxIncrement);
            }
        });
    }

    /**
     * setting a target will cause the camera to pan toward it using the pan method above
     * @param vector
     * @param panSpeed
     */
    setLookTarget(vector, panSpeed) {
        this.forAllLoops(loop => {
            loop.panSpeed = panSpeed;
            loop.panning = vector !== AHEAD();
            loop.target = vector;
        });
    }

    /**
     * setting a target will cause the camera to move toward it using the incremental method above
     * @param vector
     * @param moveSpeed
     */
    setMoveTarget(vector, moveSpeed) {
        this.forAllLoops(loop => {
            loop.moveSpeed = moveSpeed;
            loop.moveTarget = vector;
            loop.overwatchMoveTarget = null;
        });
    }
    setOverwatchMoveTarget(vector, moveSpeed) {
        this.forAllLoops(loop => {
            loop.moveSpeed = moveSpeed;
            loop.overwatchMoveTarget = vector;
            loop.moveTarget = null;
        });
    }
    resetCamera() {
        let moveSpeed = 0.5;
        if (this.camera.position.z !== INITIAL_POSITION().z) {
            moveSpeed = 2.5;
        }
        this.setLookTarget(AHEAD(), moveSpeed);
        this.setMoveTarget(INITIAL_POSITION(), moveSpeed/10);
    }
    moveCamera(x, y, z) {
        if (typeof x === 'object') {
            return this.moveCamera(x.x, x.y, x.z);
        }
        this.forAllLoops(loop => {
            loop.camera.position.x = x;
            loop.camera.position.y = y;
            loop.camera.position.z = z;
        });
    }

    /**
     * execute the function on all loops
     * @param fn {Function}
     */
    forAllLoops(fn) {
        if (this.background) {
            fn(this.background);
        }
        if (this.foreground) {
            fn(this.foreground);
        }
        fn(this);
    }

    test() {
        const ball = new Ball_Ball();
        window.Ball = Ball_Ball;
        window.ball = ball;
        ball.setType('4-seam');
        //with (ball.mesh.rotation) {x=0,y=0,z=0}; ball.rotation = {x:0.00, y:0.00};
        ball.animate = () => {
            ball.rotate();
        };
        ball.join(this);
        // Baseball.service.Animator.loop.test();
    }

    testTrajectory(data) {
        const ball = new Ball_Ball();
        window.Ball = Ball_Ball;
        window.ball = ball;
        ball.deriveTrajectory(data || {
            splay: -35,
            travelDistance: 135,
            flyAngle: -15,
            x: 100,
            y: 100
        }, {
            x: 0, y: 0
        });
        ball.join(this);
    }
}

var HEIGHT = 700;

Loop_Loop.prototype.THREE = {};
Loop_Loop.prototype.constructors = {
    Ball: Ball_Ball,
    Mound: Mound_Mound,
    Field: Field_Field
};



// CONCATENATED MODULE: ./Services/Animator.js





const Animator_Animator = function() {
    this.init();
    throw new Error('No need to instantiate Animator');
};
Animator_Animator.TweenMax = {};
Animator_Animator.prototype = {
    identifier : 'Animator',
    constructor : Animator_Animator,
    /**
     * console mode disables most animator functions
     */
    get console() {
        return Animator_Animator.console;
    },
    set console(value) {
        Animator_Animator.console = value;
    },
    TweenMax : {},
    THREE : {},
    /**
     * anything other than webgl will use TweenMax for JS animations
     */
    renderingMode : 'webgl',
    init() {
        if (Animator_Animator.console) return;
        if (!this.loop && this.renderingMode === 'webgl') {
            this.beginRender();
        }
    },
    /**
     * @returns {Loop}
     */
    beginRender() {
        this.background = new Loop_Loop('webgl-bg-container', true, Animator_Animator);
        this.loop = new Loop_Loop('webgl-container', false, Animator_Animator);

        this.loop.background = this.background;
        this.background.foreground = this.loop;

        return this.loop;
    },
    /**
     * @param level {Number} 0 to 1
     */
    setLuminosity(level) {
        if (this.console) return;
        this.loop.lighting.setLuminosity(level);
        this.background.lighting.setLuminosity(level);
    },
    loadTweenMax() {
        if (this.console || typeof window !== 'object') {
            Animator_Animator.TweenMax = {
                set() {},
                to() {},
                from() {},
                killAll() {}
            }
        } else {
            Animator_Animator.TweenMax = window.TweenMax;
        }
        return Animator_Animator.TweenMax;
    },
    TIME_FROM_SET : 2300, //ms
    TIME_FROM_WINDUP : 3600, //ms
    HOLD_UP_ALLOWANCE : 0.25, // seconds
    pitchTarget : null,
    pitchBreak : null,
    /**
     * this is called with $scope context binding
     * @param callback
     */
    updateFlightPath(callback) {
        if (Animator_Animator.console) return;

        if (Animator_Animator.renderingMode === 'webgl') {
            return Animator_Animator.renderFlightPath(callback, this);
        }
        return Animator_Animator.tweenFlightPath(callback, this);
    },
    /**
     * @param callback
     * @param $scope
     * animates the pitch's flight path
     */
    tweenFlightPath(callback, $scope) {
        const TweenMax = Animator_Animator.loadTweenMax();
        TweenMax.killAll();
        const game = $scope.y, top = 200-game.pitchTarget.y, left = game.pitchTarget.x, breakTop = 200-game.pitchInFlight.y, breakLeft = game.pitchInFlight.x, $baseballs = $('.baseball'), flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400, originTop = 50, originLeft = 110 + (game.pitcher.throws == 'left' ? 20 : -20);
        const pitch = this.pitchTarget = $('.main-area .target .baseball.pitch'), henka = this.pitchBreak = $('.main-area .target .baseball.break'), quarter = flightSpeed/4;

        const pitchTransition = Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 12, 4), targetTransition = Mathinator.pitchTransition(top, left, originTop, originLeft, quarter, 10, 3);

        const transitions = [
            pitchTransition(0, 0),
            pitchTransition(10, 0),
            pitchTransition(30, 1),
            pitchTransition(50, 2),

            targetTransition(100, 3),
            pitchTransition(100, 3, breakTop, breakLeft)
        ];

        TweenMax.set([pitch, henka], transitions[0]);
        TweenMax.to([pitch, henka], quarter, transitions[1]);
        TweenMax.to([pitch, henka], quarter, transitions[2]);
        TweenMax.to([pitch, henka], quarter, transitions[3]);
        TweenMax.to(pitch, quarter, transitions[4]);
        TweenMax.to(henka, quarter, transitions[5]);

        $scope.lastTimeout = setTimeout(() => {
            $scope.allowInput = true;
            if (typeof callback == 'function') {
                callback();
            }
        }, flightSpeed*1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting() && Math.random()*180 > game.batter.skill.offense.eye) {
                $('.baseball.break').addClass('hide');
            } else {
                $('.baseball.break').removeClass('hide');
            }
            $('.baseball.pitch').removeClass('hide');
        }

        if (game.humanBatting() && !game.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(() => {
                $scope.holdUp();
            }, (flightSpeed + Animator_Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param callback
     * @param $scope Angular scope
     * webgl version of tweenFlightPath
     */
    renderFlightPath(callback, $scope) {
        const TweenMax = Animator_Animator.loadTweenMax();
        TweenMax.killAll();
        const game = $scope.y,
              flightSpeed = Mathinator.getFlightTime(game.pitchInFlight.velocity,
                  helper.pitchDefinitions[game.pitchInFlight.name][2]);

        game.expectedSwingTiming = Date.now() + flightSpeed * 1000;

        if (!this.loop) {
            this.beginRender();
        }
        const ball = new this.loop.constructors.Ball();
        Animator_Animator._ball = ball;
        ball.derivePitchingTrajectory(game);
        ball.trajectory = ball.breakingTrajectory;
        ball.join(this.loop);

        $scope.lastTimeout = setTimeout(() => {
            $scope.allowInput = true;
            if (typeof callback === 'function') {
                callback();
            }
        }, flightSpeed * 1000);

        const $baseballs = $('.baseball');
        $baseballs.addClass('hide');

        if (game.humanBatting()) {
            $scope.holdUpTimeouts.push(setTimeout(() => {
                $scope.holdUp();
            }, (flightSpeed + Animator_Animator.HOLD_UP_ALLOWANCE) * 1000));
        }
    },
    /**
     * @param game
     * @returns {*}
     * This only animates the flight arc of the ball in play.
     */
    animateFieldingTrajectory(game) {
        if (Animator_Animator.console) return game.swingResult;

        if (this.renderingMode === 'webgl') {
            setTimeout(() => {
                Animator_Animator.tweenFieldingTrajectory(game, true);
            }, 50);
            return Animator_Animator.renderFieldingTrajectory(game);
        }
        return Animator_Animator.tweenFieldingTrajectory(game);
    },
    /**
     * @param game
     * @param splayOnly
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * JS/CSS animation
     */
    tweenFieldingTrajectory(game, splayOnly) {
        const TweenMax = Animator_Animator.loadTweenMax();
        let ball = $('.splay-indicator-ball');
        TweenMax.killAll();
        const result = game.swingResult;

        const linearApproximateDragScalar = {
            distance: 1,
            apexHeight: 0.57,
            airTime: 0.96
        };

        let angle = result.flyAngle;
        const distance = Math.abs(result.travelDistance);
        const scalar = result.travelDistance < 0 ? -1 : 1;

        Mathinator.memory.bounding = angle < 0;
        angle = 1 + Math.abs(angle);
        if (angle > 90) angle = 180 - angle;

        const velocity = linearApproximateDragScalar.distance * Math.sqrt(9.81 * distance / Math.sin(2*Math.PI*angle/180));
        const velocityVerticalComponent = Math.sin(Mathinator.RADIAN * angle) * velocity;
        const apexHeight = velocityVerticalComponent*velocityVerticalComponent/(2*9.81) * linearApproximateDragScalar.apexHeight;
        const airTime = 1.5 * Math.sqrt(2*apexHeight/9.81) * linearApproximateDragScalar.airTime; // 2x freefall equation

        //log('angle', angle, 'vel', velocity, 'apex', apexHeight, 'air', airTime, 'dist', result.travelDistance);
        const quarter = airTime/4;
        const mathinator = new Mathinator();
        let transitions = [
            mathinator.transitionalTrajectory(0, quarter, 0, apexHeight, scalar * distance, result.splay),
            mathinator.transitionalTrajectory(25, quarter, 0),
            mathinator.transitionalTrajectory(50, quarter, 1),
            mathinator.transitionalTrajectory(75, quarter, 2),
            mathinator.transitionalTrajectory(100, quarter, 3)
        ];
        TweenMax.set(ball, transitions[0]);
        TweenMax.to(ball, quarter, transitions[1]);
        TweenMax.to(ball, quarter, transitions[2]);
        TweenMax.to(ball, quarter, transitions[3]);
        TweenMax.to(ball, quarter, transitions[4]);

        if (!splayOnly) {
            ball = $('.indicator.baseball.break').removeClass('hide').show();
            const time = quarter/2;
            transitions = [
                mathinator.transitionalCatcherPerspectiveTrajectory(0, time, 0, apexHeight, scalar * distance,
                    result.splay, game.pitchInFlight),
                mathinator.transitionalCatcherPerspectiveTrajectory(12.5,   time * 0.75, 0),
                mathinator.transitionalCatcherPerspectiveTrajectory(25,     time * 0.80, 1),
                mathinator.transitionalCatcherPerspectiveTrajectory(37.5,   time * 0.85, 2),
                mathinator.transitionalCatcherPerspectiveTrajectory(50,     time * 0.90, 3),
                mathinator.transitionalCatcherPerspectiveTrajectory(62.5,   time * 0.95, 4),
                mathinator.transitionalCatcherPerspectiveTrajectory(75,     time, 5),
                mathinator.transitionalCatcherPerspectiveTrajectory(87.5,   time, 6),
                mathinator.transitionalCatcherPerspectiveTrajectory(100,    time, 7)
            ];
            TweenMax.set(ball, transitions[0]);
            TweenMax.to(ball, time, transitions[1]);
            TweenMax.to(ball, time, transitions[2]);
            TweenMax.to(ball, time, transitions[3]);
            TweenMax.to(ball, time, transitions[4]);
            TweenMax.to(ball, time, transitions[5]);
            TweenMax.to(ball, time, transitions[6]);
            TweenMax.to(ball, time, transitions[7]);
            TweenMax.to(ball, time, transitions[8]);

            setTimeout(() => {
                // hack
                $('.indicator.baseball.break').removeClass('hide').show();
            }, 50);
        }

        return game.swingResult;
    },
    /**
     * @param game
     * @returns {Game.swingResult|*|swingResult|Field.game.swingResult}
     * WebGL version of tweenFieldingTrajectory
     */
    renderFieldingTrajectory(game) {
        if (!this.loop) {
            this.beginRender();
        }
        const result = game.swingResult;

        const ball = Animator_Animator._ball || new this.loop.constructors.Ball();
        ball.deriveTrajectory(result, game.pitchInFlight);
        ball.join(this.loop);

        if (result.thrownOut || result.caught || result.bases) {
            if ((Math.random() < 0.15 && ball.airTime > 1.5)
                ||
                (Math.random() < 0.50 && ball.airTime > 2.5)) {
                var scale = 1;
                if (result.splay > 0) {
                   scale = -1;
                }
                this.loop.setLookTarget(ball.mesh.position, 0.3);
                this.loop.setOverwatchMoveTarget(ball.mesh.position, 0.32);
            } else {
                this.loop.setLookTarget(ball.mesh.position, 0.5);
                this.loop.setMoveTarget({x: 0, y: 6, z: INITIAL_CAMERA_DISTANCE}, 0.05);
            }
        } else if (Math.abs(result.splay) < 60) {
            this.loop.setLookTarget(ball.mesh.position, 0.5);
            this.loop.setMoveTarget({x: 0, y: 6, z: INITIAL_CAMERA_DISTANCE}, 0.05);
        }

        return game.swingResult;
    }
};

for (const fn in Animator_Animator.prototype) {
    if (Animator_Animator.prototype.hasOwnProperty(fn)) {
        Animator_Animator[fn] = Animator_Animator.prototype[fn];
    }
}


// CONCATENATED MODULE: ./Model/Field.js





/**
 * The baseball field tracks the ball's movement, fielders, and what runners are on
 * @param game
 * @constructor
 */
const Model_Field_Field = function(game) {
    this.init(game);
};

Model_Field_Field.prototype = {
    constructor : Model_Field_Field,
    init(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    /**
     * @returns {boolean}
     */
    hasRunnersOn() {
        return this.first instanceof Player || this.second instanceof Player || this.third instanceof Player;
    },
    /**
     * @param swing
     * @returns {object}
     */
    determineSwingContactResult(swing) {

        if (this.first) this.first.fatigue += 4;
        if (this.second) this.second.fatigue += 4;
        if (this.third) this.third.fatigue += 4;

        const x = swing.x, y = swing.y;
        const game = this.game;
        const eye = game.batter.skill.offense.eye;
        /**
         * The initial splay angle is 90 degrees for hitting up the middle and 0
         * for a hard foul left, 180 is a foul right. Depending on the angle of the bat,
         * a y-axis displacement which would otherwise pop or ground the ball can instead
         * increase the left/right effect.
         */
        const angles = Mathinator.getSplayAndFlyAngle(
            x, y, swing.angle, eye,
            swing.timing,
            game.batter.bats === 'left'
        );
        const splayAngle = angles.splay;

        const flyAngle = angles.fly;
        const power = this.game.batter.skill.offense.power + (this.game.batter.eye.bonus || 0)/5;
        let landingDistance = Distribution.landingDistance(power, flyAngle, x, y);
        if (flyAngle < 0 && landingDistance > 95) {
            landingDistance = (landingDistance - 95)/4 + 95;
        }

        if (Math.abs(splayAngle) > 50) swing.foul = true;
        swing.fielder = this.findFielder(splayAngle, landingDistance, power, flyAngle);
        if (['first', 'second', 'short', 'third'].includes(swing.fielder)) {
            landingDistance = Math.min(landingDistance, 110); // stopped by infielder
        } else {
            landingDistance = Math.max(landingDistance, 150); // rolled past infielder
        }
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        /**
         * the splay for the result is adjusted to 0 being up the middle and negatives being left field
         * @type {number}
         */
        swing.splay = splayAngle;
        swing.sacrificeAdvances = [];

        if (swing.fielder) {
            const fielder = (game.half === 'top' ? game.teams.home.positions[swing.fielder] : game.teams.away.positions[swing.fielder]);
            const isOutfielder = fielder.position in { left: true, center: true, right: true };
            fielder.fatigue += 4;
            swing.error = false;
            let fieldingEase = fielder.skill.defense.fielding/100;
            const throwingEase = (fielder.skill.defense.throwing/100);
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle + 90, landingDistance]);
            const speedComponent = (1 + Math.sqrt(fielder.skill.defense.speed/100))/2 * 100;
            const interceptRating = speedComponent * 1.8 + flyAngle * 2.4 - swing.fielderTravel*1.55 - 15;
            if (interceptRating > 0 && flyAngle > 4) {
                //caught cleanly?
                if (Distribution.error(fielder)) { //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    fielder.stats.fielding.E++;
                    swing.caught = false;
                } else {
                    fielder.stats.fielding.PO++;
                    swing.caught = true;
                    if (game.umpire.count.outs < 2 && isOutfielder) {
                        const sacrificeThrowInTime = Mathinator.fielderReturnDelay(
                            swing.travelDistance, throwingEase, fieldingEase, 100
                        );
                        // todo ran into outfield assist
                        if (this.first && sacrificeThrowInTime > this.first.getBaseRunningTime() + 4.5) {
                            swing.sacrificeAdvances.push('first');
                        }
                        if (this.second && sacrificeThrowInTime > this.second.getBaseRunningTime()) {
                            swing.sacrificeAdvances.push('second');
                        }
                        if (this.third && sacrificeThrowInTime > this.third.getBaseRunningTime() - 0.5) {
                            swing.sacrificeAdvances.push('third');
                        }
                    }
                }
            } else {
                swing.caught = false;
            }

            if (!swing.caught) {
                swing.bases = 0;
                swing.thrownOut = false; // default value
                let fieldingReturnDelay = Mathinator.fielderReturnDelay(swing.travelDistance, throwingEase, fieldingEase, interceptRating);
                swing.fieldingDelay = fieldingReturnDelay;
                swing.outfielder = {'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] === 1;
                const speed = game.batter.skill.offense.speed;
                let baseRunningTime = Mathinator.baseRunningTime(speed);

                if (swing.outfielder) {
                    swing.bases = 1;
                    baseRunningTime *= 1.05;
                    fieldingReturnDelay -= baseRunningTime;

                    while (((fieldingReturnDelay > baseRunningTime && Math.random() < 0.25 + speed/200)
                    || Math.random() < 0.04 + speed/650) && swing.bases < 3) {
                        baseRunningTime *= 0.95;
                        swing.bases++;
                        fieldingReturnDelay -= baseRunningTime;
                    }
                } else {
                    const first = this.first, second = this.second, third = this.third;
                    swing.fieldersChoice = null;
                    swing.bases = fieldingReturnDelay >= baseRunningTime + 1 ? 1 : 0;
                    if (first && fieldingReturnDelay < first.getBaseRunningTime()) swing.fieldersChoice = 'first';
                    if (first && second && fieldingReturnDelay < second.getBaseRunningTime() + 0.6) swing.fieldersChoice = 'second';
                    if (third && fieldingReturnDelay < third.getBaseRunningTime()) swing.fieldersChoice = 'third';
                    // double play
                    let outs = game.umpire.count.outs;
                    if (swing.fieldersChoice) {
                        outs++;
                        swing.bases = 1;
                        const fielders = fielder.team.positions;
                        let force = this.forcePlaySituation();
                        if (force) {
                            const additionalOuts = [];
                            let throwingDelay = fieldingReturnDelay;
                            if (third && force === 'third' &&
                                Mathinator.infieldThrowDelay(fielders.catcher) + throwingDelay < second.getBaseRunningTime() && outs < 3) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.catcher);
                                fielders.catcher.fatigue += 4;
                                additionalOuts.push('second');
                                outs++;
                                force = 'second';
                            }
                            if (second && force === 'second' &&
                                Mathinator.infieldThrowDelay(fielders.third) + throwingDelay < first.getBaseRunningTime() && outs < 3) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.third);
                                fielders.third.fatigue += 4;
                                additionalOuts.push('first');
                                outs++;
                                force = 'first';
                            }
                            if (first && force === 'first' &&
                                Mathinator.infieldThrowDelay(fielders.second) + throwingDelay < game.batter.getBaseRunningTime() && outs < 3) {
                                throwingDelay += Mathinator.infieldThrowDelay(fielders.second);
                                fielders.second.fatigue += 4;
                                additionalOuts.push('batter');
                                swing.bases = 0;
                                // todo (or shortstop)
                                outs++;
                            }
                            if (outs - game.umpire.count.outs === 2) {
                                swing.doublePlay = true;
                            }
                            if (additionalOuts.length) {
                                swing.additionalOuts = additionalOuts;
                                swing.firstOut = swing.fieldersChoice;
                                if (additionalOuts.includes('batter')) {
                                    delete swing.fieldersChoice;
                                }
                            }
                        }
                        //console.log('DP?', !!this.forcePlaySituation(), 'throwingDelay', throwingDelay,
                        //    'fielding delay', fieldingReturnDelay, 'runner', game.batter.getBaseRunningTime());
                        //if (typeof additionalOuts !== 'undefined' && additionalOuts.length) {
                        //    console.log('omg dp', additionalOuts);
                        //}
                    } else {
                        delete swing.additionalOuts;
                        delete swing.firstOut;
                        delete swing.doublePlay;
                        delete swing.fieldersChoice;
                    }
                }
                swing.thrownOut = swing.bases == 0;
                if (swing.thrownOut) {
                    fielder.stats.fielding.PO++; // todo A to PO
                    swing.thrownOut = true;
                    swing.error = false;
                }
            }
        } else {
            if (Math.abs(splayAngle) < 45 && landingDistance > 300) {
                swing.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }
        this.game.swingResult = swing;
        if (!Animator_Animator.console) {
            Animator_Animator._ball.hasIndicator = true;
            Animator_Animator.animateFieldingTrajectory(this.game);
        }
    },
    forcePlaySituation() {
        const first = this.first, second = this.second, third = this.third;
        return (first && second && third) && 'third' || (first && second) && 'second' || first && 'first';
    },
    /**
     * @returns {Player}
     * the best steal candidate.
     */
    getLeadRunner() {
        const first = this.first, second = this.second, third = this.third;
        if (third && first && !second) return first;
        return third || second || first;
    },
    //printRunnerNames : function() {
    //    return [this.first ? this.first.getName() : '', this.second ? this.second.getName() : '', this.third ? this.third.getname() : ''];
    //},
    /**
     * @param splayAngle {Number} 0 to 180, apparently
     * @param landingDistance {Number} in feet, up to 310 or so
     * @param power {Number} 0-100
     * @param flyAngle {Number} roughly -15 to 90
     * @returns {string|boolean}
     */
    findFielder(splayAngle, landingDistance, power, flyAngle) {
        const angle = splayAngle; // 0 is up the middle, clockwise increasing

        let fielder;

        if (Math.abs(angle) > 50) return false; // foul
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 45 && Math.abs(angle) < 5) {
            return 'pitcher';
        }

        let infield = landingDistance < 145 - (Math.abs(angle))/90*50;
        if (flyAngle < 7) { // 7 degrees straight would fly over the infielder, but add some for arc
            let horizontalVelocity = Math.cos(flyAngle/180*Math.PI) * (85 + (power/100) * 10); // mph toward infielder
            if (flyAngle < 0) horizontalVelocity *= 0.5; // velocity loss on bounce
            const fielderLateralReachDegrees = 1 + 22.5 * (100 - horizontalVelocity)/100; // up to 90/4 = 22.5
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else { // first has reduced arc to receive the throw
                fielder = 'first';
            }
            const fielderArcPosition = this.positions[fielder][0] - 90;
            // a good infielder can field a hard hit grounder even with a high terminal distance
            infield = Math.abs(angle - (fielderArcPosition)) < fielderLateralReachDegrees;
        }

        // ball in the air to infielder
        if (infield && landingDistance > 15) {
            if (angle < -20) {
                fielder = 'third';
            } else if (angle < 5) {
                fielder = 'short';
            } else if (angle < 30) {
                fielder = 'second';
            } else { // first has reduced arc to receive the throw
                fielder = 'first';
            }
        } else if (landingDistance < 310) { // past the infield or fly ball to outfielder
            if (angle < -15) {
                fielder = 'left';
            } else if (angle < 16) {
                fielder = 'center';
            } else {
                fielder = 'right';
            }
        } else {
            fielder = false;
        }
        return fielder;
    },
    /**
     * approximate fielder positions (polar degrees where 90 is up the middle, distance from origin (home plate))
     */
    positions : {
        pitcher : [90, 66],
        catcher : [0, 0],
        first : [90 + 45 - 7, 98],
        second : [90 + 12.5, 130],
        short : [90 - 12.5, 130],
        third : [90 - 45 + 7, 98],
        left : [45 + 14, 280],
        center : [90, 280],
        right : [135 - 14, 280]
    },
    getPolarDistance(a, b) {
        return Mathinator.getPolarDistance(a, b);
    }
};


// CONCATENATED MODULE: ./Model/Manager.js


const Manager = function(team) {
    this.init(team);
};

Manager.prototype = {
    constructor : Manager,
    init(team) {
        this.team = team;
    },
    makeLineup() {
        let jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        if (!this.team.positions.pitcher.number) {
            this.team.positions.pitcher.number = jerseyNumber++;
        }
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], 'right');
        this.team.positions.catcher.position = 'catcher';
        if (!this.team.positions.catcher.number) {
            this.team.positions.catcher.number = jerseyNumber++;
        }
        Iterator.each(this.team.bench, (key, player) => {
            if (!player.number) {
                jerseyNumber += 1 + (Math.random() * 5 | 0);
                player.number = jerseyNumber;
            }
        });
        this.team.positions.short = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'right');
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(this.team.bench, ['defense', 'fielding'], 'left');
        this.team.positions.first.position = 'first';

        this.team.lineup[3] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[3].order = 3;
        this.team.lineup[2] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[2].order = 2;
        this.team.lineup[4] = this.selectForSkill(this.team.positions, ['offense', 'power']);
        this.team.lineup[4].order = 4;
        this.team.lineup[0] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[0].order = 0;
        this.team.lineup[1] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[1].order = 1;
        this.team.lineup[5] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[5].order = 5;
        this.team.lineup[6] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[6].order = 6;
        this.team.lineup[7] = this.selectForSkill(this.team.positions, ['offense', 'eye']);
        this.team.lineup[7].order = 7;
        this.team.lineup[8] = this.selectForSkill(this.team.positions, ['offense', 'speed']);
        this.team.lineup[8].order = 8;
    },
    selectForSkill(pool, skillset, requiredThrowingHandedness) {
        if (this.team.bench.length || pool === this.team.positions) {
            let selection = this.team.bench[0];
            let rating = 0;
            let index = 0;
            Iterator.each(pool, (key, player) => {
                const skills = skillset.slice();
                let cursor = player.skill;
                let property = skills.shift();
                while (property) {
                    cursor = cursor[property];
                    property = skills.shift();
                }
                if (!(player.order+1) && cursor >= rating && (!requiredThrowingHandedness || player.throws === requiredThrowingHandedness)) {
                    rating = cursor;
                    selection = player;
                    index = key;
                }
            });
            if (pool === this.team.bench) {
                delete this.team.bench[index];
                this.team.bench = this.team.bench.filter(player => player instanceof selection.constructor);
            }
            return selection;
        }
        return 'no players available';
    },
    /**
     * used by the AI to substitute a fatigued pitcher
     * @param {Number} fatigueAllowed
     * only execute if the pitcher's fatigue is greater than this number
     */
    checkPitcherFatigue(fatigueAllowed = 120) {
        const team = this.team;
        const pitcher = team.positions.pitcher;

        const sub = this.selectForSkill(team.bench, ['pitching']);
        if (!(sub && sub.substitute)) {
            return;
        }

        const replace = pitcher.fatigue - pitcher.skill.pitching;
        const remain = fatigueAllowed - sub.skill.pitching;

        if (replace > remain) {
            sub.substitute(pitcher);
        } else {
            team.bench.push(sub);
        }
    }
};


// CONCATENATED MODULE: ./Model/Team.js







const Team = function(game, heroRate) {
    this.init(game, heroRate);
};

TeamConstants.RUNNERS_DISCRETION = 'runnersDiscretion';
TeamConstants.RUNNER_GO = 'go';
TeamConstants.RUNNER_HOLD = 'hold';

Team.prototype = {
    constructor : Team,
    init(game, heroRate) {
        this.sub = this.noSubstituteSelected;
        heroRate = heroRate || 0.10;
        this.substituted = [];
        this.pickName();
        this.lineup = [];
        this.bench = [];
        this.bullpen = [];
        this.positions = {
            pitcher : null,
            catcher : null,
            first : null,
            second : null,
            short : null,
            third : null,
            left : null,
            center : null,
            right : null
        };
        this.manager = new Manager(this);
        if (game !== 'no init') {
            this.game = game;
            for (let j = 0; j < 20; j++) {
                this.bench.push(new Player(this, Math.random() < heroRate));
            }
            if (this.bench.length === 20) {
                this.manager.makeLineup();
            }
        }
    },
    pickName() {
        const teamNameIndex = Math.floor(Math.random()*data_data.teamNames.length);
        this.name = data_data.teamNames[teamNameIndex];
        this.nameJ = data_data.teamNamesJ[teamNameIndex];
    },
    getName() {
        return text_text.mode === 'n' ? this.nameJ : this.name;
    },
    stealAttempt : TeamConstants.RUNNERS_DISCRETION,
    lineup : [],
    positions : {},
    manager : null,
    bench : [],
    bullpen : [],
    nowBatting : 0,
    expanded : 'Player&',
    noSubstituteSelected : {
        toString() { return ''; },
        toValue() { return false; }
    }
};


// CONCATENATED MODULE: ./Model/Umpire.js



const Umpire = function(game) {
    this.init(game);
};

Umpire.prototype = {
    constructor : Umpire,
    init(game) {
        this.game = game;
        this.playBall();
        this.count = {
            strikes : 0,
            balls : 0,
            outs : 0
        };
    },
    /**
     * starts the game by announcing it and signalling the first batter up
     */
    playBall() {
        const game = this.game;
        game.half = 'top';
        game.inning = 1;
        game.batter = game.teams.away.lineup[0];
        game.batterRunner = game.teams.away.lineup[0];
        game.deck = game.teams.away.lineup[1];
        game.hole = game.teams.away.lineup[2];
        game.pitcher = game.teams.home.positions.pitcher;
        const n = `一回のオモテ、${game.teams.away.nameJ}の攻撃対${game.teams.home.nameJ}、ピッチャーは${game.teams.home.positions.pitcher.nameJ}。`, e = `Top 1, ${game.teams.away.name} offense vs. ${game.teams.home.positions.pitcher.name} starting for ${game.teams.home.name}`;
        game.log.note(e, n);
        game.batter.ready = true;
        game.log.noteBatter(
            game.batter
        );
    },
    /**
     * makes the call based on the last pitch and swing (or no swing)
     * @todo add margin of error to Umpire to simulate real umpiring, haha
     */
    makeCall() {
        this.says = '';
        const game = this.game;
        const result = game.swingResult;
        const pitcher = game.pitcher;
        const batter = game.batter;
        const field = game.field;

        if (game.swingResult.fielder) {
            var fielder = game.teams[game.half === 'top' ? 'home' : 'away'].positions[result.fielder]
        } else {
            fielder = null;
        }

        game.batterRunner = game.batter;

        if (!isNaN(result.stoleABase)) {
            var thief = game.batter.team.lineup[result.stoleABase];
            thief.atBats.push(Log.prototype.STOLEN_BASE);
            switch (thief) {
                case field.first:
                    field.second = thief;
                    field.first = null;
                    break;
                case field.second:
                    field.third = thief;
                    field.second = null;
                    break;
                case field.third:
                    field.third = null;
                    thief.stats.batting.r++;
                    thief.atBats.push(Log.prototype.RUN);
                    this.runScores();
            }
            thief.stats.batting.sb++;
        }
        if (!isNaN(result.caughtStealing)) {
            game.teams[game.half === 'top' ? 'home' : 'away'].positions['catcher'].stats.fielding.PO++;
            this.count.outs++;
            thief = game.batter.team.lineup[result.caughtStealing];
            thief.stats.batting.cs++;
            thief.atBats.push(Log.prototype.CAUGHT_STEALING);
            switch (thief) {
                case field.first:
                    field.first = null;
                    break;
                case field.second:
                    field.second = null;
                    break;
                case field.third:
                    field.third = null;
            }
            if (this.count.outs >= 3) {
                this.says = 'Three outs, change.';
                this.count.outs = this.count.balls = this.count.strikes = 0;
                pitcher.stats.pitching.IP[0]++;
                pitcher.stats.pitching.IP[1] = 0;
                return this.changeSides();
            }
        }

        pitcher.stats.pitching.pitches++;
        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            pitcher.stats.pitching.strikes++;
            if (result.contact) {
                game.passMinutes(1);
                if (result.caught) {
                    batter.stats.batting.pa++;
                    pitcher.stats.pitching.IP[1]++;
                    if (result.sacrificeAdvances.length && this.count.outs < 2) {
                        batter.stats.batting.sac++;
                        game.batter.atBats.push(Log.prototype.SACRIFICE);
                        this.advanceRunners(false, null, result.sacrificeAdvances);
                    } else {
                        batter.stats.batting.ab++;
                        if (result.flyAngle < 15) {
                            game.batter.atBats.push(Log.prototype.LINEOUT);
                        } else {
                            game.batter.atBats.push(Log.prototype.FLYOUT);
                        }
                    }
                    this.count.outs++;
                    fielder.stats.fielding.PO++;
                    this.newBatter();
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.firstOut) {
                            game.field[result.firstOut] = null;
                            result.additionalOuts.map(runner => {
                                if (runner !== 'batter') {
                                    game.field[runner] = null;
                                }
                            });
                            this.count.outs += result.additionalOuts.length;
                        }
                        if (result.fieldersChoice && this.count.outs < 2) {
                            result.bases = 0;
                            this.count.outs++;
                            fielder.stats.fielding.PO++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(Log.prototype.FIELDERS_CHOICE);
                            this.advanceRunners(false, result.fieldersChoice);
                            result.doublePlay && game.batter.atBats.push(Log.prototype.GIDP);
                            this.reachBase();
                            result.outs = this.count.outs;
                            this.newBatter();
                        } else if (result.fieldersChoice) {
                            result.bases = 0;
                            result.thrownOut = true;
                        }
                        if (result.thrownOut) {
                            this.count.outs++;
                            fielder.stats.fielding.PO++;
                            pitcher.stats.pitching.IP[1]++;
                            game.batter.atBats.push(Log.prototype.GROUNDOUT);
                            result.doublePlay && game.batter.atBats.push(Log.prototype.GIDP);
                            if (this.count.outs < 3) {
                                this.advanceRunners(false);
                            }
                            result.outs = this.count.outs;
                            this.newBatter();
                        }
                        if (result.hitByPitch) {
                            batter.stats.batting.ab--;
                        }
                        if (result.bases) {
                            if (!result.error) {
                                game.tally[game.half === 'top' ? 'away' : 'home'][Log.prototype.SINGLE]++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    game.tally[game.half === 'top' ? 'home' : 'away'].E++;
                                    fielder.stats.fielding.E++;
                                }
                            }
                            let bases = result.bases;
                            switch (bases) {
                                case 0 :
                                    game.batter.atBats.push(Log.prototype.GROUNDOUT);
                                    break;
                                case 1 :
                                    if (result.error) {
                                        game.batter.atBats.push(Log.prototype.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.prototype.SINGLE);
                                    batter.stats.batting.h++;
                                    break;
                                case 2 :
                                    if (result.error) {
                                        game.batter.atBats.push(Log.prototype.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.prototype.DOUBLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3 :
                                    if (result.error) {
                                        game.batter.atBats.push(Log.prototype.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.prototype.TRIPLE);
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4 :
                                    if (result.error) {
                                        game.batter.atBats.push(Log.prototype.REACHED_ON_ERROR);
                                        break;
                                    }
                                    game.batter.atBats.push(Log.prototype.HOMERUN);
                                    pitcher.stats.pitching.HR++;
                                    batter.stats.batting.h++;
                                    batter.stats.batting.hr++;
                                    break;
                            }
                            if (bases > 0 && bases < 4 && !result.error) {
                                if (['left', 'right', 'center'].includes(result.fielder)) {
                                    batter.recordInfieldHit();
                                }
                            }
                            if (bases >= 1) {
                                this.advanceRunners();
                                this.reachBase();
                                bases -= 1;
                            }
                            while (bases > 0) {
                                bases -= 1;
                                this.advanceRunners();
                            }
                            this.newBatter();
                        }
                    }
                }
            } else {
                this.count.strikes++;
            }
        }

        this.says = (`${this.count.balls} and ${this.count.strikes}`);

        result.outs = this.count.outs;

        if (this.count.strikes > 2) {
            batter.stats.batting.pa++;
            batter.stats.batting.ab++;
            batter.stats.batting.so++;
            pitcher.stats.pitching.K++;
            this.count.outs++;
            pitcher.stats.pitching.IP[1]++;
            this.count.balls = this.count.strikes = 0;
            this.says = 'Strike three. Batter out.';
            batter.atBats.push(Log.prototype.STRIKEOUT);
            this.newBatter();
        }
        if (this.count.balls > 3) {
            batter.stats.batting.pa++;
            batter.stats.batting.bb++;
            pitcher.stats.pitching.BB++;
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            batter.atBats.push(Log.prototype.WALK);
            this.advanceRunners(true).reachBase().newBatter();
        }
        if (this.count.outs > 2) {
            this.says = 'Three outs, change.';
            this.count.outs = this.count.balls = this.count.strikes = 0;
            pitcher.stats.pitching.IP[0]++;
            pitcher.stats.pitching.IP[1] = 0;
            this.changeSides();
        }
    },
    /**
     * awards first base to the batter
     */
    reachBase() {
        const game = this.game;
        game.field.first = game.batter;
        game.field.first.fatigue += 2;
        return this;
    },
    /**
     * advance the runners (ball in play or walk)
     *
     * @param isWalk {boolean}
     * @param fieldersChoice \results in an out to someone other than the batter
     * @param sacrificeAdvances \advances on a sacrifice
     */
    advanceRunners(isWalk, fieldersChoice, sacrificeAdvances) {
        isWalk = Boolean(isWalk);
        const game = this.game;
        let first = game.field.first;
        let second = game.field.second;
        let third = game.field.third;
        const swing = game.swingResult;

        if (isWalk) {
            if (first) {
                if (second) {
                    if (third) {
                        //bases loaded
                        game.batter.recordRBI();
                        game.batter.stats.batting.rbi++;
                        third.atBats.push(Log.prototype.RUN);
                        third.stats.batting.r++;
                        game.pitcher.stats.pitching.ER++;
                        this.runScores();
                        game.field.third = second;
                        game.field.second = first;
                        first = null;
                    } else {
                        // 1st and second
                        game.field.third = second;
                        game.field.second = first;
                        game.field.first = null;
                    }
                } else {
                    if (third) {
                        // first and third
                        game.field.second = first;
                        game.field.first = null;
                    } else {
                        // first only
                        game.field.second = first;
                        game.field.first = null;
                    }
                }
            } else {
                // no one on first
            }
        } else {
            if (fieldersChoice) {
                game.field[fieldersChoice] = null;
                first = game.field.first;
                second = game.field.second;
                third = game.field.third;
            }
            let canAdvance = (position) => true;
            if (sacrificeAdvances) {
                canAdvance = position => {
                    switch (position) {
                        case 'first':
                            return sacrificeAdvances.includes('first') && (!game.field.second);
                        case 'second':
                            return sacrificeAdvances.includes('second') && (!game.field.third);
                        case 'third':
                            return sacrificeAdvances.includes('third');
                    }
                };
            }
            let arm = 0;
            if (swing.fielder) {
                const fielder = game.pitcher.team.positions[swing.fielder];
                if (['left', 'center', 'right'].includes(fielder.position)) {
                    arm = fielder.skill.defense.throwing;
                } else {
                    arm = fielder.skill.defense.throwing + 120; // very rare extra bases on infield BIP
                }
            }
            if (third && canAdvance('third')) {
                // run scored
                this.runScores();
                if (game.batter != third) {
                    game.batter.recordRBI();
                    third.atBats.push(Log.prototype.RUN);
                }
                game.batter.stats.batting.rbi++;
                third.stats.batting.r++;
                game.pitcher.stats.pitching.ER++;
                game.field.third = null;
            }
            if (second && canAdvance('second')) {
                game.field.third = second;
                game.field.second = null;
                if (second != game.batter && !sacrificeAdvances
                    && Math.random() * (second.skill.offense.speed + 120) > arm + 50) {

                    this.runScores();
                    if (game.batter != second) {
                        game.batter.recordRBI();
                        second.atBats.push(Log.prototype.RUN);
                    }
                    game.field.third = null;

                }
            }
            if (first && canAdvance('first')) {
                game.field.second = first;
                game.field.first = null;
                if (first != game.batter && !game.field.third && !sacrificeAdvances
                    && Math.random() * (first.skill.offense.speed + 120) > arm + 60) {

                    game.field.third = first;
                    game.field.second = null;

                }
            }
        }
        return this;
    },
    /**
     * "run scores!"
     */
    runScores() {
        const game = this.game;
        game.scoreboard[game.half === 'top' ? 'away' : 'home'][game.inning]++;
        game.tally[game.half === 'top' ? 'away' : 'home'].R++;
    },
    /**
     * lets the on deck batter into the batter's box
     */
    newBatter() {
        const game = this.game;
        game.passMinutes(2);
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        this.count.balls = this.count.strikes = 0;
        game.log.notePlateAppearanceResult(game);
        const team = game.half === 'bottom' ? game.teams.home : game.teams.away;
        game.lastBatter = game.batter;
        game.batter = team.lineup[(team.nowBatting + 1)%9];
        game.batter.ready = !game.humanBatting();
        game.deck = team.lineup[(team.nowBatting + 2)%9];
        game.hole = team.lineup[(team.nowBatting + 3)%9];
        team.nowBatting = (team.nowBatting + 1)%9;
        if (this.count.outs < 3) {
            game.log.noteBatter(game.batter);
        }
        //game.showPlayResultPanels(game.lastBatter);
        if (!game.humanPitching()) {
            game.pitcher.team.manager.checkPitcherFatigue();
        }
    },
    /**
     * 3 outs
     */
    changeSides() {
        const game = this.game;
        game.passMinutes(5);
        game.swingResult = {};
        game.swingResult.looking = true; // hide bat
        game.pitchInFlight.x = null; // hide ball
        game.pitchInFlight.y = null; // hide ball
        game.log.pitchRecord = {
            e: [],
            n: []
        };
        let offense, defense;
        game.field.first = null;
        game.field.second = null;
        game.field.third = null;
        if (game.half === 'top') {
            if (game.inning == 9 && game.tally.home.R > game.tally.away.R) {
                return game.end();
            }
            game.half = 'bottom';
        } else {
            if (game.inning + 1 > 9) {
                return game.end();
            }
            game.inning++;
            game.half = 'top';
        }
        offense = game.half === 'top' ? 'away' : 'home';
        defense = game.half === 'top' ? 'home' : 'away';
        const n = `${game.inning}回の${game.half === 'top' ? 'オモテ' : 'ウラ'}、${game.teams[(game.half === 'top' ? 'away' : 'home')].getName()}の攻撃。`, e = `${game.half === 'top' ? 'Top' : 'Bottom'} ${game.inning}`;
        game.log.note(e, n);
        const team = game.teams[offense];
        game.batter = team.lineup[team.nowBatting];
        game.batterRunner = game.batter;
        game.deck = team.lineup[(team.nowBatting + 1)%9];
        game.hole = team.lineup[(team.nowBatting + 2)%9];

        game.pitcher = game.teams[defense].positions.pitcher;
        game.log.noteBatter(game.batter);
        game.autoPitchSelect();
        game.field.defense = team.positions;
        this.onSideChange();
    },
    onSideChange() {}, // will be be bound externally
    says : 'Play ball!',
    game : null
};


// CONCATENATED MODULE: ./Model/Game.js













const Game_$ = typeof window === 'object' ? window.$ : () => {};

/**
 * Apologies for the godclass here.
 * @param m - language mode.
 * @constructor
 */
const Game = function(m) {
    this.gamesIntoSeason = 72;
    this.humanControl = 'home'; //home, away, both, none
    this.debug = [];
    this.pitcher = null; // Player&
    this.batter = null; // Player&
    this.stage = 'pitch'; //pitch, swing
    /**
     * websocket opponent is connected
     */
    this.opponentConnected = false;
    this.batterReadyTimeout = -1;
    /**
     * language sensitive string describing what kind of pitch the batter sees
     */
    this.battersEye = {
        e: '',
        n: ''
    };
    this.startOpponentPitching = null; // late function
    this.pitchTarget = {x : 100, y : 100};
    this.pitchInFlight = {
        x : 100,
        y : 100,
        breakDirection : [0, 0],
        name : 'slider',
        velocity : 50,
        'break' : 50,
        control : 50
    };
    this.swingResult = {
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
    };
    this.playResult = {
        batter: '',
        fielder: ''
    };
    this.field = null;
    this.teams = {
        away : null,
        home : null
    };
    this.log = null;
    this.half = 'top';
    this.inning = 1;
    this.scoreboard = {
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
    };
    this.tally = {
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
    };
    this.init(m);
};

Game.prototype = {
    constructor : Game,
    init(m) {
        this.expectedSwingTiming = 0;
        this.reset();
        this.startTime = {
            h: Math.random() * 6 + 11 | 0,
            m: Math.random() * 60 | 0
        };
        const timeOfDay = this.timeOfDay = {
            h: 0,
            m: 0
        }; // @see {Loop} for time initialization
        if (m) text_text.mode = m;
        this.gamesIntoSeason = 72 + Math.floor(Math.random() * 72);
        this.field = new Model_Field_Field(this);
        this.teams.away = new Team(this);
        this.teams.home = new Team(this);
        this.log = new Log();
        this.log.game = this;
        this.debug = [];
        this.helper = helper;
        while (this.teams.away.name === this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.umpire = new Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        }
        this.autoPitchSelect();
        Animator_Animator.init();
        this.passMinutes(5);
    },
    get console() {
        return Animator_Animator.console;
    },
    set console(value) {
        Animator_Animator.console = value;
    },
    passMinutes(minutes) {
        const time = this.timeOfDay;
        time.m = parseInt(time.m);
        time.m += parseInt(minutes);
        while (time.m >= 60) {
            time.m = parseInt(time.m) - 60;
            time.h = (parseInt(time.h) + 1) % 24;
        }
        if (!Animator_Animator.console) Animator_Animator.loop.setTargetTimeOfDay(time.h, time.m);
    },
    getInning() {
        return text_text.mode === 'n' ? (this.inning + (this.half === 'top' ? 'オモテ' : 'ウラ')) : `${this.half.toUpperCase()} ${this.inning}`;
    },
    /**
     * @returns {boolean} is a human player is batting
     */
    humanBatting() {
        const humanControl = this.humanControl;
        if (humanControl === 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl === 'both' || humanControl === 'away';
            case 'bottom':
                return humanControl === 'both' || humanControl === 'home';
        }
    },
    /**
     * @returns {boolean}
     */
    humanPitching() {
        const humanControl = this.humanControl;
        if (humanControl === 'none') return false;
        switch (this.half) {
            case 'top':
                return humanControl === 'both' || humanControl === 'home';
            case 'bottom':
                return humanControl === 'both' || humanControl === 'away';
        }
    },
    /**
     * ends the game
     */
    end() {
        this.stage = 'end';
        let e, n;
        e = this.tally.home.R > this.tally.away.R ? 'Home team wins!' :
            (this.tally.home.R === this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!');
        n = this.tally.home.R > this.tally.away.R ? `${this.teams.home.getName()}の勝利` :
            (this.tally.home.R === this.tally.away.R ? '引き分け' : `${this.teams.away.getName()}の勝利`);
        if (this.tally.home.R > this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.W++;
            this.teams.away.positions.pitcher.stats.pitching.L++;
        } else if (this.tally.home.R < this.tally.away.R) {
            this.teams.home.positions.pitcher.stats.pitching.L++;
            this.teams.away.positions.pitcher.stats.pitching.W++;
        }
        this.log.note(e, n);
        this.log.note('Reload to play again', 'リロるは次の試合へ');
    },
    /**
     * advances an AI turn (response to the previous action) by pitching or swinging
     * @param callback
     */
    simulateInput(callback) {
        const stage = this.stage, pitchTarget = this.pitchTarget;
        if (stage === 'end') {
            return;
        }
        if (stage === 'pitch') {
            this.autoPitch(callback);
        } else if (stage === 'swing') {
            if (typeof pitchTarget != 'object') {
                this.pitchTarget = {x: 100, y: 100};
            }
            this.autoSwing(this.pitchTarget.x, this.pitchTarget.y, callback);
        }
    },
    /**
     * usually for spectator mode in which the AI plays against itself
     * @param callback
     */
    simulatePitchAndSwing(callback) {
        if (this.stage === 'end') {
            return;
        }
        this.autoPitch(callback);
        const giraffe = this;
        setTimeout(() => {
            if (typeof giraffe.pitchTarget != 'object') {
                giraffe.pitchTarget = {x: 100, y: 100};
            }
            giraffe.autoSwing(giraffe.pitchTarget.x, giraffe.pitchTarget.y, callback => {callback();});
        }, giraffe.field.hasRunnersOn() ? Animator_Animator.TIME_FROM_SET + 2500 : Animator_Animator.TIME_FROM_WINDUP + 2500);
    },
    /**
     * generically receive click input and decide what to do
     * @param x
     * @param y
     * @param callback
     */
    receiveInput(x, y, callback) {
        if (this.humanControl === 'none') {
            return;
        }
        if (this.stage === 'end') {
            return;
        }
        if (this.stage === 'pitch' && this.humanPitching()) {
            this.thePitch(x, y, callback);
        } else if (this.stage === 'swing'  && this.humanBatting()) {
            this.theSwing(x, y, callback);
        }
    },
    /**
     * select a pitch for the AI
     * @todo use an out pitch at 2 strikes?
     * @todo use more fastballs against weak batters?
     */
    autoPitchSelect() {
        const pitchNames = Object.keys(this.pitcher.pitching);
        const pitchName = pitchNames[Math.random() * pitchNames.length | 0];
        const pitch = this.pitcher.pitching[pitchName];
        pitch.name = pitchName;
        this.pitchInFlight = pitch;
    },
    /**
     * delayed pitch
     * @param callback {Function}
     */
    windupThen(callback) {
        const pitcher = this.pitcher;
        pitcher.windingUp = true;

        if (!Animator_Animator.console) {
            Game_$('.baseball').addClass('hide');
            var windup = Game_$('.windup');
            windup.css('width', '100%');
        }
        if (Animator_Animator.console) {
            callback();
            pitcher.windingUp = false;
        } else {
            if (!Animator_Animator.console) {
                Animator_Animator.loop.resetCamera();
            }
            windup.animate({width: 0}, this.field.hasRunnersOn() ? Animator_Animator.TIME_FROM_SET : Animator_Animator.TIME_FROM_WINDUP, () => {
                pitcher.windingUp = false;
                callback();
            });
        }
    },
    /**
     * AI pitcher winds up and throws
     * @param callback \usually a function to resolve the animations resulting from the pitch
     */
    autoPitch(callback) {
        this.autoPitchSelect();

        const count = this.umpire.count;
        let x, y, pitch;
        pitch = Distribution.pitchLocation(count);
        x = pitch.x;
        y = pitch.y;

        this.windupThen(() => {
            !Animator_Animator.console && Game_$('.baseball.pitch').removeClass('hide');
            this.thePitch(x, y, callback);
        });
    },
    /**
     * AI batter decides whether to swing
     *
     * The "deceptive" location is the apparent trajectory. If the batter has good eyes, they will see the
     * actual trajectory instead.
     *
     * Hitting the ball, of course, is another matter.
     *
     * @param deceptiveX \the apparent X target of the pitch
     * @param deceptiveY \the apparent Y target of the pitch
     * @param callback
     */
    autoSwing(deceptiveX, deceptiveY, callback) {
        const giraffe = this;
        const bonus = this.batter.eye.bonus || 0;
        const eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus;
        let convergence;
        let convergenceSum;

        let x = Distribution.centralizedNumber(), y = Distribution.centralizedNumber();

        if (100*Math.random() < eye) { // identified the break
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        }

        if (100*Math.random() < eye) { // identified the location
            convergence = eye/25;
            convergenceSum = 1 + convergence;
        } else {
            convergence = eye/100;
            convergenceSum = 1 + convergence;
        }

        x = (deceptiveX*(convergence) + x)/convergenceSum;
        y = (deceptiveY*(convergence) + y)/convergenceSum;

        this.swingResult.x = Distribution.cpuSwing(x, this.pitchInFlight.x, eye);
        this.swingResult.y = Distribution.cpuSwing(y, this.pitchInFlight.y, eye * 0.75);

        const swingProbability = Distribution.swingLikelihood(eye, x, y, this.umpire);
        if (swingProbability < 100*Math.random()) {
            x = -20;
        }

        callback(() => {
            giraffe.theSwing(x, y);
        });
    },
    /**
     * variable function for what to do when the batter becomes ready for a pitch (overwritten many times)
     */
    onBatterReady() {},
    /**
     * @param setValue
     * @returns {boolean|*}
     * trigger batter readiness passively, or actively with setValue, i.e. ready to see pitch
     */
    batterReady(setValue) {
        clearTimeout(this.batterReadyTimeout);
        if (setValue !== undefined) {
            this.batter.ready = !!setValue;
        }
        if (this.batter.ready) {
            this.onBatterReady();
        }
        return this.batter.ready;
    },
    waitingCallback() {},
    /**
     * signals readiness for the next pitch. This behavior varies depending on whether AI or human is pitching
     * @param callback
     * @param swingResult
     */
    awaitPitch(callback, swingResult) {
        const giraffe = this;
        if (this.opponentConnected) {
            this.waitingCallback = callback;
            this.opponentService.emitSwing(swingResult);
            this.onBatterReady = () => {};
        } else {
            giraffe.onBatterReady = () => {
                giraffe.autoPitch(callback);
            };
            if (Animator_Animator.console) {
                giraffe.batterReady();
            } else {
                this.batterReadyTimeout = setTimeout(() => {
                    giraffe.batterReady();
                }, 5200);
            }
        }
    },
    /**
     * Signals readiness for the batter's response to a pitch in flight.
     * In case of a human pitching to AI, the AI batter is automatically ready.
     * @param x
     * @param y
     * @param callback
     * @param pitchInFlight
     * @param pitchTarget
     */
    awaitSwing(x, y, callback, pitchInFlight, pitchTarget) {
        if (this.opponentConnected) {
            this.waitingCallback = callback;
            this.opponentService.emitPitch({
                inFlight: pitchInFlight,
                target: pitchTarget
            });
        } else {
            this.autoSwing(x, y, callback);
        }
    },
    /**
     * triggers a pitch to aspirational target (x,y) from the current pitcher on the mound.
     * @param x \coordinate X in the strike zone (0, 200)
     * @param y \coordinate Y (0, 200), origin being bottom left.
     * @param callback \typically to resolve animations and move to the next step (batting this pitch)
     * @param override \a websocket opponent will override the engine's pitch location calculations with their actual
     */
    thePitch(x, y, callback, override) {
        if (override) {
            this.pitchInFlight = override.inFlight;
            this.pitchTarget = override.target;
        }

        const pitch = this.pitchInFlight;

        if (this.stage === 'pitch') {
            if (override) {
                callback = this.waitingCallback;
            } else {
                this.pitcher.fatigue++;
                this.pitchTarget.x = x;
                this.pitchTarget.y = y;

                pitch.breakDirection = this.helper.pitchDefinitions[pitch.name].slice(0, 2);
                this.battersEye = text_text.getBattersEye(this);

                const control = Math.floor(pitch.control - this.pitcher.fatigue/2);
                this.pitchTarget.x = Distribution.pitchControl(this.pitchTarget.x, control);
                this.pitchTarget.y = Distribution.pitchControl(this.pitchTarget.y, control);

                if (this.pitcher.throws === 'right') pitch.breakDirection[0] *= -1;

                const breakEffect = Distribution.breakEffect(pitch, this.pitcher, this.pitchTarget.x, this.pitchTarget.y);

                pitch.x = breakEffect.x;
                pitch.y = breakEffect.y;
            }

            this.log.notePitch(pitch, this.batter);

            this.stage = 'swing';
            if (this.humanBatting()) {
                callback();
            } else {
                if (this.opponentConnected && this.humanPitching()) {
                    this.windupThen(() => {});
                }
                this.awaitSwing(x, y, callback, pitch, this.pitchTarget);
            }
        }
    },
    /**
     * makes an aspirational swing to (x,y) by the current player in the batter's box
     * @param x
     * @param y
     * @param callback \resolves animations
     * @param override
     */
    theSwing(x, y, callback, override) {
        const pitch = this.pitchInFlight;
        if (this.stage === 'swing') {
            if (override) {
                var result = this.swingResult = override;
                callback = this.waitingCallback;
            } else {
                this.swingResult = result = {};

                result.timing = this.humanBatting() ? this.expectedSwingTiming - Date.now() : this.batter.getAISwingTiming();
                const inTime = Math.abs(result.timing) < 140;

                const bonus = this.batter.eye.bonus || 0, eye = this.batter.skill.offense.eye + 6*(this.umpire.count.balls + this.umpire.count.strikes) + bonus;

                if (x >= 0 && x <= 200) {
                    this.batter.fatigue++;

                    result.x = x - pitch.x;
                    result.y = y - pitch.y;
                    result.angle = this.setBatAngle();

                    const recalculation = Mathinator.getAngularOffset(result, result.angle);
                    const precision = Distribution.swing(eye);

                    result.x = recalculation.x * precision;
                    result.y = -5 + recalculation.y * precision;

                    //log(recalculation.y, precision);

                    result.looking = false;
                    if (Math.abs(result.x) < 60 && Math.abs(result.y) < 35 && inTime) {
                        result.contact = true;
                        this.field.determineSwingContactResult(result);
                        // log(result.flyAngle, Math.floor(result.x), Math.floor(result.y));
                        this.debug.push(result);
                    } else {
                        result.contact = false;
                    }
                } else {
                    result.strike = pitch.x > 50 && pitch.x < 150
                        && pitch.y > 35 && pitch.y < 165;
                    this.batter.eye.bonus = Math.max(0, eye -
                        Math.sqrt(Math.pow(this.batter.eye.x - pitch.x, 2) + Math.pow(this.batter.eye.y - pitch.y, 2)) * 1.5);
                    result.contact = false;
                    result.looking = true;
                    this.batter.eye.x = pitch.x;
                    this.batter.eye.y = pitch.y;
                }
            }

            // stealing bases
            const field = this.field;
            const team = this.batter.team;
            if ((team.stealAttempt === Team.RUNNER_GO || team.stealAttempt === Team.RUNNERS_DISCRETION) && !this.opponentConnected) {
                const thief = field.getLeadRunner();
                if (thief instanceof Player) {
                    let base;
                    switch (thief) {
                        case field.first:
                            base = 2;
                            break;
                        case field.second:
                            base = 3;
                            break;
                        case field.third:
                            base = 4;
                    }
                    let validToSteal = true;
                    if (result.looking) {
                        const count = this.umpire.count;
                        if (count.strikes >= 2 && result.strike && count.outs >= 2) validToSteal = false;
                        if (count.balls >= 3 && !result.strike && field.first) validToSteal = false;
                    }
                    if (result.foul || result.caught) {
                        validToSteal = false;
                    }
                    const discretion = team.stealAttempt === 'go' || Distribution.willSteal(pitch, this.pitcher.team.positions.catcher, thief, base);
                    if (discretion && validToSteal) {
                        thief.attemptSteal(this, base);
                    }
                    team.stealAttempt = Team.RUNNERS_DISCRETION;
                }
            }

            this.log.noteSwing(result);
            this.stage = 'pitch';

            const half = this.half;
            this.umpire.makeCall();
            let lastPlayOfHalfInning = false;
            if (half !== this.half) {
                callback = this.startOpponentPitching;
                lastPlayOfHalfInning = !override;
            }

            if (typeof callback === 'function') {
                if (this.humanPitching()) {
                    callback();
                    if (lastPlayOfHalfInning) {
                        if (this.opponentService && this.opponentConnected) {
                            this.opponentService.emitSwing(result);
                        }
                    }
                } else {
                    this.awaitPitch(callback, result);
                }
            }
        }
    },
    /**
     * for CSS
     * @param x
     * @param y
     * @returns {*|number}
     */
    setBatAngle(x, y) {
        const giraffe = this, pitchInFlight = this.pitchInFlight, swingResult = this.swingResult;
        const origin = {
            x: giraffe.batter.bats === 'right' ? -10 : 210,
            y: 199
        };
        const swing = {
            x: x ? x : pitchInFlight.x + swingResult.x,
            y: y ? y : pitchInFlight.y + swingResult.y
        };
        return Mathinator.battingAngle(origin, swing);
    },
    debugOut() {
        log('slugging', this.debug.filter(a => a.bases == 1).length,
            this.debug.filter(a => a.bases == 2).length,
            this.debug.filter(a => a.bases == 3).length,
            this.debug.filter(a => a.bases == 4).length
        );
        log('grounders', this.debug.filter(a => !a.caught && !a.foul && a.flyAngle < 0).length,
            'thrown out', this.debug.filter(a => !a.caught && !a.foul && a.flyAngle < 0 && a.thrownOut).length);
        log('flies/liners', this.debug.filter(a => !a.foul && a.flyAngle > 0).length,
            'caught', this.debug.filter(a => a.caught && a.flyAngle > 0).length);

        const PO = {};
        this.debug.map(a => {
            if (!a.fielder) return;
            if (!PO[a.fielder]) {
                PO[a.fielder] = 0;
            }
            if (!a.bases && a.fielder) {
                PO[a.fielder]++;
            }
        });
        log('fielding outs', JSON.stringify(PO));

        const hitters = this.teams.away.lineup.concat(this.teams.home.lineup);
        let atBats = [];
        hitters.map(a => {
            atBats = atBats.concat(a.getAtBats().map(ab => ab.text));
        });

        const LO = atBats.filter(ab => ab === 'LO').length;
        const FO = atBats.filter(ab => ab === 'FO').length;
        const GO = atBats.filter(ab => ab === 'GO').length;
        const GIDP = atBats.filter(ab => ab === '(IDP)').length;
        const SO = atBats.filter(ab => ab === 'SO').length;
        const BB = atBats.filter(ab => ab === 'BB').length;
        const SAC = atBats.filter(ab => ab === 'SAC').length;
        const FC = atBats.filter(ab => ab === 'FC').length;
        const CS = atBats.filter(ab => ab === 'CS').length;
        const SB = atBats.filter(ab => ab === 'SB').length;

        log('line outs', LO, 'fly outs', FO, 'groundouts', GO, 'strikeouts', SO, 'sacrifices', SAC,
            'FC', FC, 'gidp', GIDP, 'CS', CS, 'total', LO+FO+GO+SO+SAC+FC+GIDP+CS);

        log('BB', BB, 'SB', SB);
        log('fouls', this.debug.filter(a => a.foul).length);
        log('fatigue, home vs away');
        const teams = this.teams;
        const fatigue = {home: {}, away: {}};
        Iterator.each(this.teams.home.positions, key => {
            const position = key;
            fatigue.home[position] = teams.home.positions[position].fatigue;
            fatigue.away[position] = teams.away.positions[position].fatigue;
        });
        console.table(fatigue);
        console.table(this.scoreboard);
        console.table(this.tally);
    },
    /**
     * for websocket serialization
     */
    toData() {
        const data = {};
        data.half = this.half;
        data.inning = this.inning;
        data.tally = this.tally;
        const giraffe = this;
        const players = this.teams.away.lineup.concat(this.teams.home.lineup);
        // note: bench not included
        data.field = {
            first: players.indexOf(this.field.first),
            second: players.indexOf(this.field.second),
            third: players.indexOf(this.field.third)
        };
        data.batter = players.indexOf(this.batter);
        data.deck = players.indexOf(this.deck);
        data.hole = players.indexOf(this.hole);
        data.teams = {
            home: {
                name: giraffe.teams.home.name,
                nameJ: giraffe.teams.home.nameJ
            },
            away: {
                name: giraffe.teams.away.name,
                nameJ: giraffe.teams.away.nameJ
            }
        };
        data.umpire = {
            says : giraffe.umpire.says,
            count: {
                strikes : giraffe.umpire.count.strikes,
                balls: giraffe.umpire.count.balls,
                outs: giraffe.umpire.count.outs
            }
        };
        // data.players = players.map(player => player.toData());
        data.log = {
            pitchRecord : giraffe.log.pitchRecord,
            record : giraffe.log.record
        };
        data.gamesIntoSeason = this.gamesIntoSeason;
        return data;
    },
    fromData(data) {
        this.half = data.half;
        this.inning = data.inning;
        this.tally = data.tally;
        // const giraffe = this;
        const players = data.players || this.teams.away.lineup.concat(this.teams.home.lineup);
        //     .map((playerJson, index) => {
        //     const playerData = (playerJson);
        //     if (index > 8) {
        //         var side = 'home';
        //         index = index - 9;
        //     } else {
        //         side = 'away';
        //     }
        //     const player = giraffe.teams[side].positions[playerData.position];
        //     player.fromData(playerData);
        //     giraffe.teams[side].lineup[index] = player;
        //     player.resetStats(data.gamesIntoSeason);
        //     return player;
        // });
        this.field.first = players[data.field.first];
        this.field.second = players[data.field.second];
        this.field.third = players[data.field.third];
        this.batter = players[data.batter];
        this.deck = players[data.deck];
        this.hole = players[data.hole];
        this.umpire.says = data.umpire.says;
        this.umpire.count = data.umpire.count;
        this.teams.away.name = data.teams.away.name;
        this.teams.away.nameJ = data.teams.away.nameJ;
        this.teams.home.name = data.teams.home.name;
        this.teams.home.nameJ = data.teams.home.nameJ;
        this.log.pitchRecord = data.log.pitchRecord;
        this.log.record = data.log.record;
        this.log.stabilizeShortRecord();
        this.gamesIntoSeason = data.gamesIntoSeason;
        if (this.humanPitching()) {
            this.autoPitchSelect();
        }
        return this;
    },
    pitchSelect() {

    },
    reset() {
        this.scoreboard =  {
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
        };
        this.resetTally();
    },
    resetTally() {
        this.tally = {
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
        };
    },

    /* user-interaction implementations */

    /**
     * Assign specialist opponent.
     */
    teamJapan() {
        const provider = new Baseball.teams.Provider;
        provider.assignTeam(this, 'TeamJapan', 'away');
        const game = this;
        if (game.half === 'top') {
            game.batter = game.teams.away.lineup[game.batter.order];
            game.deck = game.teams.away.lineup[(game.batter.order + 1) % 9];
            game.hole = game.teams.away.lineup[(game.batter.order + 2) % 9];
        } else {
            game.pitcher = game.teams.away.positions.pitcher;
        }
    },

    /**
     * @param {Player} player
     */
    selectSubstitute(player) {
        const game = this;
        if (game.humanControl === 'home' && player.team !== game.teams.home) return;
        if (game.humanControl === 'away' && player.team !== game.teams.away) return;
        player.team.sub = (player.team.sub === player ? player.team.noSubstituteSelected : player);
    },

    /**
     * User selects a pitch.
     * @param {string} pitchName
     */
    selectPitch (pitchName) {
        const game = this;
        if (game.stage === 'pitch') {
            game.pitchInFlight = Game_$.extend({}, game.pitcher.pitching[pitchName]);
            game.pitchInFlight.name = pitchName;
            game.swingResult.looking = true;
        }
    },

    /**
     * Used for substitutions or player info expansion.
     * @param player
     * @returns {*|boolean}
     */
    clickLineup (player) {
        if (player.team.sub !== player.team.noSubstituteSelected) {
            const sub = player.team.sub;
            player.team.sub = null;
            if (sub) {
                return sub.substitute(player);
            }
            return;
        }
        player.team.expanded = (player.team.expanded === player ? null : player);
    },

    /**
     * Generate a new opponent team (mid-game).
     * @param heroRate
     */
    generateTeam(heroRate) {
        this.teams.away = new Baseball.model.Team(this, heroRate);
    },

    /**
     * Bound externally using the UI + Animator service.
     */
    updateFlightPath: () => {},

    /**
     * @param {Class} SocketService
     * @param {boolean|number} quickMode - 7 for playing from the 7th inning.
     * @param {boolean|number} spectateCpu
     */
    proceedToGame(SocketService, quickMode, spectateCpu) {
        const game = this;
        game.humanControl = spectateCpu ? 'none' : 'home';
        game.console = !!quickMode && quickMode !== 7;
        const field = window.location.hash ? window.location.hash.slice(1) : game.teams.home.name + Math.ceil(Math.random() * 47);
        if (typeof window.SockJS !== 'undefined') {
            var socketService = new SocketService(game);
            socketService.start(field);
        } else {
            console.log('no socket client');
        }
        window.location.hash = '#' + field;
        Game_$('.blocking').remove();
        Game_$('.play-begins').show();
        if (game.humanControl === 'none' && game.console) {
            let n = 0;
            Animator_Animator.console = true;
            game.console = true;
            do {
                n++;
                game.simulateInput(function (callback) {
                    typeof callback === 'function' && callback();
                });
            } while (game.stage !== 'end' && n < 500);
            Animator_Animator.console = game.console = false;
            log('sim ended');
            game.debugOut();
        } else if (quickMode === 7 && spectateCpu === 1) {
            Animator_Animator.console = game.console = true;
            do {
                game.simulateInput(function (callback) {
                    typeof callback === 'function' && callback();
                });
            } while (game.inning < 7);
            log('sim halted in 7th');
            game.debugOut();
            Animator_Animator.console = game.console = false;
            game.stage = 'pitch';
            game.half = 'top';
            game.humanControl = 'home';
            game.umpire.onSideChange();
        } else if (game.humanControl === 'none') {
            const scalar = game.console ? 0.05 : 1;
            const auto = setInterval(function () {
                if (game.stage === 'end') {
                    clearInterval(auto);
                }
                game.simulatePitchAndSwing(function (callback) {
                    game.updateFlightPath(callback);
                });
            }, scalar * (game.field.hasRunnersOn() ? Animator_Animator.TIME_FROM_SET + 2000 : Animator_Animator.TIME_FROM_WINDUP + 2000));
        }
        if (game.humanControl === 'away') {
            game.simulateInput(function (callback) {
                game.updateFlightPath(callback);
            });
        }
        if (game.humanControl === 'home') {
            game.showMessage = true;
        }
        if (!quickMode || quickMode === 7) {
            Animator_Animator.loop.setTargetTimeOfDay(game.startTime.h, game.startTime.m);
            game.timeOfDay.h = game.startTime.h;
            game.timeOfDay.m = game.startTime.m;
        }
    },

    /**
     * Proceed to the end of the current at bat.
     */
    simulateAtBat() {
        const game = this;
        Animator_Animator.console = game.console = true;
        const batter = game.batter;
        const control = game.humanControl;
        game.humanControl = 'none';
        do {
            game.simulateInput(function (callback) {
                typeof callback === 'function' && callback();
            });
        } while (game.batter === batter && this.stage !== 'end');
        log('-- At Bat Simulated --');
        if (this.stage === 'end') {
            return;
        }
        if (game.humanControl === 'none') {
            game.humanControl = control;
        }
        game.stage = 'pitch';
        Animator_Animator.console = game.console = false;
        game.umpire.onSideChange(); // rebind hover UI, not actual change sides :\...
    },

    /**
     * @returns {boolean}
     */
    allowSimAtBat() {
        if (this.opponentConnected) return false;
        return true;
    }

};


// CONCATENATED MODULE: ./Teams/Trainer.js


class Trainer_Trainer {
    makePlayer(player, name, surname, surnameJ, nameJ, pitching, offense, defense, bats, throws, number) {
        player.hero = true;

        if (false) {
            surnameJ = '代表';
            nameJ =  '選手';
            name = 'TEAM';
            surname = 'JPN';
        }

        player.name = `${surname} ${name}`;
        player.nameJ = surnameJ + nameJ;
        player.surname = surname;
        player.surnameJ = surnameJ;

        player.spaceName(surnameJ, nameJ);
        player.randomizeSkills(true, true);
        player.skill.offense = offense;
        player.skill.defense = defense;
        player.skill.pitching = pitching;
        player.bats = bats;
        player.throws = throws;
        player.number = number;
        Iterator.each(player.pitching, (key, value) => {
            player.pitching[key].velocity += pitching/5 | 0;
            player.pitching[key].break += pitching/5 | 0;
            player.pitching[key].control += pitching/5 | 0;
        });
        player.resetStats(0);
    }
}


// CONCATENATED MODULE: ./Teams/TeamJapan.js





const samurai = new Team('no init');
samurai.name = 'Japan';
samurai.nameJ = '日本';

const darvish = new Player(samurai), johjima = new Player(samurai), ogasawara = new Player(samurai), nishioka = new Player(samurai), kawasaki = new Player(samurai), murata = new Player(samurai), matsui = new Player(samurai), ichiro = new Player(samurai), inaba = new Player(samurai);

const matsuzaka = new Player(samurai), fukudome = new Player(samurai), aoki = new Player(samurai), abe = new Player(samurai), iwamura = new Player(samurai);

const coach = new Trainer_Trainer();

coach.makePlayer(darvish, 'Yu', 'Darvish', 'ダルビッシュ', '有', 150, {eye: 80, power: 80, speed: 80},
    {catching: 50, fielding: 70, throwing: 100, speed: 80}, 'right', 'right', 11);

coach.makePlayer(johjima, 'Kenji', 'Johjima', '城島', '健司', 60, {eye: 90, power: 108, speed: 70},
    {catching: 140, fielding: 88, throwing: 75, speed: 75}, 'right', 'right', 2);



coach.makePlayer(ogasawara, 'Michihiro', 'Ogasawara', '小笠原', '道大', 80, {eye: 96, power: 90, speed: 90},
    {catching: 50, fielding: 96, throwing: 85, speed: 70}, 'left', 'right', 36);

coach.makePlayer(nishioka, 'Tsuyoshi', 'Nishioka', '西岡', '剛', 80, {eye: 95, power: 75, speed: 92},
    {catching: 90, fielding: 88, throwing: 88, speed: 90}, 'right', 'right', 7);

coach.makePlayer(kawasaki, 'Munenori', 'Kawasaki', '川崎', '宗則', 80, {eye: 95, power: 75, speed: 95},
    {catching: 90, fielding: 120, throwing: 99, speed: 100}, 'left', 'right', 52);

coach.makePlayer(murata, 'Shuichi', 'Murata', '村田', '修一', 80, {eye: 82, power: 110, speed: 70},
    {catching: 80, fielding: 80, throwing: 90, speed: 60}, 'right', 'right', 25);



coach.makePlayer(matsui, 'Hideki', 'Matsui', '松井', '秀樹', 75, {eye: 104, power: 120, speed: 50},
    {catching: 40, fielding: 85, throwing: 70, speed: 60}, 'left', 'right', 55);

coach.makePlayer(ichiro, '', 'Ichiro', 'イチロー', '', 89, {eye: 115, power: 80, speed: 115},
    {catching: 80, fielding: 115, throwing: 115, speed: 115}, 'left', 'right', 51);

coach.makePlayer(inaba, 'Atsunori', 'Inaba', '稲葉', '篤紀', 80, {eye: 92, power: 95, speed: 75},
    {catching: 50, fielding: 95, throwing: 95, speed: 75}, 'right', 'right', 41);


samurai.bench = [
    darvish, johjima, ogasawara, nishioka, kawasaki, murata, matsui, ichiro, inaba];
    //matsuzaka, fukudome, aoki, abe, iwamura];
samurai.manager.makeLineup();
samurai.positions = {
    pitcher: darvish,
    catcher: johjima,

    first: ogasawara,
    second: nishioka,
    short: kawasaki,
    third: murata,

    left: matsui,
    center: ichiro,
    right: inaba
};

for (const position in samurai.positions) { if (samurai.positions.hasOwnProperty(position)) {
    samurai.positions[position].position = position;
}}

samurai.lineup = [
    ichiro, kawasaki, inaba, matsui, ogasawara, johjima, murata, nishioka, darvish
];

samurai.lineup.map((player, order) => {
    player.order = order;
});


// CONCATENATED MODULE: ./Teams/Provider.js


class Provider {
    assignTeam(game, team, side) {
        const special = this.teams[team];
        special.game = game;
        game.teams[side] = special;
    }
}

Provider.prototype.teams = {
    TeamJapan: samurai
};


// CONCATENATED MODULE: ./namespace.js
const namespace_Baseball = {};



















namespace_Baseball.model = {};
namespace_Baseball.model.Game = namespace_Baseball.Game = Game;
namespace_Baseball.model.Player = namespace_Baseball.Player = Player;
namespace_Baseball.model.Team = namespace_Baseball.Team = Team;

namespace_Baseball.service = {};
namespace_Baseball.service.Animator = Animator_Animator;
namespace_Baseball.service.Distribution = Distribution;
namespace_Baseball.service.Iterator = Iterator;
namespace_Baseball.service.Mathinator = Mathinator;

namespace_Baseball.util = {};
namespace_Baseball.util.text = text_text;
namespace_Baseball.util.Log = Log;
namespace_Baseball.util.text.abbreviatePosition = abbreviatePosition;

namespace_Baseball.teams = {};
namespace_Baseball.teams.Provider = Provider;
namespace_Baseball.teams.Japan = samurai;

/* harmony default export */ var namespace = (namespace_Baseball);







// CONCATENATED MODULE: ./baseball.js


if (typeof window === 'object') {
    window.Baseball = namespace_Baseball;
}

/* harmony default export */ var baseball = __webpack_exports__["default"] = (namespace_Baseball);


/***/ })
/******/ ])));