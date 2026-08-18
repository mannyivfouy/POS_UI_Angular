import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Category } from '../../../core/models/category.model';
import { Customer } from '../../../core/models/customer.mode';
import { SaleCartItem } from '../../../core/models/sale-cart-item.model';
import { Search } from '../../../shared/components/search/search';
import { ProductService } from '../../../core/services/product.service';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { SaleCart } from '../../../shared/components/sale-cart/sale-cart';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-sale-form',
  imports: [Search, ProductCard, SaleCart, CommonModule],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.css',
})
export class SaleForm implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  customers: Customer[] = [];
  cartItems: SaleCartItem[] = [];

  selectedCustomerId: string | null = null;
  selectedCategoryId = '';

  discount = 0;
  tax = 0;
  note = '';

  currentPage = 1;
  pageSize = 20;
  search = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService
      .getProducts({
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        categoryId: this.selectedCategoryId,
      })
      .subscribe({
        next: (res) => {
          // this.products = res.data.filter((product) => product.stockQty > 0);
          this.products = res.data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load products:', err);
        },
      });
  }

  loadCategories(): void {
    this.categoryService
      .getCategories({ page: this.currentPage, limit: this.pageSize, search: this.search })
      .subscribe({
        next: (res) => {
          console.log(res)
          this.categories = res.data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load categories:', err);
        },
      });
  }

  addToCart(product: Product): void {
    const existingItem = this.cartItems.find((item) => item.product._id === product._id);

    if (existingItem) {
      existingItem.quantity++;
      existingItem.total = existingItem.quantity * existingItem.sellingPrice;
    } else {
      this.cartItems.push({
        product,
        quantity: 1,
        sellingPrice: product.sellingPrice,
        total: product.sellingPrice,
      });
    }
  }

  onQuantityChange(event: { productId: string; quantity: number }): void {
    const item = this.cartItems.find((item) => item.product._id === event.productId);

    if (!item) {
      return;
    }

    item.quantity = event.quantity;
    item.total = item.quantity * item.sellingPrice;
  }

  onProductSearch(value: string): void {
    this.search = value.trim();
    this.currentPage = 1;

    this.loadProducts();
  }

  onCategoryChange(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 1;

    this.loadProducts();
  }

  removeFromCart(productId: string): void {
    this.cartItems = this.cartItems.filter((item) => item.product._id !== productId);
  }

  clearCart(): void {
    this.cartItems = [];
  }
}
