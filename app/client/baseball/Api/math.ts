/**
 * Degrees such that 360 is one circle.
 */
export type degrees_t = number;

export type feet_t = number;
export type seconds_t = number;
export type mph_t = number;

// feet per second
export type fps_t = number;
// feet per second per second
export type fpss_t = number;

/**
 * -45 to 45, batting splay angle, 0 is up the middle and 45 is first base foul line.
 */
export type splay_t = degrees_t;

/**
 * 0 line drive, 90 vertical pop up.
 */
export type fly_angle_t = degrees_t;

/**
 * 0 to 1.
 */
export type ratio_t = number;

/**
 * 0 to 100.
 */
export type probability_t = number;

/**
 * 0 to 1.
 */
export type probability_ratio_t = ratio_t;
