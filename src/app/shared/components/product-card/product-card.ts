import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';
import { LucideAngularModule, Plus, ShoppingCart } from 'lucide-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  environment = environment;

  icons = {
    ShoppingCart
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
