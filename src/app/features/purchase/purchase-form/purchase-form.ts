import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ChevronDown, LucideAngularModule, Trash2 } from 'lucide-angular';
import { Supplier } from '../../../core/models/supplier.model';
import { Product } from '../../../core/models/product.model';
import { SupplierService } from '../../../core/services/supplier.service';
import { ProductService } from '../../../core/services/product.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  CreatePurchase,
  PurchaseItem,
  PurchaseItemForm,
} from '../../../core/models/purchase.model';
import { PurchaseService } from '../../../core/services/purchase.service';
import { SearchableSelect } from '../../../shared/components/searchable-select/searchable-select';

@Component({
  selector: 'app-purchase-form',
  imports: [
    TranslatePipe,
    CommonModule,
    SearchableSelect,
    FormsModule,
    ReactiveFormsModule,
    LucideAngularModule,
  ],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.css',
})
export class PurchaseForm implements OnInit {
  icons = {
    ChevronDown,
    Trash2,
  };

  purchaseForm!: FormGroup;
  suppliers: Supplier[] = [];
  supplierProducts: Product[] = [];
  purchaseItems: PurchaseItemForm[] = [];

  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadSuppliers();
  }

  initializeForm(): void {
    this.purchaseForm = this.fb.group({
      supplierId: ['', Validators.required],
      productId: [{ value: '', disabled: true }],

      purchaseDate: [this.getToday(), Validators.required],
      paymentStatus: ['pending', Validators.required],

      discount: [0, [Validators.required, Validators.min(0)]],
      tax: [0, [Validators.required, Validators.min(0)]],
      shipping: [0, [Validators.required, Validators.min(0)]],

      note: ['', Validators.maxLength(100)],
    });

    // Supplier selection
    this.purchaseForm.get('supplierId')?.valueChanges.subscribe((supplierId) => {
      const productControl = this.purchaseForm.get('productId');

      // Clear previous supplier data
      this.supplierProducts = [];
      this.purchaseItems = [];

      if (!supplierId) {
        productControl?.disable();
        productControl?.reset('', { emitEvent: false });
        return;
      }

      // Enable product selector
      productControl?.enable();
      productControl?.reset('', { emitEvent: false });

      // Load products belonging to supplier
      this.loadSupplierProducts(supplierId);
    });

    // Product selection
    this.purchaseForm.get('productId')?.valueChanges.subscribe((productId) => {
      if (!productId) {
        return;
      }

      const product = this.supplierProducts.find((item) => item._id === productId);

      if (!product) {
        console.warn('Product not found:', productId);
        return;
      }

      this.onProductSelected(product);

      // Clear selector after adding product
      this.purchaseForm.get('productId')?.setValue('', {
        emitEvent: false,
      });
    });
  }

  loadSuppliers(): void {
    this.supplierService
      .getSuppliers({
        page: 1,
        limit: 10,
      })
      .subscribe({
        next: (res) => {
          this.suppliers = res.data;
        },
        error: (err) => {
          console.error('Failed to load suppliers', err);
        },
      });
  }

  loadSupplierProducts(supplierId: string): void {
    this.productService
      .getProducts({
        page: 1,
        limit: 100,
        supplierId,
      })
      .subscribe({
        next: (res) => {
          this.supplierProducts = res.data;
        },
        error: (err) => {
          console.error('Failed to load supplier products', err);
          this.supplierProducts = [];
        },
      });
  }

  onSupplierSelected(supplier: Supplier): void {
    this.purchaseForm.patchValue({
      supplierId: supplier._id,
      productId: '',
    });

    this.purchaseItems = [];
    this.supplierProducts = [];

    this.loadSupplierProducts(supplier._id);
  }

  onProductSelected(product: Product): void {
    const existingItem = this.purchaseItems.find((item) => item.productId === product._id);

    if (existingItem) {
      existingItem.quantity++;
      this.updateItemTotal(existingItem);
      return;
    }

    const item: PurchaseItemForm = {
      productId: product._id,
      product: product,
      quantity: 1,
      costPrice: product.costPrice,
      total: product.costPrice,
    };
    this.purchaseItems.push(item);
  }

  increaseQuantity(item: PurchaseItemForm): void {
    item.quantity++;
    this.updateItemTotal(item);
  }

  decreaseQuantity(item: PurchaseItemForm): void {
    if (item.quantity <= 1) {
      return;
    }

    item.quantity--;
    this.updateItemTotal(item);
  }

  // Update quantity
  updateQuantity(item: PurchaseItemForm, value: string): void {
    const quantity = Number(value);

    if (!Number.isFinite(quantity) || quantity < 1) {
      item.quantity = 1;
    } else {
      item.quantity = Math.floor(quantity);
    }

    this.updateItemTotal(item);
  }

  updateCostPrice(item: PurchaseItemForm, value: string): void {
    const costPrice = Number(value);

    if (!Number.isFinite(costPrice) || costPrice < 0) {
      item.costPrice = 0;
    } else {
      item.costPrice = costPrice;
    }

    this.updateItemTotal(item);
  }

  updateItemTotal(item: PurchaseItemForm): void {
    item.total = item.quantity * item.costPrice;
  }

  // Get item total
  getItemTotal(item: PurchaseItemForm): number {
    return item.quantity * item.costPrice;
  }

  // Remove item
  removeItem(index: number): void {
    this.purchaseItems.splice(index, 1);
  }

  // Get total products
  get totalProducts(): number {
    return this.purchaseItems.length;
  }

  // Get total quantity
  get totalQuantity(): number {
    return this.purchaseItems.reduce((total, item) => total + item.quantity, 0);
  }

  // Get subtotal
  get subtotal(): number {
    return this.purchaseItems.reduce((total, item) => total + this.getItemTotal(item), 0);
  }

  // Get discount
  get discount(): number {
    return Number(this.purchaseForm?.get('discount')?.value || 0);
  }

  // Get tax
  get tax(): number {
    return Number(this.purchaseForm?.get('tax')?.value || 0);
  }

  // Get shipping
  get shipping(): number {
    return Number(this.purchaseForm?.get('shipping')?.value || 0);
  }

  // Get grand total
  get grandTotal(): number {
    return Math.max(0, this.subtotal - this.discount + this.tax + this.shipping);
  }

  submit(): void {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      return;
    }

    if (this.purchaseItems.length === 0) {
      console.error('Please add at least one product.');
      return;
    }

    const formValue = this.purchaseForm.value;

    const purchase: CreatePurchase = {
      supplierId: formValue.supplierId,
      purchaseDate: new Date(formValue.purchaseDate),
      paymentStatus: formValue.paymentStatus,
      discount: Number(formValue.discount),
      tax: Number(formValue.tax),
      shipping: Number(formValue.shipping),
      note: formValue.note?.trim() || undefined,
      items: this.purchaseItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        costPrice: item.costPrice,
      })),
    };

    this.isSubmitting = true;

    this.purchaseService.createPurchase(purchase).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.resetForm();
      },

      error: (error) => {
        console.error('Failed to create purchase:', error);

        this.isSubmitting = false;
      },
    });
  }

  resetForm(): void {
    this.purchaseForm.reset({
      supplierId: '',
      productId: '',
      purchaseDate: this.getToday(),
      paymentStatus: 'pending',
      discount: 0,
      tax: 0,
      shipping: 0,
      note: '',
    });

    this.purchaseForm.get('productId')?.disable();

    this.purchaseItems = [];
    this.supplierProducts = [];
  }

  getToday(): string {
    const date = new Date();

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
