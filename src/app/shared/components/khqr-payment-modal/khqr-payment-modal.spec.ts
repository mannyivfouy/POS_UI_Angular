import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhqrPaymentModal } from './khqr-payment-modal';

describe('KhqrPaymentModal', () => {
  let component: KhqrPaymentModal;
  let fixture: ComponentFixture<KhqrPaymentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhqrPaymentModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhqrPaymentModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
