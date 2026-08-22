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
import { PaymentMethodModal } from '../../../shared/components/payment-method-modal/payment-method-modal';
import {
  BakongPaymentState,
  CheckBakongPaymentResponse,
  PaymentMethod,
} from '../../../core/models/payment.model';
import { KhqrPaymentModal } from '../../../shared/components/khqr-payment-modal/khqr-payment-modal';
import { SaleService } from '../../../core/services/sale.service';
import {
  CompleteSaleRequest,
  PrepareSalePaymentData,
  PrepareSalePaymentRequest,
} from '../../../core/models/sale-payment.model';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-sale-form',
  imports: [Search, ProductCard, SaleCart, PaymentMethodModal, CommonModule, KhqrPaymentModal],
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
  selectedCategoryId: string | null = null;

  discount = 0;
  subtotal = 0;
  total = 0;
  note = '';

  currentPage = 1;
  pageSize = 20;
  search = '';

  showPaymentModal = false;
  showKhqrPaymentModal = false;

  bakongPayment: BakongPaymentState | null = null;
  preparedSale: PrepareSalePaymentData | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private categoryService: CategoryService,
    private saleService: SaleService,
    private paymentService: PaymentService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    const params: any = {
      page: this.currentPage,
      limit: this.pageSize,
      search: this.search,
      status: 'active',
    };

    if (this.selectedCategoryId) {
      params.categoryId = this.selectedCategoryId;
    }

    this.productService.getProducts(params).subscribe({
      next: (res) => {
        this.products = res.data.filter((product) => product.stockQty > 0);
        // this.products = res.data
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load products:', err);
      },
    });
  }

  loadCategories(): void {
    this.categoryService
      .getCategories({
        page: 1,
        limit: 100,
        status: 'active',
      })
      .subscribe({
        next: (res) => {
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

    this.calculateTotals();
  }

  onQuantityChange(event: { productId: string; quantity: number }): void {
    const itemIndex = this.cartItems.findIndex((item) => item.product._id === event.productId);

    if (itemIndex === -1) return;

    if (event.quantity <= 0) {
      this.cartItems.splice(itemIndex, 1);
    } else {
      const item = this.cartItems[itemIndex];

      item.quantity = event.quantity;
      item.total = item.quantity * item.sellingPrice;
    }

    this.calculateTotals();
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

    this.calculateTotals();
  }

  clearCart(): void {
    this.cartItems = [];
    this.calculateTotals();
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((sum, item) => sum + item.total, 0);

    this.total = this.subtotal - this.discount;
  }

  openPaymentModal(): void {
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  onPaymentMethodSelected(method: PaymentMethod): void {
    this.showPaymentModal = false;

    if (method === 'bakongKHQR') {
      this.prepareKhqrPayment();
      return;
    }

    if (method === 'cash') {
      // Later: open cash payment modal
      console.log('Open cash payment');
    }
  }

  closeKhqrPaymentModal(): void {
    this.showKhqrPaymentModal = false;
  }

  prepareKhqrPayment(): void {
    if (this.cartItems.length === 0) {
      return;
    }

    const data: PrepareSalePaymentRequest = {
      customerId: this.selectedCustomerId,
      items: this.cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        sellingPrice: item.sellingPrice,
      })),
      discount: this.discount,
      tax: 0,
      note: this.note,
    };

    this.saleService.prepareSalePayment(data).subscribe({
      next: (res) => {
        this.preparedSale = res.data;

        this.bakongPayment = {
          qr: res.data.qr,
          md5: res.data.md5,
          amount: res.data.total,
          billNumber: res.data.invoiceNo,
          status: 'waiting',
        };

        this.showKhqrPaymentModal = true;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Failed to prepare sale payment:', err);
      },
    });
  }

  onBakongPaymentCompleted(payment: CheckBakongPaymentResponse): void {
    if (!this.preparedSale) {
      console.error('Prepared sale not found');
      return;
    }

    const completeRequest: CompleteSaleRequest = {
      invoiceNo: this.preparedSale.invoiceNo,
      customerId: this.preparedSale.customerId,
      items: this.preparedSale.items,
      subtotal: this.preparedSale.subtotal,
      discount: this.preparedSale.discount,
      tax: this.preparedSale.tax,
      total: this.preparedSale.total,
      md5: this.preparedSale.md5,
      note: this.note,
    };

    this.saleService.completeSale(completeRequest).subscribe({
      next: (res) => {
        console.log('Sale completed:', res);
        this.showKhqrPaymentModal = false;
        this.clearSaleForm();
      },
      error: (err) => {
        console.error('Failed to complete sale:', err);
      },
    });
  }

  private clearSaleForm(): void {
    this.cartItems = [];

    this.selectedCustomerId = null;

    this.discount = 0;
    this.subtotal = 0;
    this.total = 0;
    this.note = '';

    this.preparedSale = null;
    this.bakongPayment = null;

    this.calculateTotals();
  }
}
