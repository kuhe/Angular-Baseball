import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RatingBlockComponent} from './rating-block.component';

describe('RatingBlockComponent', () => {
    let component: RatingBlockComponent;
    let fixture: ComponentFixture<RatingBlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RatingBlockComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RatingBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
