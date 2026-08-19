import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SaleCartItem } from '../../../core/models/sale-cart-item.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-angular';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-sale-cart',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './sale-cart.html',
  styleUrl: './sale-cart.css',
})
export class SaleCart {
  @Input() items: SaleCartItem[] = [];
  @Input() discount = 0;
  @Input() subtotal = 0;
  @Input() total = 0;

  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<string>();
  @Output() placeOrder = new EventEmitter<void>();

  icons = {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
  };

  environment = environment;

  increaseQuantity(item: any) {
    this.quantityChange.emit({
      productId: item.product._id,
      quantity: item.quantity + 1,
    });
  }

  decreaseQuantity(item: any) {
    if (item.quantity <= 1) {
      this.quantityChange.emit({
        productId: item.product._id,
        quantity: 0,
      });
      return;
    }

    this.quantityChange.emit({
      productId: item.product._id,
      quantity: item.quantity - 1,
    });
  }

  removeItem(item: SaleCartItem): void {
    this.remove.emit(item.product._id);
  }

  clearCart(): void {
    this.clear.emit();
  }
}
