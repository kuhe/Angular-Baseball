import { data, text } from '../Utility/_utils';
import { Distribution } from '../Services/Distribution';
import { Mathinator } from '../Services/Mathinator';
import { Iterator } from '../Services/Iterator';
import { AtBat } from '../Model/AtBat';
import k from '../Model/TeamConstants';

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
        const surnameKey = Math.floor(Math.random()*data.surnames.length), nameKey = Math.floor(Math.random()*data.names.length);

        this.name = `${data.surnames[surnameKey]} ${data.names[nameKey]}`;
        const jSurname = data.surnamesJ[surnameKey], jGivenName = data.namesJ[nameKey];
        this.spaceName(jSurname, jGivenName);
        this.surname = data.surnames[surnameKey];
        this.surnameJ = data.surnamesJ[surnameKey];
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
            this.atBatObjects = this.atBats.map(item => new AtBat(item));
        }
        return this.atBatObjects;
    },
    recordRBI() {
        this.atBats[this.atBats.length - 1] += AtBat.prototype.RBI_INDICATOR;
    },
    recordInfieldHit() {
        this.atBats[this.atBats.length - 1] += AtBat.prototype.INFIELD_HIT_INDICATOR;
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
            this, base, this.team.stealAttempt === k.RUNNERS_DISCRETION);
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
        return text.mode === 'n' ? this.surnameJ : this.surname;
    },
    /**
     * language-sensitive
     * @returns {String}
     */
    getName() {
        return text.mode === 'n' ? this.nameJ : this.name;
    },
    getUniformNumber() {
        return text('#') + this.number;
    },
    /**
     * language-sensitive, for text representation of batting order
     * @returns {String}
     */
    getOrder() {
        return text([' 1st', ' 2nd', ' 3rd', ' 4th', ' 5th', ' 6th', '7th', ' 8th', ' 9th'][this.order]);
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
        if (!this.definingBattingCharacteristic[text.mode]) {
            this.definingBattingCharacteristic[text.mode] = this.getDefiningCharacteristic(true);
        }
        return this.definingBattingCharacteristic[text.mode];
    },
    /**
     * a localized description of this player's defining pitching characteristic e.g. "control pitcher"
     * @returns {string}
     */
    getDefiningPitchingCharacteristic() {
        if (!this.definingPitchingCharacteristic[text.mode]) {
            this.definingPitchingCharacteristic[text.mode] = this.getDefiningCharacteristic(false, true);
        }
        return this.definingPitchingCharacteristic[text.mode];
    },
    /**
     * a localized phrase describing a strong trait of this player e.g. "ace" or "power hitter".
     * @param battingOnly to return only their defining batting characteristic.
     * @param {boolean} pitchingOnly to return only a pitching characteristic.
     * @returns {string}
     */
    getDefiningCharacteristic(battingOnly, pitchingOnly) {
        if (this.definingCharacteristic[text.mode] && !battingOnly) {
            return this.definingCharacteristic[text.mode];
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
                out = text('Ace');
            } else if (pitching[0] > EXCELLENT) {
                out = text('Control pitcher');
            } else if (pitching[1] > EXCELLENT) {
                out = text('Flamethrower');
            } else if (pitching[2] > EXCELLENT) {
                out = text('Breaking ball');
            }
        } else {
            if (battingOnly || sum([offense[0] * 2, offense[1] * 0.50, offense[2]]) > sum(defense)) {
                if (offense[0] > 98 || (sum(offense) > ELITE * 3)) {
                    out = text('Genius batter');
                } else if (offense[1] > EXCELLENT && offense[1] > offense[0]) {
                    out = text('Power hitter');
                } else if (offense[0] > EXCELLENT) {
                    out = text('Contact');
                } else if (offense[2] > EXCELLENT) {
                    out = text('Speedster');
                } else if (offense[0] < INEPT || (sum(offense) < POOR * 3)) {
                    out = text('Inept');
                } else if (offense[1] < INEPT && offense[1] < offense[0]) {
                    out = text('Weak swing');
                } else if (offense[0] < BAD) {
                    out = text('Strikes out');
                } else if (offense[2] < POOR) {
                    out = text('Leisurely runner');
                }
            } else {
                if (sum(defense) > EXCELLENT * 3) {
                    out = text('Defensive wizard');
                } else if (defense[0] > EXCELLENT) {
                    out = text('Glove');
                } else if (defense[1] > EXCELLENT) {
                    out = text('Range');
                } else if (defense[2] > ELITE) {
                    out = text('Strong throw');
                }
            }
        }
        if (battingOnly || pitchingOnly) return out;
        return this.definingCharacteristic[text.mode] = out;
    },
    /**
     * to ease comparison in Angular (?)
     */
    toString() {
        return `${this.name} #${this.number}`;
    }
};

export { Player }