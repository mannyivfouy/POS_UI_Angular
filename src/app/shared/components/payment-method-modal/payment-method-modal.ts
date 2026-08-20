import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentMethod } from '../../../core/models/payment.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-payment-method-modal',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './payment-method-modal.html',
  styleUrl: './payment-method-modal.css',
})
export class PaymentMethodModal {
  @Input() visible = false;
  @Input() total = 0;

  @Output() closed = new EventEmitter<void>();
  @Output() selected = new EventEmitter<PaymentMethod>();

  icons = {
    X,
  };

  selectedMethod: PaymentMethod = 'cash';

  closing = false;

  private action: 'continue' | 'cancel' | null = null;

  close() {
    this.action = 'cancel';
    this.closing = true;
  }

  continuePayment() {
    this.action = 'continue';
    this.closing = true;
  }

  onAnimationEnd() {
    if (!this.closing) return;

    this.closing = false;

    if (this.action === 'continue') {
      this.selected.emit(this.selectedMethod);
    }

    if (this.action === 'cancel') {
      this.closed.emit();
    }

    this.action = null;
  }
}
