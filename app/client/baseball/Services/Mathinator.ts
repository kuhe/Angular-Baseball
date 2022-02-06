import {
    cartesian_coordinate_t,
    polar_coordinate_reversed_t,
    strike_zone_coordinate_t
} from '../Api/pitchInFlight';
import { player_skill_decimal_t, player_skill_t } from '../Api/player';
import { Player } from '../Model/Player';
import {degrees_t, feet_t, fly_angle_t, splay_t} from '../Api/math';

/**
 *
 * For Math!
 *
 */
class Mathinator {
    public static readonly RADIAN = Math.PI / 180;
    public static readonly SPLAY_INDICATOR_LEFT = -4;
    public static memory: Record<string, number | boolean> = {};

    /**
     *
     * Derives the angular offset of the bat in consideration with
     * its location in the strikezone. This is used for batting.
     *
     */
    public static getAngularOffset(
        offset: cartesian_coordinate_t,
        angle: number
    ): cartesian_coordinate_t {
        const xScalar = offset.x < 0 ? -1 : 1,
            yScalar = offset.y < 0 ? -1 : 1;
        const originalAngle = Math.atan(offset.x / offset.y) / this.RADIAN;
        const distance = Math.sqrt(offset.x * offset.x + offset.y * offset.y),
            angledY = yScalar * Math.cos((angle - originalAngle) * this.RADIAN) * distance,
            angledX = xScalar * Math.sqrt(distance * distance - angledY * angledY);
        return {
            x: angledX,
            y: angledY
        };
    }

    /**
     * Note the polar coordinates are non-standard.
     * @param a - [degrees, distance]
     * @param b - [degrees, distance]
     * @returns polar distance.
     */
    public static getPolarDistance(
        a: polar_coordinate_reversed_t,
        b: polar_coordinate_reversed_t
    ): number {
        const radians = this.RADIAN;
        return Math.sqrt(
            a[1] * a[1] + b[1] * b[1] - 2 * a[1] * b[1] * Math.cos(a[0] * radians - b[0] * radians)
        );
    }

    /**
     * Calculate bat angle for UI display during batting.
     *
     * @returns
     * 0 is flat (left-right), positive is clockwise.
     * We use 125 instead of 180 to account for natural hand-height adjustments
     * of various swing heights.
     */
    public static battingAngle(
        origin: strike_zone_coordinate_t,
        target: strike_zone_coordinate_t
    ): number {
        return (Math.atan((origin.y - target.y) / (target.x - origin.x)) / Math.PI) * 125;
    }

    /**
     * @param percent - 0-100
     * @param quarter - seconds
     * @param step - 0 and up
     * @param [givenApexHeight] feet
     * @param [givenDistance] in feet
     * @param [givenSplayAngle] where 0 is up the middle and 90 is right foul
     * @returns tween values.
     */
    public static transitionalTrajectory(
        percent: number,
        quarter: number,
        step: number,
        givenApexHeight?: number,
        givenDistance?: number,
        givenSplayAngle?: number
    ) {
        if (givenApexHeight) Mathinator.memory.apexHeight = givenApexHeight;
        if (givenDistance) Mathinator.memory.distance = givenDistance;
        if (givenSplayAngle) Mathinator.memory.splay = givenSplayAngle;
        const apexHeight = Mathinator.memory.apexHeight as number,
            distance = Mathinator.memory.distance as number,
            splay = Mathinator.memory.splay as number;
        let bottom, left, padding, borderWidth;
        const bounding = Mathinator.memory.bounding,
            radian = this.RADIAN;

        if (bounding) {
            quarter *= 4;
            percent = Math.floor(Math.sqrt(percent / 100) * 100);
        }

        bottom = (((Math.cos(splay * radian) * percent) / 100) * distance * 95) / 300;
        left =
            (((Math.sin(splay * radian) * percent) / 100) * distance * 95) / 300 +
            this.SPLAY_INDICATOR_LEFT;

        const apexRatio = Math.sqrt((50 - Math.abs(percent - 50)) / 100) * (1 / 0.7071);
        if (bounding) {
            padding = 1;
            borderWidth = 1;
        } else {
            padding = ((apexRatio * apexHeight) / 90) * 15;
            borderWidth = 2 + apexRatio * 2;
        }
        bottom = Math.max(Math.min(bottom, 400), -20);
        left = Math.max(Math.min(left, 100), -100);
        padding = Math.max(Math.min(padding, 12), 0);

        const { Power4, Linear } = TweenMax;

        return {
            bottom,
            left,
            padding,
            borderWidth,
            delay: quarter * step,
            ease: bounding ? Power4.easeOut : Linear.easeNone
        };
    }

    /**
     * @param distance - travel distance for the fielder (not the batted ball).
     * @param throwing - skill rating 0-1.
     * @param fielding - skill rating 0-1.
     * @param intercept - approx. -140 to 140
     * @returns seconds taken by the fielder to get the batted ball thrown to a base.
     */
    public static fielderReturnDelay(
        distance: feet_t,
        throwing: player_skill_decimal_t,
        fielding: player_skill_decimal_t,
        intercept: number
    ): number {
        const distanceContribution = distance / 60;
        return (
            distanceContribution + // bip distance (up to 3s+)
            (6 *
            (distance / 310) * // worst case time to reach the ball,
                Math.min(intercept - 120, 0)) /
                -240 + // a good intercept rating will cut the base down to 0
            1 -
            (1.8 + fielding * 0.8) + // gather time (up to 1.8s)
            distanceContribution / (0.5 + throwing / 2) // throwing distance (up to 2s)
        );
    }

    /**
     * @param player - a fielder.
     * @returns approximately 2 seconds, accounting for skills.
     */
    public static infieldThrowDelay(player: Player): number {
        const fielding = player.skill.defense.fielding,
            throwing = player.skill.defense.throwing;
        return 3.5 - (fielding + throwing) / 200;
    }

    /**
     * @param speed - 0-100
     * @returns seconds
     */
    public static baseRunningTime(speed: player_skill_t) {
        return 7.0 - (speed / 100) * 4.1;
    }

    /**
     * @param x - bat offset
     * @param y - bat offset
     * @param angle - batting angle where 0 is horizontal, RHB clockwise increasing
     * @param eye - 0 - 100 skill rating
     * @param timing - milliseconds early
     * @param lefty - whether the batter is lefty
     *
     * @returns {
     *   splay: -90 to 90 where 0 is up the middle,
     *   fly: 0, flat, to 90, vertical pop up
     * }
     */
    public static getSplayAndFlyAngle(
        x: number,
        y: number,
        angle: degrees_t,
        eye: player_skill_t,
        timing: number,
        lefty: boolean
    ): { splay: splay_t; fly: fly_angle_t } {
        const pullDirection = lefty ? 1 : -1;
        // Let's say that you have a 100ms window in which to hit the ball fair, with an additional 40ms for
        // playing this game interface.
        // With this formula, 140ms early will pull the ball by ~50 degrees
        let pull = pullDirection * ((50 / 140) * timing + Math.random() * 10 * (100 / (50 + eye)));

        pull /= Math.abs(100 / (100 + angle)); // diluted by angle

        const splay = -1.5 * x - (y * angle) / 20 + pull;

        const initialFlyAngle = 5 + (-3.5 * y);
        const flyVerticalScalar = initialFlyAngle > 0 ? 1 : -1;
        const fly = 30 +
            flyVerticalScalar * (
                Math.pow(
                    0.01 + Math.abs(initialFlyAngle - 30), 0.75
                )
            );

        return {
            splay,
            fly
        };
    }

    /**
     * @param velocityRating - 0-100
     * @param velocityScalar - approx 1
     * @returns seconds in the air for a pitched ball.
     */
    public static getFlightTime(velocityRating: player_skill_t, velocityScalar: number) {
        return (1.3 - (0.6 * (velocityRating + 300)) / 400) / velocityScalar;
    }
}

export { Mathinator };

declare var TweenMax: {
    Power4: {
        easeOut: string;
    };
    Linear: {
        easeNone: string;
    };
};
