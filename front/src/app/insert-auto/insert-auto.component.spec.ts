import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertAutoComponent } from './insert-auto.component';

describe('InsertAutoComponent', () => {
  let component: InsertAutoComponent;
  let fixture: ComponentFixture<InsertAutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertAutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertAutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
