import { helper } from '../Utility/helper';
const pitchDefinitions = helper.pitchDefinitions;

const { random, min, max, floor, ceil, abs, pow, sqrt } = Math;

/**
 * For Probability!
 * @constructor
 */
const DistributionCtor = function() {};

const Distribution = Object.assign(DistributionCtor, {
    identifier: 'Distribution',
    constructor: DistributionCtor,
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
        return (100 - fielder.skill.defense.fielding) * 0.1 + 3.25 > random() * 100;
    },
    /**
     * @param power
     * @param flyAngle
     * @param x {number} batting offset horizontal
     * @param y {number} batting offset vertical
     * @returns {number}
     */
    landingDistance(power, flyAngle, x, y) {
        x = min(5, abs(x) | 0);
        y = min(5, abs(y) | 0);
        const goodContactBonus = 8 - sqrt(x * x + y * y);

        const scalar = pow(random(), 1 - goodContactBonus * 0.125);
        const staticPowerContribution = power / 300;
        const randomPowerContribution = (random() * power) / 75;

        /**
         * The launch angle scalar should ideally be around these values based on flyAngle.
         * 0 -> liner that goes no farther than infield.
         * 10 -> max 120 or so
         * 30 to 45 -> any distance
         * over 50 -> risk of pop fly
         * @type {number}
         */
        const launchAngleScalar =
            (1 - abs(flyAngle - 30) / 60) *
            (1 - ((10 - Math.max(Math.min(10, flyAngle), -10)) / 20) * 0.83);

        return (
            (10 + scalar * 320 + staticPowerContribution + randomPowerContribution * 150) *
            launchAngleScalar
        );
    },
    /**
     * @param count {{strikes: number, balls: number}}
     * @returns {{x: number, y: number}}
     */
    pitchLocation(count) {
        let x, y;
        if (random() < 0.5) {
            x = 50 + floor(random() * 90) - floor(random() * 30);
        } else {
            x = 150 + floor(random() * 30) - floor(random() * 90);
        }
        y = 30 + (170 - floor(sqrt(random() * 28900)));

        const sum = count.strikes + count.balls + 3;

        x = ((3 + count.strikes) * x + count.balls * 100) / sum;
        y = ((3 + count.strikes) * y + count.balls * 100) / sum;

        return { x, y };
    },
    /**
     * swing centering basis, gives number near 100.
     * @returns {number}
     */
    centralizedNumber() {
        return 100 + floor(random() * 15) - floor(random() * 15);
    },
    /**
     * @param eye {Player.skill.offense.eye}
     * @param x
     * @param y
     * @param {Umpire} umpire
     * @param {number} certainty - -100 to 100 relative certainty of pitch location by the batter.
     *                             negative indicates wrongful certainty (fooled).
     * @returns {number} on scale of 100.
     */
    swingLikelihood: function(eye, x, y, umpire, certainty = 50) {
        /**
         * Initially the batter may have planned on whether or not to swing
         * before seeing the pitch, depending on the count, for example.
         * @type {number} scale to 1.
         */
        let planToSwing = 30;
        const count = String(umpire.count.balls) + String(umpire.count.strikes);
        switch (count) {
            case '01':
                planToSwing = 65;
                break; // saw a pitch, ready to swing.
            case '02':
                planToSwing = 70;
                break; // expecting a waste pitch.
            case '10':
                planToSwing = 55;
                break; // saw a pitch, ready to swing.
            case '11':
                planToSwing = 70;
                break; // no particular strategy.
            case '12':
                planToSwing = 90;
                break; // defensive on 2 strikes, but maybe waste pitch.
            case '20':
                planToSwing = 50;
                break; // waiting on a strike, ahead in count.
            case '21':
                planToSwing = 60;
                break; // no particular strategy.
            case '22':
                planToSwing = 110;
                break; // defensive on 2 strikes.
            case '30':
                planToSwing = 10;
                break; // expecting a walk.
            case '31':
                planToSwing = 40;
                break; // waiting for a good pitch.
            case '32':
                planToSwing = 130;
                break; // all in.
            case '00':
            default:
                planToSwing = 33;
                break;
        }

        // @todo consider number of outs or runners in position.

        if (umpire.game.field.second || umpire.game.field.third) {
            planToSwing += 20; // RISP increases desire to swing.
        }

        /**
         * Positional likelihood based on where the pitch location is perceived to be.
         * @type {number}
         */
        const positionalLikelihood = (180 - abs(100 - x) - abs(100 - y)) / 2;

        const inStrikezone = Distribution.inStrikezone(x, y);

        if (!inStrikezone) {
            // ball
            /** based on avg O-Swing of 30%, decreased by better eye */
            var eyeEvaluatedSwingLikelihood = 30 - eye * 0.3;
        } else {
            /** based on avg Z-Swing of 65%, increased by better eye */
            eyeEvaluatedSwingLikelihood = 65 + eye * 0.3;
        }

        const swingLikelihood =
            (positionalLikelihood * 30 +
                eyeEvaluatedSwingLikelihood * 40 +
                planToSwing * 20 +
                abs(certainty) * 10) /
            100;

        const reflex = random() * 100 < eye;
        let finalSwingLikelihood = swingLikelihood;

        if (reflex) {
            // Roll reflex to be able to override the initial impulse, making a purely reflexive decision to swing.
            if (
                (eyeEvaluatedSwingLikelihood > planToSwing && inStrikezone) ||
                (eyeEvaluatedSwingLikelihood < planToSwing && !inStrikezone)
            ) {
                // the planning (guess) component is removed from the swing decision.

                finalSwingLikelihood =
                    (positionalLikelihood * 20 +
                        eyeEvaluatedSwingLikelihood * 70 +
                        abs(certainty) * 10) /
                    100;
            }
        }

        return finalSwingLikelihood;
    },
    /**
     * @param target {number} 0-200
     * @param control {number} 0-100
     * @returns {number}
     */
    pitchControl(target, control) {
        const effect = (50 - random() * 100) / (1 + control / 100);
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
        effect.x = floor(
            x +
                pitch.breakDirection[0] *
                    (0.5 + 0.5 * random() + pitcher.pitching[pitch.name].break / 200)
        );
        effect.y = floor(
            y +
                pitch.breakDirection[1] *
                    ((0.5 + 0.5 * random() + pitcher.pitching[pitch.name].break / 200) /
                        (0.5 + y / 200))
        );
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
        return 100 + (target - 100) * (0.5 + (random() * eye) / 200) - actual;
    },
    /**
     * @param {number} x - 0-200.
     * @param {number} y - 0-200.
     * @returns {boolean}
     */
    inStrikezone(x, y) {
        return x > 50 && x < 150 && y > 35 && y < 165;
    },
    /**
     * Determine the swing scalar
     * @param eye {number} 0-100
     * @returns {number}
     */
    swing(eye) {
        return 100 / (eye + 25 + random() * 50);
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
            rand = rand / 100;
        }

        const smoothedRand2 = (1 + rand2) / 2;

        const pitchBaseSpeedMultiplier = (pitchDefinitions[pitch.name] || ['', '', 0.6])[2];

        return (
            ((volitional | 0) * 35 + thief.skill.offense.eye + (base * -25 + 45)) * rand +
                10 +
                thief.skill.offense.speed * 2 -
                thief.fatigue >
            pitchBaseSpeedMultiplier * pitch.velocity * smoothedRand2 +
                (catcher.skill.defense.catching + catcher.skill.defense.throwing) * rand2
        );
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
        return (
            random() < 0.15 &&
            this.stealSuccess(pitch, catcher, thief, base, false) &&
            random() < 0.5
        );
    }
});

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
            console.log(
                'middle',
                [15, 35, 55, 75, 95].map((x) => {
                    return Distribution.swingLikelihood(x, 100, 100, ump) | 0;
                })
            );
            console.log(
                'corner',
                [15, 35, 55, 75, 95].map((x) => {
                    return Distribution.swingLikelihood(x, 50, 50, ump) | 0;
                })
            );
            console.log(
                'ball',
                [15, 35, 55, 75, 95].map((x) => {
                    return Distribution.swingLikelihood(x, 15, 15, ump) | 0;
                })
            );
            ump.count.strikes++;
        }
        ump.count.balls++;
        ump.count.strikes = 0;
    }
};

export { Distribution };
