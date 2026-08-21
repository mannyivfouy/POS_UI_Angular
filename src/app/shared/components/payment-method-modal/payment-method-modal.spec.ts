import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodModal } from './payment-method-modal';

describe('PaymentMethodModal', () => {
  let component: PaymentMethodModal;
  let fixture: ComponentFixture<PaymentMethodModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentMethodModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
