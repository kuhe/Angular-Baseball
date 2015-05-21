var mode = 'n';

text = function(phrase) {
    if (!mode) mode = 'n';
    var string = {
        n : {
            empty: '-',
            ' 1st' : '一番',
            ' 2nd' : '二番',
            ' 3rd' : '三番',
            ' 4th' : '四番',
            ' 5th' : '五番',
            ' 6th' : '六番',
            ' 7th' : '七番',
            ' 8th' : '八番',
            ' 9th' : '九番',
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
            ' struck out looking.': '、見送り三振。',
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
            'Fielding': '守備'
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
data = {
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
        'Justice',
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
helper = {
    pitchDefinitions : {
        '4-seam' :      [0, 0, 1], //x movement, y movement, speed ratio
        '2-seam' :      [20, -20, 0.90],
        'cutter' :      [-25, -20, 0.95],
        'sinker' :      [-15, -30, 0.95],

        'slider' :      [-50, -35, 0.9],
        'fork'   :      [0, -70, 0.87],
        'curve'  :      [0, -90, 0.82],

        'change' :    [0, -10, 0.88]
    },
    selectRandomPitch : function() {
        return [
            '4-seam', '2-seam', 'cutter', 'sinker',
            'slider', 'fork', 'curve',
            'change'
        ][Math.floor(Math.random()*8)]
    }
};

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
var Field = function(game) {
    this.init(game);
};

Field.prototype = {
    constructor : Field,
    init : function(game) {
        this.game = game;
        this.first = null;
        this.second = null;
        this.third = null;
    },
    hasRunnersOn : function() {
        return this.first instanceof Player || this.second instanceof Player || this.third instanceof Player;
    },
    translateSwingResultToStylePosition: function(swingResult) {
        // CF HR bottom: 95px, centerline: left: 190px;
        var bottom = 0, left = 190;

        bottom = Math.cos(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300;
        left = Math.sin(swingResult.splay / 180 * Math.PI) * swingResult.travelDistance * 95/300 + 190;

        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 280), 100);

        swingResult.bottom = bottom + 'px';
        swingResult.left = left + 'px';
        return swingResult;
    },
    determineSwingContactResult : function(swing) {
        if (typeof swing == 'undefined') swing = this;
        var x = swing.x, y = swing.y;
        var splayAngle = 90 - 1.5*x;
        var flyAngle = -3*y;
        var power = this.game.batter.skill.offense.power;
        var landingDistance = (50 + Math.random()*300 + (power/100)*75) * (1 - Math.abs(flyAngle - 30)/60);

        if (Math.abs(90 - splayAngle) > 50) swing.foul = true;

        swing.fielder = this.findFielder(splayAngle, landingDistance);
        swing.travelDistance = landingDistance;
        swing.flyAngle = flyAngle;
        swing.splay = splayAngle - 90;
        swing.foul = false;

        if (swing.fielder) {
            var fielder = (this.game.half == top ? this.game.teams.home.positions[swing.fielder] : this.game.teams.away.positions[swing.fielder]);
            swing.error = false;
            var fieldingEase = fielder.skill.defense.fielding/100;
            //reach the batted ball?
            swing.fielderTravel = this.getPolarDistance(this.positions[swing.fielder], [splayAngle, landingDistance]);
            var interceptRating = fielder.skill.defense.speed + flyAngle - swing.fielderTravel*1.65;
            if (interceptRating > 0 && flyAngle > -10) {
                //caught cleanly?
                if ((100-fielder.skill.defense.fielding)*0.25 + 0.02 > Math.random()) { //error
                    fieldingEase *= 0.5;
                    swing.error = true;
                    swing.caught = false;
                } else {
                    swing.caught = true;
                }
            } else {
                swing.caught = false;
            }
            if (!swing.caught) {
                if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] != 1 && (interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase
                       -this.game.batter.skill.offense.speed > -75) {
                    swing.thrownOut = true;
                    swing.error = false;
                } else {
                    swing.thrownOut = false;
                    swing.bases = 1;
                    if ({'left' : 1, 'center' : 1, 'right' : 1}[swing.fielder] == 1) {
                        var fieldingReturnDelay = -1*((interceptRating/(1 + fielder.skill.defense.throwing/100))/fieldingEase - this.game.batter.skill.offense.speed);
                        while (fieldingReturnDelay - 100 > 0 && swing.bases < 3) {
                            swing.bases++;
                            fieldingReturnDelay  -= 80;
                        }
                    }
                }
                log('fielder return delay', fieldingReturnDelay, interceptRating, fielder.skill.defense);
            }
        } else {
            if (Math.abs(90 - splayAngle) < 45 && landingDistance > 300) {
                swing.bases = 4;
            } else {
                swing.foul = true;
                swing.caught = false;
            }
        }

        return this.translateSwingResultToStylePosition(swing);
    },
    findFielder : function(splayAngle, landingDistance) {
        if (Math.abs(90 - splayAngle) > 50) return false;
        if (landingDistance < 10 && landingDistance > -20) {
            return 'catcher';
        } else if (landingDistance >= 10 && landingDistance < 66 && Math.abs(90 - splayAngle) < 5) {
            return 'pitcher';
        }
        if (landingDistance > 20 && landingDistance + (Math.abs(90 - splayAngle))/90*37 < 155) {
            if (splayAngle < 45 + 23) {
                return 'third';
            } else if (splayAngle < 45 + 23 + 23) {
                return 'short';
            } else if (splayAngle < 45 + 23 + 23 + 23) {
                return 'second';
            } else {
                return 'first';
            }
        } else if (landingDistance > 90 && landingDistance < 310) {
            if (splayAngle < 45 + 28) {
                return 'left';
            } else if (splayAngle < 45 + 28 + 34) {
                return 'center';
            } else {
                return 'right';
            }
        } else {
            return false;
        }
    },
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
    getPolarDistance : function(a, b) {
        return Math.sqrt(a[1]*a[1] + b[1]*b[1] - 2*a[1]*b[1]*Math.cos(a[0]*Math.PI/180 - b[0]*Math.PI/180));
    },
    fieldingTest : function() {
        var fielders = {
            pitcher : {tally : 0, distances : []},
            catcher : {tally : 0, distances : []},
            first : {tally : 0, distances : []},
            second : {tally : 0, distances : []},
            short : {tally : 0, distances : []},
            third : {tally : 0, distances : []},
            left : {tally : 0, distances : []},
            center : {tally : 0, distances : []},
            right : {tally : 0, distances : []},
            'false' : {tally : 0, distances : []}
        };
        var angle = Math.random()*90+45;
        var distance = Math.random()*320;
        var fielder = this.findFielder(angle, distance);
        var data = {};
        if (fielder) {
            var fielderCandidates = this.fielderSelectionTest(angle, distance, true);
                data.fielder = fielderCandidates[1];
                data[fielderCandidates[0]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[0]][0], this.positions[fielderCandidates[0]][1]]);
                data[fielderCandidates[1]] = this.getPolarDistance([angle, distance], [this.positions[fielderCandidates[1]][0], this.positions[fielderCandidates[1]][1]])
            return data;
        }
    },
    aggregateFieldingTest : function() {
        var fielders = {
            pitcher : {tally : 0, distances : []},
            catcher : {tally : 0, distances : []},
            first : {tally : 0, distances : []},
            second : {tally : 0, distances : []},
            short : {tally : 0, distances : []},
            third : {tally : 0, distances : []},
            left : {tally : 0, distances : []},
            center : {tally : 0, distances : []},
            right : {tally : 0, distances : []},
            'false' : {tally : 0, distances : []}
        };
        var selections = [];
        for (var i = 0; i < 1000; i++) {
            var angle = Math.random()*90+45;
            var distance = Math.random()*320;
            var fielder = this.findFielder(angle, distance);
            fielders[fielder].tally++;
            if (fielder) {
                fielders[fielder].distances.push(this.getPolarDistance([angle, distance], [this.positions[fielder][0], this.positions[fielder][1]]));
            }
            selections.push([angle, distance]);
            selections.push(this.fielderSelectionTest(angle, distance, true));
        }
        return [fielders, selections];
    },
    fielderSelectionTest : function(angle, distance, returnFielder) {
        var distances = [];
        var minDistance = 300;
        var giraffe = this;
        var fielder = false;
        jQ.each(this.positions, function(position, spot) {
            var thisDistance = giraffe.getPolarDistance([angle, distance], spot);
            distances[thisDistance] = position;
            if (minDistance > thisDistance) {
                minDistance = thisDistance;
                fielder = position;
            }
        });
        return returnFielder ? [fielder, this.findFielder(angle, distance)] : distances;
    }
};
var Game = function(baseball) {
    this.init(baseball);
};

Game.prototype = {
    constructor : Game,
    gamesIntoSeason : 0,
    init : function(m) {
        if (m) window.mode = m;
        this.gamesIntoSeason = 60 + Math.floor(Math.random()*20);
        this.field = new Field(this);
        this.teams.away = new Team(this);
        this.teams.home = new Team(this);
        this.log = new Log();
        this.log.game = this;
        this.helper = helper;
        while (this.teams.away.name == this.teams.home.name) {
            this.teams.away.pickName();
        }
        this.umpire = new Umpire(this);
        if (this.humanPitching()) {
            this.stage = 'pitch';
        } else {
            this.autoPitch(function(){});
        }
    },
    getInning : function() {
        return mode == 'n' ? (this.inning + (this.half == 'top' ? 'オモテ' : 'ウラ')) : this.half.toUpperCase() + ' ' + this.inning;
    },
    humanBatting : function() {
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'away';
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
        }
    },
    humanPitching : function() {
        switch (this.half) {
            case 'top':
                return this.humanControl == 'both' || this.humanControl == 'home';
                break;
            case 'bottom':
                return this.humanControl == 'both' || this.humanControl == 'away';
                break;
        }
    },
    end : function() {
        this.stage = 'end';
        this.log.note(this.tally.home.R > this.tally.away.R ? 'Home team wins!' : (this.tally.home.R == this.tally.away.R ? 'You tied. Yes, you can do that.' : 'Visitors win!'));
    },
    stage : 'pitch', //pitch, swing
    humanControl : 'home', //home, away, both
    receiveInput : function(x, y, callback) {
        if (this.stage == 'end') {
            return;
        }
        if (this.stage == 'pitch') {
            this.thePitch(x, y, callback);
        } else if (this.stage == 'swing') {
            this.theSwing(x, y, callback);
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
    autoPitch : function(callback) {
        var pitcher = this.pitcher;
        if (this.stage == 'pitch') {
            jQ('.baseball').addClass('hide');
            pitcher.windingUp = true;
            this.swingResult.looking = true;
            var windup = jQ('.windup');
            windup.css('width', '100%');
            var giraffe = this;
            this.autoPitchSelect();
            if (Math.random() < 0.5) {
                var x = 50 + Math.floor(Math.random()*70) - Math.floor(Math.random()*15);
            } else {
                x = 150 + Math.floor(Math.random()*15) - Math.floor(Math.random()*70);
            }
            var y = 30 + (170 - Math.floor(Math.sqrt(Math.random()*28900)));

            windup.animate({width: 0}, this.field.hasRunnersOn() ? 1500 : 3000, function() {
                if (giraffe.batter.skill.offense.eye > Math.random()*100) {
                    jQ('.baseball.break').removeClass('hide');
                } else {
                    jQ('.baseball.break').removeClass('hide');
                }
                jQ('.baseball.pitch').removeClass('hide');
                giraffe.thePitch(x, y, callback);
                pitcher.windingUp = false;
            });
        }
    },
    autoSwing : function(deceptiveX, deceptiveY, callback) {
        var x = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15),
            y = 100 + Math.floor(Math.random()*15) - Math.floor(Math.random()*15);
        var convergence = 1.35 * this.batter.skill.offense.eye/100,
            convergenceSum = 1 + convergence;
        if (100*Math.random() < this.batter.skill.offense.eye) {
            deceptiveX = this.pitchInFlight.x;
            deceptiveY = this.pitchInFlight.y;
        }
        x = (deceptiveX*(convergence) + x)/convergenceSum;
        y = (deceptiveY*(convergence) + y)/convergenceSum;

        var swingLikelihood = (200 - Math.abs(100 - x) - Math.abs(100 - y))/2;

        if (x < 60 || x > 140 || y < 50 || y > 150) { // ball
            swingLikelihood = Math.min(swingLikelihood, 100 - this.batter.skill.offense.eye);
        } else {
            swingLikelihood = Math.max(45, (swingLikelihood + this.batter.skill.offense.eye)/2);
        }

        if (swingLikelihood - 10*(this.umpire.count.balls - this.umpire.count.strikes) > Math.random()*100) {
            this.theSwing(x, y, callback);
        } else {
            // no swing;
            this.theSwing(-20, y, callback);
        }
    },
    thePitch : function(x, y, callback) {
        if (this.stage == 'pitch') {
            this.pitchTarget.x = x;
            this.pitchTarget.y = y;

            this.pitchInFlight.breakDirection = this.helper.pitchDefinitions[this.pitchInFlight.name].slice(0, 2);
            this.battersEye = text('looks like: ')+(Math.abs(this.pitchInFlight.breakDirection[0])+Math.abs(this.pitchInFlight.breakDirection[1]) > 40 ?
                text('breaking ball') : text('fastball'));

            var control = this.pitchInFlight.control;
            this.pitchTarget.x = Math.min(199.9, Math.max(0.1, this.pitchTarget.x + (50 - Math.random()*100)/(1+control/100)));
            this.pitchTarget.y = Math.min(199.9, Math.max(0.1, this.pitchTarget.y + (50 - Math.random()*100)/(1+control/100)));

            if (this.pitcher.throws == 'right') this.pitchInFlight.breakDirection[0] *= -1;

            this.pitchInFlight.x = Math.floor(this.pitchTarget.x + (this.pitchInFlight.breakDirection[0]
                *((0.5+Math.random()*this.pitchInFlight.break)/100)));
            this.pitchInFlight.y = Math.floor(this.pitchTarget.y + (this.pitchInFlight.breakDirection[1]
                *((0.5+Math.random()*this.pitchInFlight.break)/100))/(0.5 + this.pitchTarget.y/200));
            this.log.notePitch(this.pitchInFlight, this.batter);

            this.stage = 'swing';
            if (this.humanControl == 'both' || this.teams[this.humanControl].lineup[this.batter.team.nowBatting] == this.batter) {
                callback();
            } else {
                this.autoSwing(x, y, callback);
            }
        }
    },
    battersEye : '',
    theSwing : function(x, y, callback) {
        if (this.stage == 'swing') {
            this.swingResult = {};
            this.swingResult.x = 100 + (x - 100)*(0.5+Math.random()*this.batter.skill.offense.eye/200) - this.pitchInFlight.x;
            this.swingResult.y = 100 + (y - 100)*(0.5+Math.random()*this.batter.skill.offense.eye/200) - this.pitchInFlight.y;

            if (!(x < 0 || x > 200)) {
                this.swingResult.looking = false;
                if (Math.abs(this.swingResult.x) < 60 && Math.abs(this.swingResult.y) < 35) {
                    this.swingResult.contact = true;
                    this.swingResult = this.field.determineSwingContactResult(this.swingResult);
                } else {
                    this.swingResult.contact = false;
                }
            } else {
                this.swingResult.strike = this.pitchInFlight.x > 50 && this.pitchInFlight.x < 150
                    && this.pitchInFlight.y > 35 && this.pitchInFlight.y < 165;
                this.swingResult.contact = false;
                this.swingResult.looking = true;
            }

            this.log.noteSwing(this.swingResult);
            this.stage = 'pitch';

            this.umpire.makeCall();

            if (this.humanControl == 'both' || this.teams[this.humanControl].positions.pitcher == this.pitcher) {
                callback();
            } else {
                this.autoPitch(callback);
            }
        }
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
        strike : false,
        foul : false,
        caught : false,
        contact : false,
        looking : true,
        bases : 0,
        fielder : 'short',
        outs : 0
    },
    pitchSelect : function() {

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
var Manager = function(team) {
    this.init(team);
};

Manager.prototype = {
    constructor : Manager,
    init : function(team) {
        this.team = team;
    },
    makeLineup : function() {
        var jerseyNumber = 1;
        this.team.positions.pitcher = this.selectForSkill(this.team.bench, ['pitching']);
        this.team.positions.pitcher.position = 'pitcher';
        this.team.positions.pitcher.number = jerseyNumber++;
        this.team.positions.catcher = this.selectForSkill(this.team.bench, ['defense', 'catching'], true);
        this.team.positions.catcher.position = 'catcher';
        this.team.positions.catcher.number = jerseyNumber++;
        jQ.each(this.team.bench, function(key, player) {
            player.number = jerseyNumber++;
        });
        this.team.positions.short = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.short.position = 'short';
        this.team.positions.second = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.second.position = 'second';
        this.team.positions.third = this.selectForSkill(this.team.bench, ['defense', 'fielding'], true);
        this.team.positions.third.position = 'third';
        this.team.positions.center = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.center.position = 'center';
        this.team.positions.left = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.left.position = 'left';
        this.team.positions.right = this.selectForSkill(this.team.bench, ['defense', 'speed']);
        this.team.positions.right.position = 'right';
        this.team.positions.first = this.selectForSkill(this.team.bench, ['defense', 'fielding']);
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
    selectForSkill : function(pool, skillset, mustBeRightHanded) {
        var property;
        mustBeRightHanded = !!mustBeRightHanded;
        if (this.team.bench.length || pool == this.team.positions) {
            var selection = this.team.bench[0];
            var rating = 0;
            var index = 0;
            jQ.each(pool, function(key, player) {
                var skills = skillset.slice();
                var cursor = player.skill;
                while (property = skills.shift()) {
                    cursor = cursor[property];
                }
                if (!(player.order+1) && cursor >= rating && (!mustBeRightHanded || player.throws == 'right')) {
                    rating = cursor;
                    selection = player;
                    index = key;
                }
            });
            delete this.team.bench[index];
            if (pool == this.team.bench) {
                this.team.bench = this.team.bench.filter(function(player) {
                    return player instanceof selection.constructor;
                })
            }
            return selection;
        }
        return 'no players available';
    }
};
var Player = function(team) {
    this.init(team);
    var offense = this.skill.offense;
    var defense = this.skill.defense;
    var randBetween = function(a, b, skill) {
        if (offense[skill]) skill = offense[skill];
        if (defense[skill]) skill = defense[skill];
        if (isNaN(skill)) skill = 50;
        skill = Math.sqrt(0.2 + Math.random()*0.8)*skill;
        return Math.floor((skill/100) * (b - a) + a);
    };
    // let's just say we're about X games into the season
    var gamesIntoSeason = this.team.game.gamesIntoSeason;
    var IP, ER, GS, W, L;
    if (this.skill.pitching > 65) {
        IP = (this.skill.pitching - 65)*gamesIntoSeason/20;
        ER = (IP/9)*randBetween(800, 315, this.skill.pitching)/100;
        if (IP > gamesIntoSeason) {
            //starter
            GS = Math.floor(gamesIntoSeason/5);
            W = randBetween(0, GS*0.6, this.skill.pitching/1.2);
            L = randBetween((GS - W), 0, this.skill.pitching/3);
        } else {
            //reliever
            GS = Math.floor(gamesIntoSeason/40);
            W = randBetween(0, GS*0.6, this.skill.pitching);
            L = randBetween((GS - W), 0, this.skill.pitching);
        }
    }
    var pa = randBetween(gamesIntoSeason*3, gamesIntoSeason*5, 'speed');
    var paRemaining = pa;
    var bb = Math.floor(randBetween(3, 18, 'eye')*paRemaining/100);
    paRemaining -= bb;
    var ab = paRemaining;
    var so = Math.floor(randBetween(33, 2, 'eye')*paRemaining/100);
    paRemaining -= so;
    var h = Math.floor(randBetween(97, 372, 'eye')*paRemaining/1000);
    paRemaining -= h;

    var doubles = randBetween(0, h/4, 'power');
    var triples = randBetween(0, h/12, 'speed');
    var hr = Math.max(0, randBetween(-h/5, h/5, 'power'));
    var r = randBetween(0, (h + bb)/4, 'speed') + hr;
    var rbi = randBetween(0, h/3, 'power') + hr;
    var hbp = randBetween(0, gamesIntoSeason/25);
    var sf = randBetween(0, gamesIntoSeason/5, 'eye');

    var chances = randBetween(0, gamesIntoSeason*10, 'fielding');
    var E = randBetween(chances/10, 0, 'fielding');
    var PO = chances - E;

    this.stats = {
        pitching : {
            pitches : 0, // in game
            GS : GS,
            W: W,
            L: L,
            strikes : 0, // in game
            K : 0, // in game
            getERA : function() {
                return 9 * this.ER / Math.max(1/3, this.IP[0] + this.IP[1]/3)
            },
            ERA : null,
            ER : ER,
            H : 0, // in game
            HR : 0, // in game
            BB : 0, // in game
            IP : [IP,0]
        },
        batting : {
            getBA : function() {
                return this.h / (Math.max(1, this.ab))
            },
            ba : null,
            getOBP : function() {
                return (h + bb + hbp)/(ab + bb + hbp + sf);
            },
            obp : null,
            getSLG : function() {
                return ((h - doubles - triples - hr) + 2*doubles + 3*triples + 4*hr)/ab
            },
            slg : null,
            pa : pa,
            ab : ab,
            so : so,
            bb : bb,
            h : h,
            '2b' : doubles,
            '3b' : triples,
            hr : hr,
            r : r,
            rbi : rbi,
            hbp : hbp
        },
        fielding : {
            E : E,
            PO : PO, // should depend on position
            A : Math.floor(Math.random()*5) + 1 // ehh should depend on position
        }
    };
    this.stats.pitching.ERA = this.stats.pitching.getERA();
    this.stats.batting.ba = this.stats.batting.getBA();
};

Player.prototype = {
    constructor : Player,
    init : function(team) {
        this.throws = Math.random() > 0.86 ? 'left' : 'right';
        this.bats = Math.random() > 0.75 ? 'left' : 'right';
        this.team = team;
        this.skill = {};
        this.pitching = {averaging : []};
        this.number = 0;
        this.randomizeSkills(Math.random() > 0.9);
        var surnameKey = Math.floor(Math.random()*data.surnames.length),
            nameKey = Math.floor(Math.random()*data.names.length);

        this.name = data.surnames[surnameKey] + ' ' + data.names[nameKey];
        var jSurname = data.surnamesJ[surnameKey],
            jGivenName = data.namesJ[nameKey];
        if (jSurname.length == 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length == 1 && jSurname.indexOf('・') < 0) jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.atBats = [];
    },
    randomizeSkills : function(hero) {
        this.hero = hero;
        var giraffe = this;
        var randValue = function(isPitching) {
            var value = Math.floor(Math.pow(Math.random(), 0.75)*80 + Math.random()*20);
            if (hero) {
                value += Math.floor((100 - value)*Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value
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
        this.pitching['slider'] = {
            velocity : randValue(true),
            'break' : randValue(true),
            control : randValue(true)
        };
        if (Math.random() < 0.17) {
            // can pitch!
            if (Math.random() > 0.6) {
                this.pitching['2-seam'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() < 0.18) {
                this.pitching['fork'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() > 0.77) {
                this.pitching['cutter'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
            if (Math.random() < 0.21) {
                this.pitching['sinker'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }

            if (Math.random() < 0.4) {
                this.pitching['curve'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }

            if (Math.random() < 0.9) {
                this.pitching['change'] = {
                    velocity : randValue(true),
                    'break' : randValue(true),
                    control : randValue(true)
                }
            }
        }
        this.skill.pitching = Math.floor((this.pitching.averaging.reduce(function(prev, current, index, arr) {
            return prev + current
        }))/this.pitching.averaging.length+this.pitching.averaging.length*3);
        delete this.pitching.averaging;
    },
    getSurname : function() {
        return mode == 'n' ? this.nameJ[0] : this.name.split(' ')[0];
    },
    getName : function() {
        return mode == 'n' ? this.nameJ : this.name;
    },
    name : '',
    number : 0,
    position : '',
    atBats : []
};
var Team = function(game) {
    this.init(game);
};

Team.prototype = {
    constructor : Team,
    init : function(game) {
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
        this.game = game;
        for (var j = 0; j < 20; j++) {
            this.bench.push(new Player(this));
        }
        this.manager = new Manager(this);
        this.manager.makeLineup();
        this.pickName();
    },
    pickName : function() {
        var teamNameIndex = Math.floor(Math.random()*data.teamNames.length);
        this.name = data.teamNames[teamNameIndex];
        this.nameJ = data.teamNamesJ[teamNameIndex];
    },
    getName : function() {
        return mode == 'n' ? this.nameJ : this.name;
    },
    lineup : [],
    positions : {},
    manager : null,
    bench : [],
    bullpen : [],
    nowBatting : 0
};
var Umpire = function(game) {
    this.init(game);
};

Umpire.prototype = {
    constructor : Umpire,
    init : function(game) {
        this.game = game;
        this.playBall();
    },
    count : {
        strikes : 0,
        balls : 0,
        outs : 0
    },
    playBall : function() {
        this.game.half = 'top';
        this.game.inning = 1;
        this.game.batter = this.game.teams.away.lineup[0];
        this.game.deck = this.game.teams.away.lineup[1];
        this.game.hole = this.game.teams.away.lineup[2];
        this.game.pitcher = this.game.teams.home.positions.pitcher;
        if (mode == 'n') {
            this.game.log.note(
                '一回のオモテ、'+this.game.teams.away.getName()+'の攻撃対'+this.game.teams.home.getName()+'、ピッチャーは'+this.game.teams.home.positions.pitcher.getName()+'。'
            );
        } else {
            this.game.log.note(
                'Top 1, '+this.game.teams.away.name+' offense vs. '+this.game.teams.home.positions.pitcher.name+' starting for '+this.game.teams.home.name
            );
        }
        this.game.log.noteBatter(
            this.game.batter
        );
    },
    makeCall : function() {
        this.says = '';

        var result = this.game.swingResult;
        var pitcher = this.game.pitcher;
        var batter = this.game.batter;

        pitcher.stats.pitching.pitches++;
        if (result.looking) {
            if (result.strike) {
                this.count.strikes++;
                pitcher.stats.pitching.strikes++;
            } else {
                this.count.balls++;
            }
        } else {
            if (result.contact) {
                if (result.caught) {
                    this.count.outs++;
                    pitcher.stats.pitching.IP[1]++;
                    this.game.batter.atBats.push('FO');
                    batter.stats.batting.pa++;
                    batter.stats.batting.ab++;
                    this.newBatter(); //todo: sac fly
                } else {
                    if (result.foul) {
                        this.count.strikes++;
                        pitcher.stats.pitching.strikes++;
                        if (this.count.strikes > 2) this.count.strikes = 2;
                    } else {
                        batter.stats.batting.pa++;
                        batter.stats.batting.ab++;
                        if (result.thrownOut) {
                            this.count.outs++;
                            pitcher.stats.pitching.IP[1]++;
                            this.game.batter.atBats.push('GO');
                            this.newBatter(); //todo: sac
                        }
                        if (result.bases) {
                            if (!result.error) {
                                this.game.tally[this.game.half == 'top' ? 'away' : 'home']['H']++;
                                pitcher.stats.pitching.H++;
                            } else {
                                if (result.bases > 0) {
                                    this.game.tally[this.game.half == 'top' ? 'home' : 'away']['E']++;
                                    this.game.teams[this.game.half == 'top' ? 'home' : 'away'].positions[result.fielder].stats.fielding.E++;
                                }
                            }
                            var bases = result.bases;
                            switch (bases) {
                                case 0 :
                                    this.game.batter.atBats.push('GO');
                                    break;
                                case 1 :
                                    if (result.error) {
                                        this.game.batter.atBats.push('ROE');
                                    } else {
                                        this.game.batter.atBats.push('H');
                                        batter.stats.batting.h++;
                                    }
                                    break;
                                case 2 :
                                    this.game.batter.atBats.push('2B');
                                    batter.stats.batting.h++;
                                    batter.stats.batting['2b']++;
                                    break;
                                case 3 :
                                    this.game.batter.atBats.push('3B');
                                    batter.stats.batting.h++;
                                    batter.stats.batting['3b']++;
                                    break;
                                case 4 :
                                    this.game.batter.atBats.push('HR');
                                    pitcher.stats.pitching.HR++;
                                    batter.stats.batting.h++;
                                    batter.stats.batting.hr++;
                                    break;
                            }
                            var onBase = false;
                            while (bases > 0) {
                                bases -= 1;
                                this.advanceRunners();
                                if (!onBase) {
                                    this.reachBase();
                                    onBase = true;
                                }
                            }
                            this.newBatter();
                        }
                    }
                }
            } else {
                pitcher.stats.pitching.strikes++;
                this.count.strikes++;
            }
        }

        this.says = (this.count.balls + ' and ' + this.count.strikes);

        if (this.count.strikes > 2) {
            batter.stats.batting.pa++;
            batter.stats.batting.ab++;
            batter.stats.batting.so++;
            pitcher.stats.pitching.K++;
            this.count.outs++;
            pitcher.stats.pitching.IP[1]++;
            this.count.balls = this.count.strikes = 0;
            this.says = 'Strike three. Batter out.';
            this.game.batter.atBats.push('SO');
            this.newBatter();
        }
        if (this.count.balls > 3) {
            batter.stats.batting.pa++;
            batter.stats.batting.bb++;
            pitcher.stats.pitching.BB++;
            this.says = 'Ball four.';
            this.count.balls = this.count.strikes = 0;
            this.game.batter.atBats.push('BB');
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
    reachBase : function() {
        this.game.field.first = this.game.batter;
        return this;
    },
    advanceRunners : function(isWalk) {
        isWalk = !!isWalk;

        if (isWalk) {
            if (this.game.field.first) {
                if (this.game.field.second) {
                    if (this.game.field.third) {
                        //bases loaded
                        this.game.batter.atBats.push('RBI');
                        this.game.batter.stats.batting.rbi++;
                        this.game.field.third.atBats.push('R');
                        this.game.field.third.stats.batting.r++;
                        this.game.pitcher.stats.pitching.ER++;
                        this.game.scoreboard[this.game.half == 'top' ? 'away' : 'home'][this.game.inning]++;
                        this.game.tally[this.game.half == 'top' ? 'away' : 'home']['R']++;
                        this.game.field.third = this.game.field.second;
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    } else {
                        // 1st and second
                        this.game.field.third = this.game.field.second;
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    }
                } else {
                    if (this.game.field.third) {
                        // first and third
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    } else {
                        // first only
                        this.game.field.second = this.game.field.first;
                        this.game.field.first = null;
                    }
                }
            } else {
                // no one on first
            }
        } else {
            if (this.game.field.third instanceof this.game.batter.constructor) {
                // run scored
                this.game.scoreboard[this.game.half == 'top' ? 'away' : 'home'][this.game.inning]++;
                this.game.tally[this.game.half == 'top' ? 'away' : 'home']['R']++;
                if (this.game.batter != this.game.field.third) {
                    this.game.batter.atBats.push('RBI');
                    this.game.batter.stats.batting.rbi++;
                    this.game.field.third.atBats.push('R');
                    this.game.field.third.stats.batting.r++;
                    this.game.pitcher.stats.pitching.ER++;
                }
            }
            this.game.field.third = this.game.field.second;
            this.game.field.second = this.game.field.first;
            this.game.field.first = null;
        }
        return this;
    },
    newBatter : function() {
        this.game.log.pitchRecord = [];
        this.count.balls = this.count.strikes = 0;
        this.game.log.notePlateAppearanceResult(this.game);
        var team = this.game.half == 'bottom' ? this.game.teams.home : this.game.teams.away;
        this.game.batter = team.lineup[(team.nowBatting + 1)%9];
        this.game.deck = team.lineup[(team.nowBatting + 2)%9];
        this.game.hole = team.lineup[(team.nowBatting + 3)%9];
        team.nowBatting = (team.nowBatting + 1)%9;
        if (this.count.outs < 3) {
            this.game.log.noteBatter(this.game.batter);
        }
    },
    changeSides : function() {
        this.game.swingResult.looking = true; // hide bat
        this.game.pitchInFlight.x = null; // hide ball
        this.game.pitchInFlight.y = null; // hide ball
        this.game.log.pitchRecord = [];
        var offense, defense;
        this.game.field.first = null;
        this.game.field.second = null;
        this.game.field.third = null;
        if (this.game.half == 'top') {
            if (this.game.inning == 9 && this.game.tally.home.R > this.game.tally.away.R) {
                return this.game.end();
            }
            this.game.half = 'bottom';
        } else {
            this.game.half = 'top';
            this.game.inning++;
            if (this.game.inning > 9) {
                return this.game.end();
            }
        }
        offense = this.game.half == 'top' ? 'away' : 'home';
        defense = this.game.half == 'top' ? 'home' : 'away';
        if (mode == 'n') {
            this.game.log.note(this.game.inning+'回の'+(this.game.half == 'top' ? 'オモテ' : 'ウラ')
            +'、'+this.game.teams[(this.game.half == 'top' ? 'away' : 'home')].getName()+'の攻撃。');
        } else {
            this.game.log.note((this.game.half == 'top' ? 'Top' : 'Bottom')+' '+this.game.inning);
        }
        var team = this.game.teams[offense];
        this.game.batter = team.lineup[team.nowBatting];
        this.game.deck = team.lineup[(team.nowBatting + 1)%9];
        this.game.hole = team.lineup[(team.nowBatting + 2)%9];

        this.game.pitcher = this.game.teams[defense].positions.pitcher;
        this.game.log.noteBatter(this.game.batter);
    },
    says : 'Play ball!',
    game : null
};
var Batter = function() {
    this.init();
};

Batter.prototype = {
    init : function() {

    }
};
var Runner = function() {
    this.init();
};

Runner.prototype = {
    init : function() {

    }
};
var Catcher = function() {
    this.init();
};

Catcher.prototype = {
    init : function() {

    }
};
var Fielder = function() {
    this.init();
};

Fielder.prototype = {
    init : function() {

    }
};
var Pitcher = function() {
    this.init();
};

Pitcher.prototype = {
    init : function() {

    }
};
IndexController = function($scope) {
    window.s = $scope;
    $scope.t = text;
    $scope.y = new Game();
    $scope.mode = function(setMode) {
        if (setMode) {
            mode = setMode;
        }
        return mode;
    };
    $scope.holdUpTimeouts = [];
    $scope.expandScoreboard = false;
    $scope.proceedToGame = function () {
        jQ('.blocking').remove();
    };
    $scope.updateFlightPath = function() {
        var ss = document.styleSheets;
        var animation = 'flight';
        for (var i = 0; i < ss.length; ++i) {
            for (var j = 0; j < ss[i].cssRules.length; ++j) {
                if (ss[i].cssRules[j].type == window.CSSRule.WEBKIT_KEYFRAMES_RULE && ss[i].cssRules[j].name == animation) {
                    var rule = ss[i].cssRules[j];
                }
            }
        }
        var keyframes = rule;
        var to = function(percent, top, left) {
            var originTop = 50;
            var originLeft = 110 + ($scope.y.pitcher.throws == 'left' ? 20 : -20);
            Math.square = function(x) { return x*x };
            left = originLeft + Math.square(percent/100)*(left - originLeft);
            top = originTop + Math.square(percent/100)*(top - originTop);
            var padding = Math.max(Math.square(percent/100)*13, 2);
            var borderWidth = Math.square(percent/100)*4;
            return 'top: '+top+'px; left: '+left+'px; padding: '+padding+'px; border-width:'+borderWidth+'px';
        };
        var game = $scope.y;
        var top = 200-game.pitchTarget.y;
        var left = game.pitchTarget.x;
        var breakTop = 200-game.pitchInFlight.y,
            breakLeft = game.pitchInFlight.x;
        keyframes.deleteRule('0%');
        keyframes.deleteRule('25%');
        keyframes.deleteRule('50%');
        keyframes.deleteRule('75%');
        keyframes.deleteRule('100%');
        keyframes.insertRule('0% { '+to(15, top, left)+' }');
        keyframes.insertRule('25% { '+to(20, top, left)+' }');
        keyframes.insertRule('50% { '+to(35, top, left)+' }');
        keyframes.insertRule('75% { '+to(65, top, left)+' }');
        keyframes.insertRule('100% { '+to(100, breakTop, breakLeft)+' }');

        var $baseballs = jQ('.baseball');
        var flightSpeed = 1.3 - 0.6*(game.pitchInFlight.velocity + 300)/400;
        $baseballs.css('-webkit-animation', 'flight '+flightSpeed+'s 1 0s linear');
        $baseballs.removeClass('flight');
        $baseballs.addClass('flight');

        $scope.lastTimeout = setTimeout(function() {
            jQ('.baseball').removeClass('flight');
            jQ('.baseball').addClass('spin');
            var horizontalBreak = (60 - Math.abs(game.pitchTarget.x - game.pitchInFlight.x))/10;
            jQ('.baseball').css('-webkit-animation', 'spin '+horizontalBreak+'s 5 0s linear');
            $scope.allowInput = true;
        }, flightSpeed*1000);

        if (!game.pitchInFlight.x) {
            $baseballs.addClass('hide');
        } else {
            if (game.humanBatting()) {
                jQ('.baseball.break').addClass('hide');
            } else {
                jQ('.baseball.break').removeClass('hide');
            }
            jQ('.baseball.pitch').removeClass('hide');
        }
        jQ('.baseball.pitch').css({
            top: 200-game.pitchTarget.y,
            left: game.pitchTarget.x
        });
        jQ('.baseball.break').css({
            top: 200-game.pitchInFlight.y,
            left: game.pitchInFlight.x
        });
        $baseballs.each(function(k, item) {
            var elm = item,
                newOne = elm.cloneNode(true);
            elm.parentNode.replaceChild(newOne, elm);
        });

        if ($scope.y.humanBatting() && !$scope.y.humanPitching()) {
            $scope.holdUpTimeouts.push(setTimeout(function() {
                $scope.holdUp();
            }, (flightSpeed + 1.2) * 1000));
        }
    };
    $scope.selectPitch = function(pitchName) {
        if ($scope.y.stage == 'pitch') {
            $scope.y.pitchInFlight = jQ.extend({}, $scope.y.pitcher.pitching[pitchName]);
            $scope.y.pitchInFlight.name = pitchName;
            $scope.y.swingResult.looking = true;
        }
    };
    $scope.allowInput = true;
    $scope.holdUp = function() {
        jQ('.no-swing').click();
        $scope.$apply();
        //$scope.y.receiveInput(-20, 100, function() {
        //    $scope.updateFlightPath();
        //});
    };
    $scope.indicate = function($event) {
        if (!$scope.allowInput) {
            return;
        }
        if ($scope.y.pitcher.windingUp) {
            return;
        }
        if ($scope.y.humanPitching()) $scope.allowInput = false;
        var offset = jQ('.target').offset();
        var relativeOffset = {
            x : $event.pageX - offset.left,
            y : 200 - ($event.pageY - offset.top)
        };
        clearTimeout($scope.lastTimeout);
        while ($scope.holdUpTimeouts.length) {
            clearTimeout($scope.holdUpTimeouts.shift());
        }
        $scope.y.receiveInput(relativeOffset.x, relativeOffset.y, function() {
            $scope.updateFlightPath();
        });
    };
    $scope.abbreviatePosition = function(position) {
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
    };
};
ScoreboardDirective = function() {
    return {
        scope: {
            game: '=',
            text: '='
        },
        templateUrl: 'js/internal/angular/views/directives/scoreboard.html?cache='+cacheKey,
        link: function(scope) {
            window.s2 = scope;
            scope.t = scope.text;
            scope.y = scope.game;
        }
    };
};
var app = angular.module('YakyuuAikoukai', ['directives']);

cacheKey = Math.floor(Math.random()*1500);

angular.module('directives', [])
    .directive('scoreboard', ScoreboardDirective);

angular.module('controllers', [])
    .controller('IndexController', IndexController);