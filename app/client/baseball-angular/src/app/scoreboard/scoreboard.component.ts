import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'scoreboard',
    templateUrl: './scoreboard.component.html',
    styleUrls: ['./scoreboard.component.css'],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y', 't']
})
export class ScoreboardComponent implements OnInit {

    t: Function;
    y: any;

    expandScoreboard: boolean = false;

    constructor() {
    }

    ngOnInit() {

    }

}
