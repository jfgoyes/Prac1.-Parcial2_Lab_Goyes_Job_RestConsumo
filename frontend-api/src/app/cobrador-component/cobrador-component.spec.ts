import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CobradorComponent } from './cobrador-component';

describe('CobradorComponent', () => {
  let component: CobradorComponent;
  let fixture: ComponentFixture<CobradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CobradorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CobradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
