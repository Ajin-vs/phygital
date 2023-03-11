import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmRequestComponent } from './atm-request.component';

describe('AtmRequestComponent', () => {
  let component: AtmRequestComponent;
  let fixture: ComponentFixture<AtmRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
