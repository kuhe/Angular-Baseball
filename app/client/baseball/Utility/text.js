const text = (phrase, override) => {
    if (!text.mode) text.mode = 'e';
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
    }[override ? override : text.mode][phrase];
    return string ? string : phrase;
};

text.substitution = (sub, player, mode) => {
    const originalMode = text.mode;
    mode = mode || text.mode;
    const order = {
        0 : text(' 1st', mode),
        1 : text(' 2nd', mode),
        2 : text(' 3rd', mode),
        3 : text(' 4th', mode),
        4 : text(' 5th', mode),
        5 : text(' 6th', mode),
        6 : text(' 7th', mode),
        7 : text(' 8th', mode),
        8 : text(' 9th', mode)
    }[player.order];
    const position = text.fielderShortName(player.position, mode);

    if (mode === 'n') {
        text.mode = 'n';
        var output = `${sub.getName() + text.comma() + player.getName()}の交代${text.comma()}${order}(${position})`;
    } else {
        text.mode = 'e';
        output = `${sub.getName()} replaces ${player.getName()} at ${position}, batting${order}`;
    }
    text.mode = originalMode;
    return output;
};

text.getBattersEye = game => {
    const eye = {}, breaking = Math.abs(game.pitchInFlight.breakDirection[0]) + Math.abs(game.pitchInFlight.breakDirection[1]) > 40;
    eye.e =
        text('looks like: ', 'e')+
        breaking ? text('breaking ball', 'e') : text('fastball', 'e');
    eye.n =
        text('looks like: ', 'n')+
        breaking ? text('breaking ball', 'n') : text('fastball', 'n');
    return eye;
};

text.baseShortName = base => {
    if (text.mode == 'n') {
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

text.fielderShortName = (fielder, override) => {
    const mode = override || text.mode;
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

text.slash = () => {
    if (text.mode == 'n') {
        return '・';
    }
    return '/';
};

text.fielderLongName = fielder => {
    if (text.mode == 'n') {
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

text.comma = () => ({n: '、', e: ', '})[text.mode];
text.space = () => ({n: '', e: ' '})[text.mode];
text.stop = () => ({n: '。', e: '. '})[text.mode];

text.namePitch = pitch => {
    if (text.mode == 'e') {
        return pitch.name.charAt(0).toUpperCase() + pitch.name.slice(1)
    }
    if (text.mode == 'n') {
        return text(pitch.name)
    }
};

text.contactResult = (batter, fielder, bases, outBy, sacrificeAdvances, out) => {
    let statement = '';
    const infield = ['left', 'center', 'right'].indexOf(fielder) < 0;
    const doublePlay = out.doublePlay;
    if (text.mode == 'e') {
        statement += batter;
        if (outBy) {
            switch (outBy) {
                case 'fieldersChoice':
                    play = out.length === 2 ? 'double play ' : '';
                    statement += ` reached on a <span class="txt-red">fielder's choice</span> ${play}by ${text.fielderShortName(fielder)}`;
                    break;
                case 'line':
                    statement += ` <span class="txt-red">lined out</span> to ${text.fielderShortName(fielder)}`;
                    break;
                case 'fly':
                    statement += ` <span class="txt-red">flew out</span> to ${text.fielderShortName(fielder)}`;
                    break;
                case 'error':
                    statement += ` <span class="txt-blue">reached on error</span> by ${text.fielderShortName(fielder)}`;
                    break;
                case 'pop':
                    statement += ` <span class="txt-red">popped out</span> to ${text.fielderShortName(fielder)}`;
                    break;
                case 'ground':
                    var play = doublePlay ? 'into a double play by' : 'out to';
                    statement += ` <span class="txt-red">grounded ${play}</span> ${text.fielderShortName(fielder)}`;
                    break;
                case 'thrown':
                    play = doublePlay ? ' on a double play' : '';
                    statement += ` was <span class="txt-red">thrown out</span> by ${text.fielderShortName(fielder)}${play}`;
                    break;
            }
            if (out.length) {
                const plural = out.length > 1;
                const runner = plural ? 'Runners' : 'Runner';
                const is = plural ? 'are' : 'is';
                statement += `. ${runner} from ${text(out.join(text.comma()))} ${is} <span class="txt-red">out</span>`;
            }
        } else {
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += ` reached on an <span class="txt-blue">infield hit</span> to ${text.fielderShortName(fielder)}`;
                    } else {
                        statement += ` reached on a <span class="txt-blue">single</span> to ${text.fielderShortName(fielder)}`;
                    }
                    break;
                case 2:
                    statement += ` <span class="txt-blue">doubled</span> past ${text.fielderShortName(fielder)}`;
                    break;
                case 3:
                    statement += ` <span class="txt-blue">tripled</span> past ${text.fielderShortName(fielder)}`;
                    break;
                case 4:
                    statement += ` <span class="txt-blue">homered</span> to ${text.fielderShortName(fielder)}`;
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(base => {
                if (base == 'third') {
                    statement += `${text.stop()}Runner on third <span class="txt-blue">scores</span>`;
                } else {
                    statement += `${text.stop()}Runner on ${base} <span class="txt-green">advances</span>`;
                }
            });
        }
        statement += text.stop();
    }
    if (text.mode == 'n') {
        const stop = text.stop();
        statement += `${batter}は`;
        if (outBy) {
            const fielderLong = text.fielderLongName(fielder);
            fielder = text.fielderShortName(fielder);
            switch (outBy) {
                case 'fieldersChoice':
                    statement += `野選(${fielder})で<span class="txt-red">出塁</span>`;
                    break;
                case 'line':
                    statement += `<span class="txt-red">${fielder}直</span>`;
                    break;
                case 'fly':
                    statement += `<span class="txt-red">${fielder}飛</span>`;
                    break;
                case 'error':
                    statement += `<span class="txt-blue">エラー(${fielder})で出塁</span>`;
                    break;
                case 'pop':
                    statement += `<span class="txt-red">ポップフライで${fielder}飛</span>`;
                    break;
                case 'ground':
                    statement += `<span class="txt-red">${fielderLong}ゴロに封殺</span>`;
                    break;
                case 'thrown':
                    statement += `<span class="txt-red">${fielder}ゴロ</span>`;
                    break;
            }
            if (out.length) {
                statement += `。${out.map(runner => text(runner)).join(text.comma())}ランナーは<span class="txt-red">アウト</span>`;
            }
            if (doublePlay) {
                statement += '。<span class="txt-red">ゲッツー</span>';
            }
        } else {
            fielder = text.fielderShortName(fielder);
            switch (bases) {
                case 1:
                    if (infield) {
                        statement += `<span class="txt-blue">内野安打</span>(${fielder})で出塁`;
                    } else {
                        statement += `<span class="txt-blue">安打</span>(${fielder})で出塁`;
                    }
                    break;
                case 2:
                    statement += `<span class="txt-blue">二塁打</span>（${fielder}）で出塁`;
                    break;
                case 3:
                    statement += `<span class="txt-blue">三塁打</span>（${fielder}）で出塁`;
                    break;
                case 4:
                    statement += `<span class="txt-blue">本塁打</span>（${fielder}）`;
                    break;
            }
        }
        if (sacrificeAdvances) {
            sacrificeAdvances.map(base => {
                if (base === 'third') {
                    statement += `${stop}サードランナー<span class="txt-blue">ホームイン</span>`;
                } else {
                    statement += `${stop + text(base)}ランナー<span class="txt-green">進塁</span>`;
                }
            });
        }
        statement += stop;
    }
    return statement;
};

export { text }

export const abbreviatePosition = function (position) {
    if (text.mode === 'e') {
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
    return text.fielderShortName(position);
};
