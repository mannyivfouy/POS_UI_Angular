import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Purchase, PurchaseItem } from '../../../core/models/purchase.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Printer, X } from 'lucide-angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-purchase-detail-dialog',
  imports: [CommonModule, LucideAngularModule, TranslatePipe],
  templateUrl: './purchase-detail-dialog.html',
  styleUrl: './purchase-detail-dialog.css',
})
export class PurchaseDetailDialog {
  @Input() open = false;
  @Input() purchase: Purchase | null = null;
  @Input() items: PurchaseItem[] = [];

  @Output() close = new EventEmitter<void>();

  icons = {
    X,
    Printer,
  };

  closing = false;

  closingDialog() {
    this.closing = true;
  }

  animationEnd() {
    if (this.closing) {
      this.closing = false;
      this.open = false;
      this.close.emit();
    }
  }
}
