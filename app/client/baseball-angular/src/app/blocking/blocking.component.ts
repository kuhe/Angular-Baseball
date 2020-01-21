import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModeComponent } from '../mode/mode.component';
import { referenceContainer } from '../app.component';
import SocketService from '../../services/SocketService';

@Component({
    selector: 'blocking',
    templateUrl: './blocking.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class BlockingComponent extends ModeComponent implements OnInit {
    y: object;
    t: {
        (phrase: string, override?: string): string;
        mode: 'e' | 'n';
    };

    constructor() {
        super();
    }

    ngOnInit() {}

    sim() {
        referenceContainer.instance.y.proceedToGame(SocketService, 1, 1);
        referenceContainer.instance.bindMethods();
    }
    seventh() {
        referenceContainer.instance.y.proceedToGame(SocketService, 7, 1);
        referenceContainer.instance.bindMethods();
    }
    playball() {
        referenceContainer.instance.y.proceedToGame(SocketService);
        referenceContainer.instance.bindMethods();
    }
    spectate() {
        referenceContainer.instance.y.proceedToGame(SocketService, 0, 1);
        referenceContainer.instance.bindMethods();
    }
}
