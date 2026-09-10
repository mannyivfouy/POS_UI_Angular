import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BakongPaymentState, CheckBakongPaymentResponse } from '../../../core/models/payment.model';
import { Clock, DollarSign, LucideAngularModule, QrCode, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { PaymentService } from '../../../core/services/payment.service';
import { environment } from '../../../../environments/environment';

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
  private countdownInterval?: ReturnType<typeof setInterval>;

  formattedTime = '--:--';

  constructor(
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
  ) {}

  icons = {
    X,
    Clock,
    QrCode,
    DollarSign,
  };

  ngOnChanges(): void {
    if (this.visible) {
      this.startPaymentChecking();
      this.startCountdown();
    } else {
      this.stopPaymentChecking();
      this.stopCountdown();
    }
  }

  ngOnDestroy(): void {
    this.stopPaymentChecking();
    this.stopCountdown();
  }

  get formattedAmount(): string {
    if (!this.payment) return '';
    const isKhr = this.payment.currency === 'KHR';
    return this.payment.amount.toLocaleString('en-US', {
      minimumFractionDigits: isKhr ? 0 : 2,
      maximumFractionDigits: isKhr ? 0 : 2,
    });
  }

  get merchantName(): string {
    return environment.merchantName;
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

  private startCountdown(): void {
    this.stopCountdown();

    if (!this.payment?.expiresAt) {
      this.formattedTime = '--:--';

      console.warn('BakongPaymentState.expiresAt is missing — countdown disabled.');

      return;
    }

    const expiresAtMs = new Date(this.payment.expiresAt).getTime();

    const tick = () => {
      const secondsLeft = Math.max(0, Math.ceil((expiresAtMs - Date.now()) / 1000));

      const minutes = Math.floor(secondsLeft / 60);
      const seconds = secondsLeft % 60;

      this.formattedTime =
        `${minutes.toString().padStart(2, '0')}:` + `${seconds.toString().padStart(2, '0')}`;

      // Force Angular to update the modal UI
      this.cdr.detectChanges();

      if (secondsLeft <= 0) {
        this.stopCountdown();
        this.stopPaymentChecking();
      }
    };

    // Update immediately
    tick();

    // Then update every second
    this.countdownInterval = setInterval(tick, 1000);
  }

  private stopCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = undefined;
    }
  }

  close(): void {
    this.stopPaymentChecking();
    this.stopCountdown();
    this.cancelled.emit();
  }
}
