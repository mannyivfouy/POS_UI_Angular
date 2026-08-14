import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
  Archive,
  ArchiveRestore,
  ArchiveX,
  LucideAngularModule,
  Package,
  PackageSearch,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { Product, ProductDetailResponse } from '../../../core/models/product.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { ProductService } from '../../../core/services/product.service';
import { TranslatePipe } from '@ngx-translate/core';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Search } from '../../../shared/components/search/search';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { Drawer } from '../../../shared/components/drawer/drawer';
import { LoadingScreenService } from '../../../core/services/loading.service';
import { ProductDetailDialog } from '../product-detail-dialog/product-detail-dialog';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ProductForm } from '../product-form/product-form';

@Component({
  selector: 'app-product-list',
  imports: [
    LucideAngularModule,
    CommonModule,
    TranslatePipe,
    StatsGrid,
    Search,
    Pagination,
    Drawer,
    ProductDetailDialog,
    ConfirmDialog,
    ProductForm
],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  @ViewChild(Drawer)
  drawer?: Drawer;

  @ViewChild(ProductForm)
  productForm?: ProductForm;

  icons = {
    Plus,
    Pencil,
    Trash2,
    Archive,
    ArchiveX,
    ArchiveRestore,
    PackageSearch,
  };

  environment = environment;

  products: Product[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';

  loading = false;

  isDrawerOpen = false;
  isDetailOpen = false;
  showDeleteDialog = false;

  selectedProduct: Product | null = null;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private loadingScreenService: LoadingScreenService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadStats();
  }

  changePage(page: number): void {
    this.page = page;
    this.loadProducts();
  }

  onSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.page = 1;
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productService
      .getProducts({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
      })
      .subscribe({
        next: (res) => {
          this.products = res.data;

          this.limit = res.pagination.limit;
          this.totalPage = res.pagination.totalPage;
          this.totalItems = res.pagination.total;

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadStats(): void {
    this.productService.getProductStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          {
            titleKey: 'product.stats.total',
            value: stats.totalProduct,
            icon: Package,
            iconColor: 'indigo',
            trend: stats.totalProductTrend,
            format: 'number',
          },
          {
            titleKey: 'product.stats.active',
            value: stats.activeProduct,
            icon: Package,
            iconColor: 'green',
            trend: stats.activeProductTrend,
            format: 'number',
          },
          {
            titleKey: 'product.stats.inactive',
            value: stats.inactiveProduct,
            icon: Package,
            iconColor: 'red',
            trend: stats.inactiveProductTrend,
            format: 'number',
          },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCreateProduct() {
    this.selectedProduct = null;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.productForm?.resetForm();

    this.isDrawerOpen = false;

    setTimeout(() => {
      this.selectedProduct = null;
    }, 500);
  }

  onCancel() {
    this.drawer?.onClose();
  }

  onSave(formData: FormData) {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct._id, formData).subscribe({
        next: (res) => {
          this.loadProducts();
          this.onCancel();
        },
        error: (err) => {
          if (err.status === 409) {
            this.productForm?.setServerError(err.error.field, err.error.message);
            return;
          }
          console.error(err);
        },
      });
    } else {
      this.productService.createProduct(formData).subscribe({
        next: (res) => {
          this.loadProducts();
          this.onCancel();
        },
        error: (err) => {
          if (err.status === 409) {
            this.productForm?.setServerError(err.error.field, err.error.message);
            return;
          }

          console.error(err);
        },
      });
    }
  }

  edit(product: Product) {
    this.selectedProduct = product;
    this.isDrawerOpen = true;
  }

  delete(product: Product) {
    this.selectedProduct = product;
    this.showDeleteDialog = true;
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.selectedProduct = null;
  }

  confirmDelete() {
    this.showDeleteDialog = false;
    if (!this.selectedProduct) return;

    this.productService.deleteProduct(this.selectedProduct._id).subscribe({
      next: () => {
        this.selectedProduct = null;
        this.loadProducts();
        this.loadStats();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  viewProductDetail(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.selectedProduct = res.data;
        this.isDetailOpen = true;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  closeDetail(): void {
    this.isDetailOpen = false;
    this.selectedProduct = null;
  }
}
