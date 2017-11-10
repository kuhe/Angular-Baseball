import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpperComponent } from './upper.component';

describe('UpperComponent', () => {
  let component: UpperComponent;
  let fixture: ComponentFixture<UpperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
