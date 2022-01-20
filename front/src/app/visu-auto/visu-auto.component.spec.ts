import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuAutoComponent } from './visu-auto.component';

describe('VisuAutoComponent', () => {
  let component: VisuAutoComponent;
  let fixture: ComponentFixture<VisuAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisuAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
