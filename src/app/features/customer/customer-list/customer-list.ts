import { ChangeDetectorRef, Component, ViewChild, ViewChildren } from '@angular/core';
import {
  CircleUser,
  ContactRound,
  LucideAngularModule,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-angular';
import { Drawer } from '../../../shared/components/drawer/drawer';
import { CustomerForm } from '../customer-form/customer-form';
import { Customer } from '../../../core/models/customer.mode';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { CustomerService } from '../../../core/services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Search } from '../../../shared/components/search/search';
import { CommonModule } from '@angular/common';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-customer-list',
  imports: [
    CommonModule,
    LucideAngularModule,
    TranslatePipe,
    StatsGrid,
    Search,
    Pagination,
    Drawer,
    ConfirmDialog,
    CustomerForm,
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList {
  @ViewChild(Drawer)
  drawer?: Drawer;

  @ViewChild(CustomerForm)
  customerForm?: CustomerForm;

  icons = {
    Plus,
    Pencil,
    Trash2,
    CircleUser,
    ContactRound,
  };

  customers: Customer[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 1;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';

  loading = false;
  isDrawerOpen = false;
  showDeleteDialog = false;

  selectedCustomer: Customer | null = null;

  constructor(
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.updateQueryParams();
  }

  onSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.page = 1;
    this.updateQueryParams();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      ((this.page = +(param['page'] ?? 1)),
        (this.limit = +(param['limit'] ?? 10)),
        (this.searchKeyword = param['search'] ?? ''));
      this.loadCustomers();
    });
    this.loadStats();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService
      .getCustomers({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
      })
      .subscribe({
        next: (res) => {
          this.customers = res.data;

          this.limit = res.pagination.limit;
          ((this.totalPage = res.pagination.totalPage), (this.totalItems = res.pagination.total));

          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadStats(): void {
    this.customerService.getCustomerStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          {
            titleKey: 'customer.stats.total',
            value: stats.totalCustomer,
            icon: ContactRound,
            iconColor: 'indigo',
          },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCreateCustomer() {
    this.selectedCustomer = null;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.customerForm?.resetForm();
    this.isDrawerOpen = false;

    setTimeout(() => {
      this.selectedCustomer = null;
    }, 500);
  }

  onSave(formData: FormData) {
    if (this.selectedCustomer) {
      this.customerService.updateCustomer(this.selectedCustomer._id, formData).subscribe({
        next: (res) => {
          this.loadCustomers();
          this.onCancel();
        },
        error: (err) => {
          if (err.status === 409) {
            this.customerForm?.setServerError(err.error.field, err.error.message);
            return;
          }

          console.error(err);
        },
      });
    } else {
      this.customerService.createCustomer(formData).subscribe({
        next: (res) => {
          this.loadCustomers();
          this.onCancel();
        },
        error: (err) => {
          if (err.status === 409) {
            this.customerForm?.setServerError(err.error.field, err.error.message);
            return;
          }

          console.error(err);
        },
      });
    }
  }

  onCancel() {
    this.drawer?.onClose();
  }

  edit(customer: Customer) {
    this.selectedCustomer = customer;
    this.isDrawerOpen = true;
  }

  delete(customer: Customer) {
    this.selectedCustomer = customer;
    this.showDeleteDialog = true;
  }

  confirmDelete() {
    this.showDeleteDialog = false;
    if (!this.selectedCustomer) return;

    this.customerService.deleteCustomer(this.selectedCustomer._id).subscribe({
      next: () => {
        this.selectedCustomer = null;
        this.loadCustomers();
        this.loadStats();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  cancelDelete() {
    this.showDeleteDialog = false;
    this.selectedCustomer = null;
  }
}
