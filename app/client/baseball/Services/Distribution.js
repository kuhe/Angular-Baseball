import { helper } from '../Utility/helper';
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

export { Distribution }