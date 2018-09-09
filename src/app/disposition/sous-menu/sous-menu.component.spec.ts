import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SousMenuComponent } from './sous-menu.component';

describe('SousMenuComponent', () => {
  let component: SousMenuComponent;
  let fixture: ComponentFixture<SousMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SousMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SousMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
