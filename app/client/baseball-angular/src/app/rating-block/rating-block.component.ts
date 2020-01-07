import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
    selector: 'rating-block',
    templateUrl: './rating-block.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None,
    inputs: ['rating']
})
export class RatingBlockComponent implements OnInit {

    rating: any;

    constructor() {

    }

    ngOnInit() {

    }

}
