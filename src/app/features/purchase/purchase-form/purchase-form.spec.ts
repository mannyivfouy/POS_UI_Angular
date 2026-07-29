import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseForm } from './purchase-form';

describe('PurchaseForm', () => {
  let component: PurchaseForm;
  let fixture: ComponentFixture<PurchaseForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
