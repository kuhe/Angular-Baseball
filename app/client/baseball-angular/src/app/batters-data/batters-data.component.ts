import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import Baseball from './../baseball-lib';

@Component({
    selector: 'batters-data',
    templateUrl: './batters-data.component.html',
    styleUrls: ['./batters-data.component.css'],
    encapsulation: ViewEncapsulation.None,
    inputs : ['y', 't']
})
export class BattersDataComponent implements OnInit {

    constructor() {
        this.abbreviatePosition = Baseball.util.text.abbreviatePosition;
    }

    ngOnInit() {
    }

    abbreviatePosition: Function

}
