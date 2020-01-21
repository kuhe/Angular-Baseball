import { Log } from '../Utility/Log';

/**
 *
 * e.g. "HR++" (HR and 2 extra runs), "SO" strikeout, "FO" flyout
 * string formatting encapsulation for an at-bat.
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
        this.rbi = `${text.split(this.text)[1]}`;

        const log = new Log();

        const beneficial = [
            log.WALK,
            log.SINGLE,
            log.HOMERUN,
            log.DOUBLE,
            log.TRIPLE,
            log.SACRIFICE,
            log.REACHED_ON_ERROR,
            log.STOLEN_BASE,
            log.RUN
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
