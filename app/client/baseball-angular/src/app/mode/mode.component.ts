import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Baseball from './../baseball-lib';

@Component({
    selector: 'mode',
    template: '',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class ModeComponent implements OnInit {

    constructor() {

    }

    ngOnInit() {

    }

    abbreviatePosition(pos: string) {
        return Baseball.util.text.abbreviatePosition(pos);
    }

    /**
     * Set the language mode 'e': english or 'n': japanese.
     * @param {string} set
     */
    mode(set: string): string {
        if (set) {
            Baseball.util.text.mode = set;
            if (localStorage) {
                localStorage.__$yakyuuaikoukai_text_mode = set;
            }
        }
        return Baseball.util.text.mode;
    }

}
