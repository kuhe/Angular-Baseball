/**
 * Describes how an out occurred, or false if no out was recorded.
 */
export type out_by_t =
    | 'fieldersChoice'
    | 'line'
    | 'fly'
    | 'error'
    | 'pop'
    | 'ground'
    | 'thrown'
    | false;
