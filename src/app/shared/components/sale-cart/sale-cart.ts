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

  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<string>();

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
    if (item.quantity <= 0) {
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
