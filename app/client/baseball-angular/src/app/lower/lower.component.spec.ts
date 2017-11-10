import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerComponent } from './lower.component';

describe('LowerComponent', () => {
  let component: LowerComponent;
  let fixture: ComponentFixture<LowerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LowerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LowerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
