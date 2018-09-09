import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConnectionComponent } from './menu-connection.component';

describe('MenuConnectionComponent', () => {
  let component: MenuConnectionComponent;
  let fixture: ComponentFixture<MenuConnectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
