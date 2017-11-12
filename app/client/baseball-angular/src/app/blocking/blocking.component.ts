import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ModeComponent} from '../mode/mode.component';
import {referenceContainer} from '../app.component';

@Component({
    selector: 'blocking',
    templateUrl: './blocking.component.html',
    styleUrls: ['./blocking.component.css'],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class BlockingComponent extends ModeComponent implements OnInit {

    y: object;
    t: Function;

    constructor() {
        super();
    }

    ngOnInit() {
    }

    proceedToGame(...args: any[]): void {
        referenceContainer.instance.proceedToGame(...args);
    }

}
