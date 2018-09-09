import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiteurIndexComponent } from './visiteur-index.component';

describe('VisiteurIndexComponent', () => {
  let component: VisiteurIndexComponent;
  let fixture: ComponentFixture<VisiteurIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiteurIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiteurIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
