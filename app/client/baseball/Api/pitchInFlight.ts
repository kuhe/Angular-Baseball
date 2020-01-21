import { pitches_t } from './pitches';
import { player_skill_t } from './player';

/**
 * Two dimensional coordinate. Usually means something is scaled to the
 * 200 x 200 size of the pitch zone.
 */
export type cartesian_coordinate_t = {
    x: axis_t;
    y: axis_t;
};

/**
 * A number that is on the same scale as the 200 x 200 pitch zone.
 */
export type axis_t = number;

/**
 * [t, r] where r is the distance from the center, and theta is the angle in degrees (not radians).
 */
export type polar_coordinate_reversed_t = [number, number];

/**
 * @see polar_coordinate_reversed_t
 * [r, t]
 */
export type polar_coordinate_t = [number, number];

/**
 * (0, 0) is the center of the strike zone.
 * The pitch zone is 200 x 200 and the strike zone is ... smaller than that.
 * {@link Distribution#inStrikezone}
 */
export type strike_zone_coordinate_t = cartesian_coordinate_t;

/**
 * Describes a pitch thrown by the pitcher (not an abstract pitch, as in "that guy's fastball is strong")
 * Paired with a {@link swing_result_t} describes every pitch and reaction during the game.
 */
export type pitch_in_flight_t = {
    name: pitches_t;
    breakDirection: [axis_t, axis_t];
    velocity: player_skill_t;
    break: player_skill_t;
    control: player_skill_t;
} & strike_zone_coordinate_t;
