/**
 * 0 to 100, though may exceed 100 in exceptional cases.
 * Most mathematical calculations expect a max of 100, however.
 */
export type player_skill_t = number;

/**
 * @see player_skill_t
 * As a ratio of 1.
 */
export type player_skill_decimal_t = number;
