var mode = 'n';

text = function(phrase) {
    if (!mode) mode = 'n';
    var string = {
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
            'Now batting' : '次のバッタ、',
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
            '4-seam': 'ストレイト',
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
            'At Bat :': 'バッタ',
            'On Deck :': '次バッタ',
            'Eye :': '目',
            'Power :': '力',
            'Speed :': '速',
            'Up to Bat': '打席',
            'Fielding': '守備',
            'BA' : '打率',
            'OBP' : '出塁',
            'OPS' : '出長',
            'PA' : '打席',
            'H/2B/3B/HR' : '安／二／三／本',
            'H' : '安',
            '2B' : '二',
            '3B' : '三',
            'HR' : '本塁打',
            'RBI' : '打点',
            'R' : '得点',
            'BB' : '四球',
            'SO' : '三振',

            'Select Language:' : '言語',
            'Run Fast Simulation' : 'シミュレーションを行う',
            'Play Ball!' : 'プレーボール',
            'Spectate the CPU': 'CPU観戦',

            'LHP' : '左投',
            'RHP' : '右投',
            'LHB' : '左打',
            'RHB' : '右打',
            'L' : '左',
            'R ' : '右',
            '#' : '背番号'
        },
        e : {
            empty: '-',
            'Season': 'Career'
        }
    }[mode][phrase];
    return string ? string : phrase;
};

text.fielderShortName = function(fielder) {
    if (mode == 'n') {
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

text.slash = function() {
    if (mode == 'n') {
        return '・';
    }
    return '/';
};

text.fielderLongName = function(fielder) {
    if (mode == 'n') {
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
        first : text('first baseman'),
        second : text('second baseman'),
        third : text('third baseman'),
        short : text('shortstop'),
        pitcher : text('pitcher'),
        catcher : text('catcher'),
        left : text('left fielder'),
        center : text('center fielder'),
        right : text('right fielder')
    }[fielder];
};

text.comma = function() {
    return {n: '、', e: ', '}[mode];
};
text.stop = function() {
    return {n: '。', e: '. '}[mode];
};

text.namePitch = function(pitch) {
    if (mode == 'e') {
        return pitch.name.charAt(0).toUpperCase() + pitch.name.slice(1)
    }
    if (mode == 'n') {
        return text(pitch.name)
    }
};

text.contactResult = function(batter, fielder, bases, outBy) {
    var statement = '';
    var infield = ['left', 'center', 'right'].indexOf(fielder) < 0;
    if (mode == 'e') {
        statement += batter;
        if (outBy) {
            switch (outBy) {
                case 'error':
                    statement += ' reached on error by ' + text.fielderShortName(fielder);
                    break;
                case 'pop':
                    statement += ' popped out to ' + text.fielderShortName(fielder);
                    break;
                case 'fly':
                    statement += ' flew out to ' + text.fielderShortName(fielder);
                    break;
                case 'ground':
                    statement += ' grounded out to ' + text.fielderShortName(fielder);
                    break;
                case 'thrown':
                    statement += ' was thrown out by ' + text.fielderShortName(fielder);
                    break;
            }
        } else {
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += ' reached on an infield hit to ' + text.fielderShortName(fielder);
                    } else {
                        statement += ' reached on a single to ' + text.fielderShortName(fielder);
                    }
                    break;
                case 2:
                    statement += ' doubled past ' + text.fielderShortName(fielder);
                    break;
                case 3:
                    statement += ' tripled past ' + text.fielderShortName(fielder);
                    break;
                case 4:
                    statement += ' homered to ' + text.fielderShortName(fielder);
                    break;
            }
        }
        statement += text.stop();
    }
    if (mode == 'n') {
        statement += batter + 'は';
        if (outBy) {
            fielder = text.fielderShortName(fielder);
            switch (outBy) {
                case 'error':
                    statement += 'エラー('+fielder+')で出塁';
                    break;
                case 'pop':
                    statement += 'ポップフライで' + fielder + '飛';
                    break;
                case 'fly':
                    statement += fielder + '飛';
                    break;
                case 'ground':
                    statement += fielder + 'ゴロ';
                    break;
                case 'thrown':
                    statement += fielder + 'ゴロ';
                    break;
            }
        } else {
            fielder = text.fielderLongName(fielder);
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += '内野安打' + '('+fielder+')'+ 'で出塁';
                    } else {
                        statement += '安打('+fielder+')' + 'で出塁';
                    }
                    break;
                case 2:
                    statement += '二塁打（'+fielder+'）で出塁';
                    break;
                case 3:
                    statement += '三塁打（'+fielder+'）で出塁';
                    break;
                case 4:
                    statement += '本塁打（'+fielder+'）';
                    break;
            }
        }
        statement += text.stop();
    }
    return statement;
};