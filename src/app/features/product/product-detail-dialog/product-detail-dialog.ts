import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { LucideAngularModule, Package, X } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-detail-dialog',
  imports: [LucideAngularModule, CommonModule, TranslatePipe],
  templateUrl: './product-detail-dialog.html',
  styleUrl: './product-detail-dialog.css',
})
export class ProductDetailDialog {
  @Input() open = false;
  @Input() product: Product | null = null;

  @Output() close = new EventEmitter<void>();

  environment = environment;

  icons = {
    X,
    Package
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
