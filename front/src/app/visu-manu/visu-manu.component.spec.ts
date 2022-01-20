import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisuManuComponent } from './visu-manu.component';

describe('VisuManuComponent', () => {
  let component: VisuManuComponent;
  let fixture: ComponentFixture<VisuManuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisuManuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisuManuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
