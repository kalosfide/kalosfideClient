import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurIndexComponent } from './fournisseur-index.component';

describe('FournisseurIndexComponent', () => {
  let component: FournisseurIndexComponent;
  let fixture: ComponentFixture<FournisseurIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FournisseurIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FournisseurIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
