import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { BakongPaymentState, CheckBakongPaymentResponse } from '../../../core/models/payment.model';
import { LucideAngularModule, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-khqr-payment-modal',
  imports: [LucideAngularModule, CommonModule, QRCodeComponent],
  templateUrl: './khqr-payment-modal.html',
  styleUrl: './khqr-payment-modal.css',
})
export class KhqrPaymentModal implements OnChanges {
  @Input() visible = false;
  @Input() payment!: BakongPaymentState;

  @Output() cancelled = new EventEmitter<void>();
  @Output() complete = new EventEmitter<CheckBakongPaymentResponse>();

  private paymentCheckInterval?: ReturnType<typeof setInterval>;

  constructor(private paymentService: PaymentService) {}

  icons = {
    X,
  };

  ngOnChanges(): void {
    if (this.visible) {
      this.startPaymentChecking();
    } else {
      this.stopPaymentChecking();
    }
  }

  ngOnDestroy(): void {
    this.stopPaymentChecking();
  }

  private stopPaymentChecking(): void {
    if (this.paymentCheckInterval) {
      clearInterval(this.paymentCheckInterval);
      this.paymentCheckInterval = undefined;
    }
  }

  private startPaymentChecking(): void {
    this.stopPaymentChecking();

    this.paymentCheckInterval = setInterval(() => {
      this.checkPayment();
    }, 3000);
  }

  private checkPayment(): void {
    if (!this.payment) return;

    this.paymentService
      .checkBakongPayment({
        md5: this.payment.md5,
        amount: this.payment.amount,
      })
      .subscribe({
        next: (res) => {
          if (res.data.paid) {
            this.stopPaymentChecking();
            this.complete.emit(res);
          }
        },
        error: (err) => {
          console.error('Bakong check error:', err);
        },
      });
  }

  close(): void {
    this.cancelled.emit();
  }
}
