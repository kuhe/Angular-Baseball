import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class ScoreboardComponent implements OnInit {

    t: () => void;
    y: any;

    expandScoreboard: boolean = false;

    constructor() {
    }

    ngOnInit() {

    }

}
