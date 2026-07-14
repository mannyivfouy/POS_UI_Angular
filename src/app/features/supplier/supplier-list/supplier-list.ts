import { ChangeDetectorRef, Component } from '@angular/core';
import { Contact, LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular';
import { Supplier } from '../../../core/models/supplier.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { SupplierService } from '../../../core/services/supplier.service';
import { LoadingScreenService } from '../../../core/services/loading.service';
import { TranslatePipe } from '@ngx-translate/core';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Search } from '../../../shared/components/search/search';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-list',
  imports: [LucideAngularModule, TranslatePipe, StatsGrid, Search, CommonModule],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.css',
})
export class SupplierList {
  icons = {
    Plus,
    Contact,
    Pencil,
    Trash2,
  };

  suppliers: Supplier[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;
  searchKeyword = '';

  loading = false;

  isDrawerOpen = false;
  selectedSupplier: Supplier | null = null;

  constructor(
    private supplierService: SupplierService,
    private cdr: ChangeDetectorRef,
    private loadingScreenService: LoadingScreenService,
  ) {}

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadStats();
  }

  changePage(page: number): void {
    this.page = page;
    this.loadSuppliers();
  }

  onSearch(keyboard: string) {
    this.searchKeyword = keyboard;
    this.page = 1;
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.loading = true;
    this.supplierService
      .getSuppliers({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.suppliers = res.data;

          this.limit = res.pagination.limit;
          this.totalPage = res.pagination.totalPage;
          this.totalItems = res.pagination.total;

          this.loading = true;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  loadStats(): void {
    this.supplierService.getSupplierStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          { titleKey: 'supplier.stats.total', value: stats.totalSupplier, icon: Contact },
          // { titleKey: 'supplier.stats.active', value: stats.activeProduct, icon: ArchiveRestore },
          // { titleKey: 'supplier.stats.inactive', value: stats.inactiveProduct, icon: ArchiveX },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  openCreateSupplier() {
    this.selectedSupplier = null;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  edit(supplier: Supplier) {
    this.selectedSupplier = supplier;
    this.isDrawerOpen = true;
  }

  delete(supplier: any) {}
}
