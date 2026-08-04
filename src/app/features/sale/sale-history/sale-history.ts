import { ChangeDetectorRef, Component } from '@angular/core';
import {
  Banknote,
  ChartNoAxesColumnIncreasing,
  ChevronDown,
  LucideAngularModule,
  Package,
  Plus,
  Printer,
  Receipt,
  ReceiptText,
  RotateCcw,
  ShoppingCart,
} from 'lucide-angular';
import { Sale, SaleItem } from '../../../core/models/sale.model';
import { Customer } from '../../../core/models/customer.mode';
import { User } from '../../../core/models/user.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { SaleService } from '../../../core/services/sale.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Search } from '../../../shared/components/search/search';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-sale-history',
  imports: [LucideAngularModule, CommonModule, TranslatePipe, StatsGrid, Search, Pagination],
  templateUrl: './sale-history.html',
  styleUrl: './sale-history.css',
})
export class SaleHistory {
  icons = {
    Plus,
    ChevronDown,
    Printer,
    RotateCcw,
    ShoppingCart,
    Banknote,
    Package,
    ChartNoAxesColumnIncreasing,
    Receipt,
  };

  sales: Sale[] = [];
  customers: Customer[] = [];
  users: User[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';
  paymentStatusFilter = '';

  loading = false;
  paymentStatusDropdownOpen = false;

  selectedSale: Sale | null = null;
  saleItems: SaleItem[] = [];
  isDetailOpen = false;

  constructor(
    private saleService: SaleService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private userService: UserService,
  ) {}

  private updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword || null,
        paymentStatus: this.paymentStatusFilter || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  routeToSale() {
    this.router.navigate(['/sales/create']);
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

  togglePaymentStatusDropdown() {
    this.paymentStatusDropdownOpen = !this.paymentStatusDropdownOpen;
  }

  onPaymentStatusFilter(paymentStatus: string) {
    this.paymentStatusFilter = paymentStatus;
    this.paymentStatusDropdownOpen = false;
    this.page = 1;
    this.updateQueryParams();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      ((this.page = +(param['page'] ?? 1)),
        (this.limit = +(param['limit'] ?? 10)),
        (this.searchKeyword = param['search'] ?? ''),
        (this.paymentStatusFilter = param['paymentStatus'] ?? ''),
        this.loadSaleHistory());
    });
    this.loadSaleStats();
    this.loadCustomer();
    this.loadUser();
  }

  loadSaleHistory(): void {
    this.loading = true;
    this.saleService
      .getSales({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
        paymentStatus: this.paymentStatusFilter,
      })
      .subscribe({
        next: (res) => {
          this.sales = res.data;
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

  loadSaleStats(): void {
    this.saleService.getSaleStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          {
            titleKey: 'sale.stats.total_sale',
            value: stats.totalSales,
            icon: ShoppingCart,
            iconColor: 'indigo',
            trend: stats.totalSalesTrend,
            format: 'number',
          },
          {
            titleKey: 'sale.stats.total_sale_revenue',
            value: stats.totalSalesRevenue,
            icon: Banknote,
            iconColor: 'indigo',
            trend: stats.totalSalesRevenueTrend,
            format: 'currency',
          },
          {
            titleKey: 'sale.stats.total_product_sold',
            value: stats.totalProductsSold,
            icon: Package,
            iconColor: 'indigo',
            trend: stats.totalProductsSoldTrend,
            format: 'number',
          },
          {
            titleKey: 'sale.stats.average_sale_amount',
            value: stats.totalAverageSale,
            icon: ChartNoAxesColumnIncreasing,
            iconColor: 'indigo',
            trend: stats.totalAverageSaleTrend,
            format: 'currency',
          },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadCustomer(): void {
    this.customerService
      .getCustomers({
        page: 1,
        limit: 10,
      })
      .subscribe({
        next: (res) => {
          this.customers = res.data;
        },
      });
  }

  loadUser(): void {
    this.userService
      .getUsers({
        page: 1,
        limit: 10,
      })
      .subscribe({
        next: (res) => {
          this.users = res.data;
        },
      });
  }

  viewSale(id: string): void {
    this.saleService.getSaleById(id).subscribe({
      next: (res) => {
        this.selectedSale = res.data.sale;
        this.saleItems = res.data.items;
        this.isDetailOpen = true;
      },
      error: (err) => [console.error(err)],
    });
  }

  closeDetail(): void {
    this.isDetailOpen = false;
    this.selectedSale = null;
    this.saleItems = [];
  }
}
