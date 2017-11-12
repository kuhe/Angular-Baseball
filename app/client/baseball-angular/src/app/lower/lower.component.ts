import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModeComponent} from '../mode/mode.component';

@Component({
    selector: 'lower',
    templateUrl: './lower.component.html',
    styleUrls: ['./lower.component.css'],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class LowerComponent extends ModeComponent implements OnInit {

    y: any;
    t: any;

    constructor() {
        super();
    }

    ngOnInit() {
    }

}
