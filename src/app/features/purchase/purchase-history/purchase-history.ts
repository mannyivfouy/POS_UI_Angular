import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Archive, Banknote, ChartNoAxesColumnIncreasing, ChevronDown, LucideAngularModule, Package, Plus, Printer, Receipt, ReceiptText } from 'lucide-angular';
import { Search } from '../../../shared/components/search/search';
import { Purchase, PurchaseItem } from '../../../core/models/purchase.model';
import { PurchaseService } from '../../../core/services/purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { SupplierService } from '../../../core/services/supplier.service';
import { UserService } from '../../../core/services/user.service';
import { Supplier } from '../../../core/models/supplier.model';
import { User } from '../../../core/models/user.model';
import { PurchaseDetailDialog } from '../purchase-detail-dialog/purchase-detail-dialog';
import { PurchaseStats } from '../../../core/models/stats.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { StatsGrid } from "../../../shared/components/stats-grid/stats-grid";

@Component({
  selector: 'app-purchase-history',
  imports: [
    LucideAngularModule,
    CommonModule,
    TranslatePipe,
    Search,
    Pagination,
    PurchaseDetailDialog,
    StatsGrid
],
  templateUrl: './purchase-history.html',
  styleUrl: './purchase-history.css',
})
export class PurchaseHistory {
  icons = {
    Plus,
    ChevronDown,
    Printer,
    Receipt,
    Banknote,
    ChartNoAxesColumnIncreasing,
    Package
  };

  purchases: Purchase[] = [];
  suppliers: Supplier[] = [];
  users: User[] = [];
  stats: StatsCardModel[] = []

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';
  paymentStatusFilter = '';

  loading = false;
  paymentStatusDropdownOpen = false;

  selectedPurchase: Purchase | null = null;
  purchaseItems: PurchaseItem[] = [];
  isDetailOpen = false;

  constructor(
    private purchaseService: PurchaseService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
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

  routeToPurchase() {
    this.router.navigate(['/purchases/create']);
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
        this.loadPurchaseHistory());
    });
    this.loadPurchaseStats();
    this.loadSupplier();
    this.loadUser();
  }

  loadPurchaseHistory(): void {
    this.loading = true;
    this.purchaseService
      .getPurchases({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
        paymentStatus: this.paymentStatusFilter,
      })
      .subscribe({
        next: (res) => {
          this.purchases = res.data;
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

  loadPurchaseStats(): void {
    this.purchaseService.getPurchaseStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          {
            titleKey: 'purchase.stats.total_purchases',
            value: stats.totalPurchase,
            icon: ReceiptText,
            iconColor: 'indigo',
            trend: stats.totalPurchaseTrend,
            format: 'number'
          },
          {
            titleKey: 'purchase.stats.total_amount',
            value: stats.totalPurchaseAmount,
            icon: Banknote,
            iconColor: 'indigo',
            trend: stats.totalPurchaseAmountTrend,
            format: 'currency'
          },
          {
            titleKey: 'purchase.stats.total_purchased_items',
            value: stats.totalPurchaseItems,
            icon: Package,
            iconColor: 'indigo',
            trend: stats.totalPurchaseItemsTrend,
            format: 'number'
          },
          {
            titleKey: 'purchase.stats.average_purchase_amount',
            value: stats.totalAveragePurchase,
            icon: ChartNoAxesColumnIncreasing,
            iconColor: 'indigo',
            trend: stats.totalAveragePurchaseTrend,
            format: 'currency'
          },
        ]
        this.cdr.detectChanges()
      },
      error: () => {
        this.loading = false
      }
    })
  }

  loadSupplier(): void {
    this.supplierService
      .getSuppliers({
        page: 1,
        limit: 10,
      })
      .subscribe({
        next: (res) => {
          this.suppliers = res.data;
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

  viewPurchase(id: string): void {
    this.purchaseService.getPurchaseById(id).subscribe({
      next: (res) => {
        this.selectedPurchase = res.data.purchase;
        this.purchaseItems = res.data.items;
        this.isDetailOpen = true;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  closeDetail(): void {
    this.isDetailOpen = false;
    this.selectedPurchase = null;
    this.purchaseItems = [];
  }
}
