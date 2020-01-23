import { Team } from '../Model/Team';
import { Player } from '../Model/Player';
import { Trainer } from './Trainer';
import { fielder_short_name_t } from '../Api/fielderShortName';

const samurai = new Team('no init');
samurai.name = 'Japan';
samurai.nameJ = '日本';

const darvish = new Player(samurai),
    johjima = new Player(samurai),
    ogasawara = new Player(samurai),
    nishioka = new Player(samurai),
    kawasaki = new Player(samurai),
    murata = new Player(samurai),
    matsui = new Player(samurai),
    ichiro = new Player(samurai),
    inaba = new Player(samurai);

const matsuzaka = new Player(samurai),
    fukudome = new Player(samurai),
    aoki = new Player(samurai),
    abe = new Player(samurai),
    iwamura = new Player(samurai);

const coach = new Trainer();

coach.makePlayer(
    darvish,
    'Yu',
    'Darvish',
    'ダルビッシュ',
    '有',
    150,
    { eye: 80, power: 80, speed: 80 },
    { catching: 50, fielding: 70, throwing: 100, speed: 80 },
    'right',
    'right',
    11
);

coach.makePlayer(
    johjima,
    'Kenji',
    'Johjima',
    '城島',
    '健司',
    60,
    { eye: 90, power: 108, speed: 70 },
    { catching: 140, fielding: 88, throwing: 75, speed: 75 },
    'right',
    'right',
    2
);

coach.makePlayer(
    ogasawara,
    'Michihiro',
    'Ogasawara',
    '小笠原',
    '道大',
    80,
    { eye: 96, power: 90, speed: 90 },
    { catching: 50, fielding: 96, throwing: 85, speed: 70 },
    'left',
    'right',
    36
);

coach.makePlayer(
    nishioka,
    'Tsuyoshi',
    'Nishioka',
    '西岡',
    '剛',
    80,
    { eye: 95, power: 75, speed: 92 },
    { catching: 90, fielding: 88, throwing: 88, speed: 90 },
    'right',
    'right',
    7
);

coach.makePlayer(
    kawasaki,
    'Munenori',
    'Kawasaki',
    '川崎',
    '宗則',
    80,
    { eye: 95, power: 75, speed: 95 },
    { catching: 90, fielding: 120, throwing: 99, speed: 100 },
    'left',
    'right',
    52
);

coach.makePlayer(
    murata,
    'Shuichi',
    'Murata',
    '村田',
    '修一',
    80,
    { eye: 82, power: 110, speed: 70 },
    { catching: 80, fielding: 80, throwing: 90, speed: 60 },
    'right',
    'right',
    25
);

coach.makePlayer(
    matsui,
    'Hideki',
    'Matsui',
    '松井',
    '秀樹',
    75,
    { eye: 104, power: 120, speed: 50 },
    { catching: 40, fielding: 85, throwing: 70, speed: 60 },
    'left',
    'right',
    55
);

coach.makePlayer(
    ichiro,
    '',
    'Ichiro',
    'イチロー',
    '',
    89,
    { eye: 115, power: 80, speed: 115 },
    { catching: 80, fielding: 115, throwing: 115, speed: 115 },
    'left',
    'right',
    51
);

coach.makePlayer(
    inaba,
    'Atsunori',
    'Inaba',
    '稲葉',
    '篤紀',
    80,
    { eye: 92, power: 95, speed: 75 },
    { catching: 50, fielding: 95, throwing: 95, speed: 75 },
    'right',
    'right',
    41
);

samurai.bench = [darvish, johjima, ogasawara, nishioka, kawasaki, murata, matsui, ichiro, inaba];
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

for (const position in samurai.positions) {
    if (samurai.positions.hasOwnProperty(position)) {
        samurai.positions[
            position as fielder_short_name_t
        ].position = position as fielder_short_name_t;
    }
}

samurai.lineup = [ichiro, kawasaki, inaba, matsui, ogasawara, johjima, murata, nishioka, darvish];

samurai.lineup.map((player, order) => {
    player.order = order;
});

export { samurai };
