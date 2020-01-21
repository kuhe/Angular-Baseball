import { player_skill_t } from './player';

export type fastball_t = '4-seam' | '2-seam' | 'cutter' | 'sinker';

export type breaking_ball_t = 'slider' | 'fork' | 'curve' | 'change';

export type changeup_t = 'change';

/**
 *
 * Enum for pitch type keys.
 *
 */
export type pitches_t = fastball_t | breaking_ball_t | changeup_t;

/**
 * Describes a player's ability with a single pitch type.
 */
export type pitch_skill_t = {
    velocity: player_skill_t;
    break: player_skill_t;
    control: player_skill_t;
};
