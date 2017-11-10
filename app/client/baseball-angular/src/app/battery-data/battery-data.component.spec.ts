import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatteryDataComponent } from './battery-data.component';

describe('BatteryDataComponent', () => {
  let component: BatteryDataComponent;
  let fixture: ComponentFixture<BatteryDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatteryDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatteryDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
