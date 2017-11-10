import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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

    mode() {
        return Baseball.util.text.mode;
    }

}
