import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'flag',
    templateUrl: './flag.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['team']
})
export class FlagComponent implements OnInit {
    team: any;

    constructor() {}

    ngOnInit() {}
}
