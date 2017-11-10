import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ModeComponent} from '../mode/mode.component';

@Component({
    selector: 'upper',
    templateUrl: './upper.component.html',
    styleUrls: ['./upper.component.css'],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class UpperComponent extends ModeComponent implements OnInit {

    y: any;
    t: any;

    constructor() {
        super();
    }

    ngOnInit() {

    }

}
