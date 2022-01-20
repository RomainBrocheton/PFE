import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertManuComponent } from './insert-manu.component';

describe('InsertManuComponent', () => {
  let component: InsertManuComponent;
  let fixture: ComponentFixture<InsertManuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertManuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertManuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
