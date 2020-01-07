import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import Baseball from './../baseball-lib';

@Component({
    selector: 'battery-data',
    templateUrl: './battery-data.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class BatteryDataComponent implements OnInit {

    y: any;
    t: Function;
    abbreviatePosition: Function;

    constructor() {
        this.abbreviatePosition = Baseball.util.text.abbreviatePosition;
    }

    ngOnInit() {
    }

}
