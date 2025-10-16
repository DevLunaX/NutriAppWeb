import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recordatorio } from './recordatorio';

describe('Recordatorio', () => {
  let component: Recordatorio;
  let fixture: ComponentFixture<Recordatorio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recordatorio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Recordatorio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
