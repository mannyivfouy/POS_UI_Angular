import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  imports: [],
templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;

  @Output() addToCart = new EventEmitter<Product>();

  environment = environment;

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
