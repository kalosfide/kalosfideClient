import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemDeMenuComponent } from './item-de-menu.component';

describe('ItemDeMenuComponent', () => {
  let component: ItemDeMenuComponent;
  let fixture: ComponentFixture<ItemDeMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDeMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDeMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
