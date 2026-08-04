import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sale, SaleItem } from '../../../core/models/sale.model';
import { LucideAngularModule, Printer, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sale-detail-dialog',
  imports: [LucideAngularModule, CommonModule, TranslatePipe],
  templateUrl: './sale-detail-dialog.html',
  styleUrl: './sale-detail-dialog.css',
})
export class SaleDetailDialog {
  @Input() open = false;
  @Input() sale: Sale | null = null;
  @Input() items: SaleItem[] = [];

  @Output() close = new EventEmitter<void>()

  icons = {
    X,
    Printer
  }

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
