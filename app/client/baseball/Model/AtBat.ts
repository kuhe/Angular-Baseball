import { Log } from '../Utility/Log';

/**
 *
 * e.g. "HR++" (HR and 2 extra runs), "SO" strikeout, "FO" flyout.
 * String formatting encapsulation for an at-bat.
 *
 */
class AtBat {
    public static readonly INFIELD_HIT_INDICATOR: string = '';
    public static readonly RBI_INDICATOR: string = '+';

    public infield: string;
    public text: string;
    public rbi: string;
    public beneficial: boolean = false;

    constructor(text: string) {
        this.infield = text.includes(AtBat.INFIELD_HIT_INDICATOR)
            ? AtBat.INFIELD_HIT_INDICATOR
            : '';
        text = text.replace(AtBat.INFIELD_HIT_INDICATOR, '');
        this.text = text.split(AtBat.RBI_INDICATOR)[0];
        this.rbi = `${text.split(this.text)[1] || ''}`;

        const beneficial = [
            Log.WALK,
            Log.SINGLE,
            Log.HOMERUN,
            Log.DOUBLE,
            Log.TRIPLE,
            Log.SACRIFICE,
            Log.REACHED_ON_ERROR,
            Log.STOLEN_BASE,
            Log.RUN
        ];
        if (~beneficial.indexOf(this.text)) {
            this.beneficial = true;
        }
    }
    toString() {
        return `${this.infield}${this.text}${this.rbi}`;
    }
}

export { AtBat };
