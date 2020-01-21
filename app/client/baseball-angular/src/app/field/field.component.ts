import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'field',
    templateUrl: './field.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['y']
})
export class FieldComponent implements OnInit {
    y: any;

    constructor() {}

    ngOnInit() {}
}
