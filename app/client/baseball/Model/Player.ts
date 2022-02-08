import { data, text } from '../Utility/_utils';
import { Distribution } from '../Services/Distribution';
import { Mathinator } from '../Services/Mathinator';
import { AtBat } from './AtBat';
import { Team } from './Team';
import { fielder_short_name_t } from '../Api/fielderShortName';
import { handedness_t } from '../Api/handedness';
import { pitch_in_flight_t, strike_zone_coordinate_t } from '../Api/pitchInFlight';
import { player_skill_t } from '../Api/player';
import { pitch_skill_t, pitches_t } from '../Api/pitches';
import { multilingual_description_t } from '../Api/log';
import { Game } from './Game';
import { base_name_t } from '../Api/baseName';

/**
 * Models game participants: batter, runners, fielders, bench.
 */
class Player {
    public position: fielder_short_name_t | 'bench' = 'bench';
    public ready: boolean = false;

    /**
     * Indicates the player has above-average skills.
     */
    public hero: boolean = false;

    /**
     * Affects abilities negatively when accumulated.
     */
    public fatigue = 0;

    /**
     * Batting order index (0 - 8).
     * -1 indicates not in lineup.
     */
    public order = -1;

    public throws: handedness_t = Math.random() > 0.86 ? 'left' : 'right';
    public bats: handedness_t = Math.random() > 0.75 ? 'left' : 'right';

    /**
     * This affects how CPU players perform against the player, or
     * how user-controlled players perform in automatic tasks, such as
     * fielding, base-running, or batting-contact-aim-assist.
     *
     * The default values here are overwritten on construction by the randomizer.
     * @see #randomizeSkills()
     */
    public skill: {
        offense: {
            eye: player_skill_t; // contact accuracy
            power: player_skill_t;
            speed: player_skill_t; // baserunning
        };
        defense: {
            catching: player_skill_t;
            fielding: player_skill_t;
            throwing: player_skill_t; // note this is distinct from pitching velocity.
            speed: player_skill_t;
        };
        pitching: player_skill_t;
    } = {
        offense: {
            eye: 0,
            power: 0,
            speed: 0
        },
        defense: {
            catching: 0,
            fielding: 0,
            throwing: 0,
            speed: 0
        },
        pitching: 0
    };

    /**
     * Tracks the player's prediction of the incoming pitch location,
     * used when the player is at bat.
     */
    public eye: strike_zone_coordinate_t & { bonus?: number } = {
        x: 100,
        y: 100
    };
    /**
     * Used during at bats.
     */
    public lastPitchCertainty = 0;

    /**
     * Describes the player's abilities with their pitch arsenal.
     */
    public pitching: Partial<Record<pitches_t, pitch_skill_t>> & {
        averaging: number[];
    } = {
        averaging: []
    };

    /**
     * Uniform number.
     */
    public number = 0;

    /**
     * Full name, English.
     */
    public name: string;
    /**
     * Full name, Japanese.
     */
    public nameJ: string = '';
    public surname: string;
    public surnameJ: string;

    /**
     * String representation of the objects in atBatObjects.
     */
    public atBats: string[] = [];
    /**
     * a list of at bat results {AtBat[]}
     */
    public atBatObjects: AtBat[] = [];

    /**
     * Used for color descriptors of the player's abilities: batter.
     */
    public definingBattingCharacteristic: multilingual_description_t = { e: '', n: '' };

    /**
     * Used for color descriptors of the player's abilities: pitcher.
     */
    public definingPitchingCharacteristic: multilingual_description_t = { e: '', n: '' };

    /**
     * Used for color descriptors of the player's abilities: most notable between offense/defense.
     */
    public definingCharacteristic: multilingual_description_t = { e: '', n: '' };

    /**
     * UI indicator when player is pitching.
     */
    public windingUp: boolean = false;

    public stats = {
        pitching: {
            pitches: 0, // in game
            GS: 0,
            W: 0,
            L: 0,
            strikes: 0, // in game
            K: 0, // in game
            K9: 0,
            getK9() {
                return this.K / (this.IP[0] / 9);
            },
            getERA() {
                const val = (9 * this.ER) / Math.max(1 / 3, this.IP[0] + this.IP[1] / 3);
                return (val + '00').slice(0, 4);
            },
            ERA: '0',
            ER: 0,
            H: 0, // in game
            HR: 0, // in game
            BB: 0, // in game
            IP: [0, 0],
            WHIP: 0,
            getWHIP() {
                return (this.H + this.BB) / (this.IP[0] ? this.IP[0] : 1);
            }
        },
        batting: {
            getBA() {
                return this.h / Math.max(1, this.ab);
            },
            getBABIP() {
                return (this.h - this.hr) / (this.ab - this.so - this.hr + this.sac);
            },
            ba: 0,
            getOBP() {
                return (this.h + this.bb + this.hbp) / (this.ab + this.bb + this.hbp + this.sac);
            },
            obp: 0,
            getSLG() {
                return (
                    (this.h -
                        this['2b'] -
                        this['3b'] -
                        this.hr +
                        2 * this['2b'] +
                        3 * this['3b'] +
                        4 * this.hr) /
                    this.ab
                );
            },
            slash: '',
            getSlash() {
                this.slash =
                    this.slash ||
                    [this.getBA() || '.---', this.getOBP(), this.getSLG()]
                        .map((x) => {
                            if (isNaN(Number(x))) return '.---';
                            if (x < 1) return `${x}0000`.slice(1, 5);
                            return `${x}0000`.slice(0, 5);
                        })
                        .join('/');
                return this.slash;
            },
            slg: '',
            pa: 0,
            ab: 0,
            so: 0,
            bb: 0,
            h: 0,
            '2b': 0,
            '3b': 0,
            hr: 0,
            r: 0,
            rbi: 0,
            hbp: 0,
            sac: 0,
            sb: 0,
            cs: 0,
            getPPA() {
                return this.ps / this.pa;
            },
            ps: 0,
            oSwings: 0,
            getOSwing() {
                return this.oSwings / this.swings;
            },
            zSwings: 0,
            getZSwing() {
                return this.zSwings / this.swings;
            },
            swings: 0,
            getSwing() {
                return this.swings / this.ps;
            },
            go: 0,
            fo: 0
        },
        fielding: {
            E: 0,
            PO: 0, // should depend on position
            A: Math.floor(Math.random() * 5) + 1 // ehh should depend on position
        }
    };

    /**
     * @param team \the team to assign the player to (bench).
     * @param hero \whether the player should be generated with higher-than-average skills.
     */
    constructor(public team: Team, hero?: boolean) {
        this.randomizeSkills(hero || Math.random() > 0.9);
        const surnameKey = Math.floor(Math.random() * data.surnames.length),
            nameKey = Math.floor(Math.random() * data.names.length);

        this.name = `${data.surnames[surnameKey]} ${data.names[nameKey]}`;
        const jSurname = data.surnamesJ[surnameKey],
            jGivenName = data.namesJ[nameKey];
        this.spaceName(jSurname, jGivenName);
        this.surname = data.surnames[surnameKey];
        this.surnameJ = data.surnamesJ[surnameKey];
        this.resetStats((this.team.game && this.team.game.gamesIntoSeason) || 72);
    }

    /**
     * Inserts the Japanese middle dot at the correct position, allowing a 4-width
     * name string.
     * @param jSurname - Japanese family name.
     * @param jGivenName - Japanese first name.
     */
    public spaceName(jSurname: string, jGivenName: string): void {
        if (jSurname.length === 1 && jGivenName.length <= 2) jSurname += '・';
        if (jGivenName.length === 1 && !jSurname.includes('・') && jSurname.length <= 2)
            jSurname += '・';
        this.nameJ = jSurname + jGivenName;
        this.surnameJ = jSurname;
    }

    /**
     * for websocket transfer.
     */
    public toData(): Player {
        const team = this.team;
        delete this.team;
        const data = JSON.parse(JSON.stringify(this));
        this.team = team;
        return data;
    }

    /**
     * @param data
     * inverts @see #toData()
     */
    public fromData(data: Player) {
        Object.assign(this, data);
        delete this.atBatObjects;
        this.getAtBats();
    }

    /**
     *
     * take over the other player's position and batting order immediately, sending him/her to the bench.
     * @param player - to replace this player.
     * @returns true on success.
     *
     */
    public substitute(player: Player): boolean {
        if (player.team !== this.team) return false;
        const order = player.order,
            position = player.position;
        player.team.substituted.push(player);
        player.team.positions[position as fielder_short_name_t] = this;
        player.team.lineup[order] = this;

        this.position = position;
        this.order = order;

        const game = this.team.game as Game;
        if (game.pitcher === player) game.pitcher = this;
        if (game.batter === player) game.batter = this;
        if (game.deck === player) game.deck = this;
        if (game.hole === player) game.hole = this;

        const field = game.field;
        if (field.first === player) field.first = this;
        if (field.second === player) field.second = this;
        if (field.third === player) field.third = this;

        const bench = this.team.bench,
            bullpen = this.team.bullpen;
        if (~bench.indexOf(this)) {
            bench.splice(bench.indexOf(this), 1);
        }
        if (~bullpen.indexOf(this)) {
            bullpen.splice(bullpen.indexOf(this), 1);
        }
        game.log.noteSubstitution(this, player);
        return true;
    }

    /**
     * Resets the player's statistics, randomized with regard for their skills.
     * @param gamesIntoSeason - how many games have been played, used for accumulative stats.
     */
    public resetStats(gamesIntoSeason = 72): void {
        const offense = this.skill.offense;
        const defense = this.skill.defense;
        const randBetween = (a: number, b: number, skill: string | number = '') => {
            let total = 0,
                count = 0;

            let skillNumber = 0;

            if (typeof skill === 'number') {
                total += skill;
                count += 1;
            } else {
                skill += '';
                if (!skill) skill = '';

                for (const skillKey of skill.split(' ')) {
                    if (offense[skillKey as keyof typeof offense])
                        skillNumber = offense[skillKey as keyof typeof offense];
                    if (defense[skillKey as keyof typeof defense])
                        skillNumber = defense[skillKey as keyof typeof defense];
                    if (isNaN(skillNumber)) skillNumber = 50;
                    total += skillNumber;
                    count++;
                }
            }

            skillNumber = Math.sqrt(0.05 + Math.random() * 0.95) * (total / (count * 0.97));
            return Math.floor((skillNumber / 100) * (b - a) + a);
        };
        let IP, ER, GS, W, L;
        if (this.skill.pitching > 65) {
            IP = ((this.skill.pitching - 65) * gamesIntoSeason) / 20;
            ER = ((IP / 9) * randBetween(800, 215, this.skill.pitching)) / 100;
            if (IP > gamesIntoSeason) {
                //starter
                GS = Math.floor(gamesIntoSeason / 5);
                W = randBetween(GS * 0.1, GS * 0.8, this.skill.pitching / 1.2);
                L = randBetween(GS - W, 0, this.skill.pitching / 3);
            } else {
                //reliever
                GS = Math.floor(gamesIntoSeason / 40);
                W = randBetween(0, GS * 0.6, this.skill.pitching);
                L = randBetween(GS - W, 0, this.skill.pitching);
            }
        } else {
            IP = 0;
            ER = 0;
            GS = 0;
            W = 0;
            L = 0;
        }
        const pa = randBetween(gamesIntoSeason * 3, gamesIntoSeason * 5, 'speed eye');
        let paRemaining = pa;
        const bb = Math.floor((randBetween(0, 18, 'power eye') * paRemaining) / 100);
        paRemaining -= bb;
        const ab = paRemaining;
        const so = Math.floor((randBetween(25, 2, 'eye') * paRemaining) / 100);
        paRemaining -= so;
        const h = Math.floor((randBetween(185, 372, 'eye power speed') * paRemaining) / 1000);
        paRemaining -= h;
        const sb = randBetween(0, (h + bb) / 6, 'speed') | 0;
        const cs = randBetween(sb, 0, 'speed eye') | 0;

        const doubles = randBetween(0, h / 4, 'power speed');
        const triples = randBetween(0, h / 12, 'speed');
        const hr = Math.max(0, randBetween(-h / 20, h / 5, 'power eye'));
        const r = randBetween(h / 8, (h + bb) / 3, 'speed') + hr;
        const rbi = randBetween(h / 8, h / 2, 'power eye') + hr;
        const hbp = randBetween(0, gamesIntoSeason / 25);
        const sac = randBetween(0, gamesIntoSeason / 5, 'eye');

        const chances = randBetween(gamesIntoSeason * 5, pa - bb - so - hr, 'fielding');
        const E = randBetween(chances / 10, 0, 'fielding');
        const PO = chances - E;

        const oSwings = randBetween(gamesIntoSeason * 9, gamesIntoSeason, 'eye');
        const zSwings = randBetween(gamesIntoSeason, gamesIntoSeason * 6, 'eye');
        const ps = randBetween(2 * pa, 4.2 * pa, 'eye'); // pitches seen.
        const swings = oSwings + zSwings;
        const go = randBetween((pa * 0.9) / 2, (pa * 0.7) / 2, 'eye');
        const fo = randBetween((pa * 0.9) / 2, (pa * 0.7) / 2, 'eye');

        Object.assign(this.stats.pitching, {
            pitches: 0, // in game
            GS,
            W,
            L,
            strikes: 0, // in game
            K: 0, // in game
            ERA: '0.00',
            ER,
            H: 0, // in game
            HR: 0, // in game
            BB: 0, // in game
            IP: [IP, 0],
            WHIP: 0
        });

        Object.assign(this.stats.batting, {
            ba: 0,
            obp: 0,
            slg: 0,
            pa,
            ab,
            so,
            bb,
            h,
            '2b': doubles,
            '3b': triples,
            hr,
            r,
            rbi,
            hbp,
            sac,
            sb,
            cs,
            ps,
            oSwings,
            zSwings,
            swings,
            go,
            fo
        });

        Object.assign(this.stats.fielding, {
            E,
            PO, // should depend on position
            A: Math.floor(Math.random() * 5) + 1 // ehh should depend on position
        });

        this.stats.pitching.ERA = this.stats.pitching.getERA();
        this.stats.pitching.K9 = this.stats.pitching.getK9();
        this.stats.pitching.WHIP = this.stats.pitching.getWHIP();
        this.stats.batting.ba = this.stats.batting.getBA();
    }

    public getAtBats(): AtBat[] {
        if (this.atBats.length > this.atBatObjects.length) {
            this.atBatObjects = this.atBats.map((item) => new AtBat(item));
        }
        return this.atBatObjects;
    }

    public recordRBI(): void {
        this.atBats[this.atBats.length - 1] += AtBat.RBI_INDICATOR;
    }

    public recordInfieldHit(): void {
        this.atBats[this.atBats.length - 1] += AtBat.INFIELD_HIT_INDICATOR;
    }

    /**
     * @returns seconds to get from base to base.
     */
    public getBaseRunningTime(): number {
        return Mathinator.baseRunningTime(this.skill.offense.speed);
    }

    /**
     * live game steal.
     * @param game
     * @param base
     * @returns self.
     */
    public attemptSteal(game: Game, base: 1 | 2 | 3 | 4): Player {
        const pitch = game.pitchInFlight;
        const success = Distribution.stealSuccess(
            pitch as pitch_in_flight_t,
            game.pitcher.team.positions.catcher,
            this,
            base,
            this.team.stealAttempt === Team.RUNNERS_DISCRETION
        );
        if (success) {
            game.swingResult.stoleABase = this.order;
            game.swingResult.caughtStealing = undefined;
        } else {
            game.swingResult.stoleABase = undefined;
            game.swingResult.caughtStealing = this.order;
        }
        let _base: base_name_t;
        switch (base) {
            case 1:
                _base = '1st';
                break;
            case 2:
                _base = '2nd';
                break;
            case 3:
                _base = '3rd';
                break;
            case 4:
                _base = 'Home';
        }
        game.swingResult.attemptedBase = _base;
        return this;
    }

    /**
     * used for other calculations/orderings
     * @returns
     */
    public defensiveAverage(): player_skill_t {
        const defense = this.skill.defense;
        return (defense.speed + defense.fielding + defense.throwing) / 3;
    }

    /**
     * randomizes the player's skills, usually called at init.
     * @param hero - assign above-average skills.
     * @param allPitches - give the player all pitch types.
     */
    public randomizeSkills(hero: boolean, allPitches?: boolean): void {
        this.hero = hero;
        const giraffe = this;
        const randValue = (isPitching?: boolean) => {
            let value = Math.floor(Math.pow(Math.random(), 0.75) * 80 + Math.random() * 20);
            if (hero) {
                value += Math.floor((100 - value) * Math.max(Math.random(), isPitching ? 0 : 0.65));
            }
            if (isPitching) giraffe.pitching.averaging.push(value);
            return value;
        };
        this.skill.offense = {
            eye: randValue(),
            power: randValue(),
            speed: randValue()
        };
        this.skill.defense = {
            catching: randValue(),
            fielding: randValue(),
            speed: randValue(),
            throwing: randValue()
        };
        this.pitching.averaging = [];
        this.pitching['4-seam'] = {
            velocity: randValue(true),
            break: randValue(true),
            control: randValue(true)
        };
        this.pitching.slider = {
            velocity: randValue(true),
            break: randValue(true),
            control: randValue(true)
        };
        if (Math.random() < 0.85 || allPitches) {
            // can pitch!
            if (Math.random() > 0.6 || allPitches) {
                this.pitching['2-seam'] = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.18 || allPitches) {
                this.pitching.fork = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() > 0.77 || allPitches) {
                this.pitching.cutter = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }
            if (Math.random() < 0.21 || allPitches) {
                this.pitching.sinker = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.4 || allPitches) {
                this.pitching.curve = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }

            if (Math.random() < 0.9 || allPitches) {
                this.pitching.change = {
                    velocity: randValue(true),
                    break: randValue(true),
                    control: randValue(true)
                };
            }
        }

        const averages = this.pitching.averaging.sort((a, b) => b - a).slice(0, 4);
        const pitchingAverage = averages.reduce((a, b) => a + b) / 4;

        this.skill.pitching = Math.floor(pitchingAverage);
        delete this.pitching.averaging;
    }

    /**
     * language-sensitive
     * @returns family name.
     */
    public getSurname(): string {
        return text.mode === 'n' ? this.surnameJ : this.surname;
    }

    /**
     * @returns language-sensitive full name.
     */
    public getName(): string {
        return text.mode === 'n' ? this.nameJ : this.name;
    }

    public getUniformNumber(): string {
        return text('#') + this.number;
    }

    /**
     * language-sensitive, for text representation of batting order
     */
    public getOrder(): string {
        return text(
            [' 1st', ' 2nd', ' 3rd', ' 4th', ' 5th', ' 6th', '7th', ' 8th', ' 9th'][this.order]
        );
    }

    /**
     * Where positive is an early swing and negative is a late swing.
     * @returns in milliseconds between -200ms and 200ms
     */
    public getAISwingTiming(): number {
        return (
            (Math.random() - 0.5) *
            280 *
            (60 / (60 + this.skill.offense.eye)) *
            ((200 - this.lastPitchCertainty) / (200 + this.lastPitchCertainty) || 1)
        );
    }

    /**
     * a localized description of this player's defining batting characteristic e.g. "contact hitter"
     */
    public getDefiningBattingCharacteristic(): string {
        if (!this.definingBattingCharacteristic[text.mode]) {
            this.definingBattingCharacteristic[text.mode] = this.getDefiningCharacteristic(true);
        }
        return this.definingBattingCharacteristic[text.mode];
    }

    /**
     * @returns a localized description of this player's defining pitching characteristic e.g. "control pitcher"
     */
    public getDefiningPitchingCharacteristic(): string {
        if (!this.definingPitchingCharacteristic[text.mode]) {
            this.definingPitchingCharacteristic[text.mode] = this.getDefiningCharacteristic(
                false,
                true
            );
        }
        return this.definingPitchingCharacteristic[text.mode];
    }

    /**
     * @param [battingOnly] to return only their defining batting characteristic.
     * @param [pitchingOnly] to return only a pitching characteristic.
     * @returns a localized phrase describing a strong trait of this player e.g. "ace" or "power hitter".
     */
    public getDefiningCharacteristic(battingOnly?: boolean, pitchingOnly?: boolean): string {
        if (this.definingCharacteristic[text.mode] && !battingOnly) {
            return this.definingCharacteristic[text.mode];
        }
        let out = '';
        const o = this.skill.offense,
            d = this.skill.defense,
            pitcherRating = this.skill.pitching;
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

        const sum = (x: number[]) => x.reduce((a, b) => a + b);

        let pitching = [0, 0, 0]; // control, speed, break
        const pitchingKeys = Object.keys(p);
        pitchingKeys.map((x) => {
            const _pitch: pitch_skill_t = (p[x as pitches_t] as unknown) as pitch_skill_t;
            pitching[0] += _pitch.control;
            pitching[1] += _pitch.velocity;
            pitching[2] += _pitch.break;
        });
        const pitches = pitchingKeys.length;
        pitching = pitching.map((x) => (x / pitches) | 0);

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
            if (battingOnly || sum([offense[0] * 2, offense[1] * 0.5, offense[2]]) > sum(defense)) {
                if (offense[0] > 98 || sum(offense) > ELITE * 3) {
                    out = text('Genius batter');
                } else if (offense[1] > EXCELLENT && offense[1] > offense[0]) {
                    out = text('Power hitter');
                } else if (offense[0] > EXCELLENT) {
                    out = text('Contact');
                } else if (offense[2] > EXCELLENT) {
                    out = text('Speedster');
                } else if (offense[0] < INEPT || sum(offense) < POOR * 3) {
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
        return (this.definingCharacteristic[text.mode] = out);
    }

    /**
     * to ease comparison in Angular (?)
     */
    public toString(): string {
        return `${this.name} #${this.number}`;
    }
}

export { Player };
