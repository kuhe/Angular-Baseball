import { helper } from '../Utility/helper';
import { Player } from '../Model/Player';
import { player_skill_t } from '../Api/player';
import { feet_t, fly_angle_t, probability_t, ratio_t } from '../Api/math';
import { count_t } from '../Api/count';
import { axis_t, pitch_in_flight_t, strike_zone_coordinate_t } from '../Api/pitchInFlight';
import { Umpire } from '../Model/Umpire';
const pitchDefinitions = helper.pitchDefinitions;

const { random, min, max, floor, ceil, abs, pow, sqrt } = Math;

/**
 * For Probability!
 */
class Distribution {
    /**
     * @param fielder
     * @returns fielder commits error.
     */
    public static error(fielder: Player): boolean {
        return (100 - fielder.skill.defense.fielding) * 0.1 + 3.25 > random() * 100;
    }

    /**
     * @param power
     * @param flyAngle
     * @param x - batting offset horizontal
     * @param y - batting offset vertical
     * @returns landing distance. 310 is usually considered the outfield fence distance, beyond which is a home run.
     */
    public static travelDistance(
        power: player_skill_t,
        flyAngle: fly_angle_t,
        x: number,
        y: number
    ): number {
        x = min(5, abs(x) | 0);
        y = min(5, abs(y) | 0);
        const goodContactBonus = 8 - sqrt(x * x + y * y);

        const randomScalar = pow(random(), 1 - goodContactBonus * 0.125);
        const staticPowerContribution = power / 300;
        const randomPowerContribution = random() * power;

        /**
         * The launch angle scalar should ideally be around these values based on flyAngle.
         * 0 -> liner that goes no farther than infield.
         * 10 -> max 120 or so
         * 30 to 45 -> any distance
         * over 50 -> risk of pop fly
         */
        const launchAngleScalar =
            flyAngle > 0
                ? Math.pow(1 - abs(flyAngle - 30) / 60, 2)
                : 0.5 * Math.pow(1 - abs(flyAngle) / 90, 2);

        const initialDistance: feet_t =
            (10 + randomScalar * 320 + staticPowerContribution + randomPowerContribution) *
            launchAngleScalar;

        let distance: feet_t;

        // if the distance is below 110, an infielder will advance to meet the ball.
        if (initialDistance < 110) {
            distance = initialDistance * 0.25 + 110 * 0.75;
        } else {
            distance = initialDistance;
        }

        // console.log('distance debug', {
        //     scalar: randomScalar, staticPowerContribution,
        //     randomPowerContribution,
        //     launchAngleScalar,
        //     initialDistance,
        //     distance
        // })

        return distance;
    }

    /**
     * Selects a pitch location for the AI based on the count.
     * Higher strikes in the count go for corners,
     * higher balls in the count go for strikes.
     *
     * @param count {{strikes: number, balls: number}}
     * @returns strike zone coord.
     */
    public static pitchLocation(count: count_t): strike_zone_coordinate_t {
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
    }

    /**
     * swing centering basis, gives number near 100.
     * @returns 100 +/- 15.
     */
    public static centralizedNumber() {
        return 100 + floor(random() * 15) - floor(random() * 15);
    }

    /**
     * @param eye - batter skill
     * @param x
     * @param y
     * @param umpire
     * @param certainty - -100 to 100 relative certainty of pitch location by the batter.
     *                             negative indicates wrongful certainty (fooled).
     * @returns - on scale of 100.
     */
    public static swingLikelihood(
        eye: player_skill_t,
        x: axis_t,
        y: axis_t,
        umpire: Umpire,
        certainty: number = 50
    ) {
        /**
         * Initially the batter may have planned on whether or not to swing
         * before seeing the pitch, depending on the count, for example.
         */
        let planToSwing: probability_t;
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
         * 0 - 100.
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
                    (positionalLikelihood * 0 +
                        eyeEvaluatedSwingLikelihood * 99 +
                        abs(certainty) * 0) /
                    100;
            }
        }

        return finalSwingLikelihood;
    }

    /**
     * @param target - 0-200
     * @param control - 0-100
     * @returns closer to the target for higher control skill.
     */
    public static pitchControl(target: axis_t, control: player_skill_t): axis_t {
        const effect = (50 - random() * 100) / (1 + control / 100);
        return min(199.9, max(0.1, target + effect));
    }

    /**
     * @param pitch - contains breaking direction information.
     * @param pitcher - for skill reference with the given pitch.
     * @param x - original target.
     * @param y - original target.
     *
     * @returns map of x and y params to the new strike zone coordinate as modified by the breaking direction.
     *
     * 0.5 to 1.5 of the pitch's nominal breaking effect X
     * 0.5 to 1.5 of the pitch's nominal breaking effect Y, magnified for lower Y
     */
    public static breakEffect(
        pitch: pitch_in_flight_t,
        pitcher: Player,
        x: axis_t,
        y: axis_t
    ): strike_zone_coordinate_t {
        const effect: strike_zone_coordinate_t = {
            x: 0,
            y: 0
        };
        const pitchStats = pitcher.pitching[pitch.name] || { break: 0 };
        effect.x = floor(
            x + pitch.breakDirection[0] * (0.5 + 0.5 * random() + pitchStats.break / 200)
        );
        effect.y = floor(
            y +
                pitch.breakDirection[1] *
                    ((0.5 + 0.5 * random() + pitchStats.break / 200) / (0.5 + y / 200))
        );
        return effect;
    }

    /**
     * Determine the swing target along an axis for CPU based on batting eye skill.
     * @param target - 0-200
     * @param actual - 0-200
     * @param eye - 0-100
     * @param timing - whether timing affects the distribution.
     * @returns - 0-200
     */
    public static cpuSwing(
        target: axis_t,
        actual: axis_t,
        eye: player_skill_t,
        timing?: boolean
    ): axis_t {
        eye = min(eye, 100); // higher eye would overcompensate here
        const targetEyeFactor = (target * random() * eye) / 100;
        const randomnessFactor = 100 * (random() - 0.5);
        const timingFactor = timing ? (50 * (400 * (random() - 0.5))) / (100 + eye) : 0;
        const scalarFactor = 0.85;

        return (targetEyeFactor + randomnessFactor + timingFactor - actual) * scalarFactor;
    }

    /**
     * @param x - 0-200.
     * @param y - 0-200.
     * @returns whether location is in strike zone.
     */
    public static inStrikezone(x: axis_t, y: axis_t): boolean {
        return x > 50 && x < 150 && y > 35 && y < 165;
    }

    /**
     * Determine the swing (auto-aim) scalar.
     * @param eye - 0-100 batter skill.
     * @returns a ratio type that decreases swing location disparity for better eye skill.
     */
    public static swing(eye: player_skill_t): ratio_t {
        return 1.0 - (eye / 1000 + random());
    }

    /**
     * @param pitch - from Game pitchInFlight.
     * @param catcher - on defense.
     * @param thief - runner.
     * @param base - 1,2,3,4 where 4 is home.
     * @param volitional - whether the runner wanted to steal.
     * @returns true for successful steal.
     */
    public static stealSuccess(
        pitch: pitch_in_flight_t,
        catcher: Player,
        thief: Player,
        base: 1 | 2 | 3 | 4,
        volitional?: boolean
    ): boolean {
        let rand = random();
        const rand2 = random();

        if (base == 4) {
            rand = rand / 100;
        }

        const smoothedRand2 = (1 + rand2) / 2;

        const pitchBaseSpeedMultiplier = (pitchDefinitions[pitch.name] || ['', '', 0.6])[2];

        return (
            (Number(volitional) * 35 + thief.skill.offense.eye + (base * -25 + 45)) * rand +
                10 +
                thief.skill.offense.speed * 2 -
                thief.fatigue >
            pitchBaseSpeedMultiplier * pitch.velocity * smoothedRand2 +
                (catcher.skill.defense.catching + catcher.skill.defense.throwing) * rand2
        );
    }

    /**
     * @param pitch - game pitch in flight.
     * @param catcher
     * @param thief
     * @param base - 1,2,3,4 where 4 is home.
     * @returns player will attempt to steal.
     */
    public static willSteal(
        pitch: pitch_in_flight_t,
        catcher: Player,
        thief: Player,
        base: 1 | 2 | 3 | 4
    ): boolean {
        if (base == 4) return false;
        return (
            random() < 0.15 &&
            this.stealSuccess(pitch, catcher, thief, base, false) &&
            random() < 0.5
        );
    }

    /**
     * Test block.
     */
    public static main(): void {
        const ump = {
            count: {
                balls: 0,
                strikes: 0
            }
        } as Umpire;
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
    }
}

export { Distribution };
