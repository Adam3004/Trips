import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionFormComponent } from './opinion-form.component';

describe('OpinionFormComponent', () => {
  let component: OpinionFormComponent;
  let fixture: ComponentFixture<OpinionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
