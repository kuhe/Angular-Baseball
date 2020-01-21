import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Baseball from './../baseball-lib';

@Component({
    selector: 'batters-data',
    templateUrl: './batters-data.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class BattersDataComponent implements OnInit {
    y: any;
    t: Function;

    constructor() {
        this.abbreviatePosition = Baseball.util.text.abbreviatePosition;
    }

    ngOnInit() {}

    abbreviatePosition: Function;
}
