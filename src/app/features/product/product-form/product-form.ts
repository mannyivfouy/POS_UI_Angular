import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { SearchableSelect } from '../../../shared/components/searchable-select/searchable-select';
import { Category } from '../../../core/models/category.model';
import { Supplier } from '../../../core/models/supplier.model';
import { Camera, LucideAngularModule, Package, X } from 'lucide-angular';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryService } from '../../../core/services/category.service';
import { SupplierService } from '../../../core/services/supplier.service';

@Component({
  selector: 'app-product-form',
  imports: [
    SearchableSelect,
    LucideAngularModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnChanges {
  @Input() productData: any = null;
  @Input() categories: Category[] = [];
  @Input() suppliers: Supplier[] = [];

  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  icons = {
    X,
    Package,
    Camera,
  };

  productForm!: FormGroup;
  imageFile?: File;
  imagePreview: string | null = null;

  isEditingMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      barcode: ['', [Validators.required]],
      sku: ['', Validators.required],
      lowStockAlert: [10, Validators.minLength(0)],
      sellingPrice: [0, Validators.minLength(0)],
      unit: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      description: ['', Validators.maxLength(100)],
      categoryId: ['', Validators.required],
      supplierId: ['', Validators.required],
      status: ['active', Validators.required],
      image: [null],
    });

    this.loadProduct();
    this.loadCategories();
    this.loadSuppliers();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['productData'] && this.productForm) {
      this.loadProduct();
    }
  }

  loadProduct() {
    if (!this.productData) {
      this.isEditingMode = false;
      this.imagePreview = null;

      this.productForm.reset({
        lowStockAlert: 10,
        status: 'active',
      });

      return;
    }

    this.isEditingMode = true;

    this.productForm.patchValue({
      name: this.productData.name,
      barcode: this.productData.barcode,
      sku: this.productData.sku,
      unit: this.productData.unit,
      sellingPrice: this.productData.sellingPrice,
      lowStockAlert: this.productData.lowStockAlert,
      description: this.productData.description,
      categoryId: this.productData.categoryId?._id || this.productData.categoryId,
      supplierId: this.productData.supplierId?._id || this.productData.supplierId,
      status: this.productData.status,
    });

    this.imagePreview = this.productData.image
      ? `http://localhost:5000${this.productData.image}`
      : null;
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
          console.error('Failed to load categories', err);
        },
      });
  }

  loadSuppliers(): void {
    this.supplierService
      .getSuppliers({
        page: 1,
        limit: 100,
        status: 'active',
      })
      .subscribe({
        next: (res) => {
          this.suppliers = res.data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Failed to load suppliers', err);
        },
      });
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }

    this.productForm.patchValue({
      image: file,
    });

    this.imagePreview = URL.createObjectURL(file);
  }

  toggleStatus() {
    const currentStatus = this.productForm.get('status')?.value;

    this.productForm.patchValue({
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  }

  submit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.keys(this.productForm.value).forEach((key) => {
      const value = this.productForm.value[key];

      if (key === 'image' && typeof value === 'string') {
        return;
      }

      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    this.saved.emit(formData);
  }

  onCancel() {
    this.cancel.emit();
  }

  resetForm() {
    this.isEditingMode = false;
    this.imagePreview = null;
    this.imageFile = undefined;

    this.productForm.reset({
      name: '',
      barcode: '',
      sku: '',
      unit: '',
      lowStockAlert: 10,
      description: '',
      categoryId: '',
      supplierId: '',
      status: 'active',
      image: null,
    });
  }

  setServerError(field: string, message: string) {
    const control = this.productForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message,
    });

    control.markAllAsTouched();
  }
}
