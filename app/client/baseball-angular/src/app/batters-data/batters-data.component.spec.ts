import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BattersDataComponent} from './batters-data.component';

describe('BattersDataComponent', () => {
    let component: BattersDataComponent;
    let fixture: ComponentFixture<BattersDataComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BattersDataComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BattersDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
