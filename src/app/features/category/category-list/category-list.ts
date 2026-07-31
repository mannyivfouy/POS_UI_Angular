import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Boxes, ChevronDown, LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular';
import { Drawer } from '../../../shared/components/drawer/drawer';
import { CategoryForm } from '../category-form/category-form';
import { Category } from '../../../core/models/category.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { CategoryService } from '../../../core/services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Search } from '../../../shared/components/search/search';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-category-list',
  imports: [
    LucideAngularModule,
    TranslatePipe,
    CommonModule,
    StatsGrid,
    Search,
    Pagination,
    Drawer,
    CategoryForm,
    ConfirmDialog,
  ],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  @ViewChild(Drawer)
  drawer?: Drawer;

  @ViewChild(CategoryForm)
  categoryForm?: CategoryForm;

  icons = {
    Plus,
    Trash2,
    Pencil,
    ChevronDown,
    Boxes,
  };

  categories: Category[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';
  statusFilter = '';

  loading = false;

  isDrawerOpen = false;
  statusDropdownOpen = false;
  showDeleteDialog = false;
  showAlertDialog = false;

  alertTitle = '';
  alertMessage = '';

  selectedCategory: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  changePage(page: number): void {
    this.page = page;
    this.updateQueryParams();
  }

  onSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.page = 1;
    this.updateQueryParams();
  }

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  onStatusFilter(status: string) {
    this.statusFilter = status;
    this.statusDropdownOpen = false;
    this.page = 1;
    this.updateQueryParams();
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword || null,
        status: this.statusFilter || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      ((this.page = +(param['page'] ?? 1)),
        (this.limit = +(param['limit'] ?? 10)),
        (this.searchKeyword = param['search'] ?? ''),
        (this.statusFilter = param['status'] ?? ''),
        this.loadCategories());
    });
    this.loadStats();
  }

  loadCategories(): void {
    this.loading = false;
    this.categoryService
      .getCategories({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
        status: this.statusFilter,
      })
      .subscribe({
        next: (res) => {
          this.categories = res.data;

          ((this.limit = res.pagination.limit),
            (this.totalPage = res.pagination.totalPage),
            (this.totalItems = res.pagination.total));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {},
      });
  }

  loadStats(): void {
    this.categoryService.getCategoryStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          {
            titleKey: 'category.stats.total',
            value: stats.totalCategory,
            icon: Boxes,
            iconColor: 'indigo',
            trend: stats.totalCategoryTrend,
            format: 'number',
          },
          {
            titleKey: 'category.stats.active',
            value: stats.activeCategory,
            icon: Boxes,
            iconColor: 'green',
            trend: stats.activeCategoryTrend,
            format: 'number',
          },
          {
            titleKey: 'category.stats.inactive',
            value: stats.inactiveCategory,
            icon: Boxes,
            iconColor: 'red',
            trend: stats.inactiveCategoryTrend,
            format: 'number',
          },
        ];
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCreateCategory() {
    this.selectedCategory = null;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.categoryForm?.resetForm();

    this.isDrawerOpen = false;

    setTimeout(() => {
      this.selectedCategory = null;
    }, 500);
  }

  onSave(formData: FormData) {
    if (this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory._id, formData).subscribe({
        next: (res) => {
          this.loadCategories();
          this.onCancel();
        },
        error: (err) => {
          if (err.status === 409) {
            this.categoryForm?.setServerError(err.error.field, err.error.message);
            return;
          }
          console.error(err);
        },
      });
    } else {
      this.categoryService.createCategory(formData).subscribe({
        next: (res) => {
          this.loadCategories();
          this.onCancel();
        },
        error: (err) => {
          console.error(err);
          if (err.status === 409) {
            this.categoryForm?.setServerError(err.error.field, err.error.message);
            return;
          }
        },
      });
    }
  }

  onCancel() {
    this.drawer?.onClose();
  }

  edit(category: Category) {
    this.selectedCategory = category;
    this.isDrawerOpen = true;
  }

  delete(category: Category) {
    this.selectedCategory = category;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    this.showDeleteDialog = false;
    if (!this.selectedCategory) return;
    this.categoryService.deleteCategory(this.selectedCategory._id).subscribe({
      next: () => {
        this.selectedCategory = null;
        this.loadCategories();
        this.loadStats();
      },
      error: (err) => {
        if (err.status === 409) {
          this.showAlertDialog = true;
          return;
        }
        console.error(err);
      },
    });
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.selectedCategory = null;
  }

  canManageCategory(): boolean {
    return this.authService.hasRole(['Admin', 'Manager']);
  }
}
