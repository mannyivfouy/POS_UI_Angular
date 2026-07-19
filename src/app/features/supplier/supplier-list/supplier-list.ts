  import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
  import { ChevronDown, Contact, LucideAngularModule, Pencil, Plus, Trash2 } from 'lucide-angular';
  import { Supplier } from '../../../core/models/supplier.model';
  import { StatsCardModel } from '../../../shared/models/stats-card.model';
  import { SupplierService } from '../../../core/services/supplier.service';
  import { TranslatePipe } from '@ngx-translate/core';
  import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
  import { Search } from '../../../shared/components/search/search';
  import { CommonModule } from '@angular/common';
  import { Drawer } from '../../../shared/components/drawer/drawer';
  import { SupplierForm } from '../supplier-form/supplier-form';
  import { ActivatedRoute, Router } from '@angular/router';
  import { Pagination } from "../../../shared/components/pagination/pagination";
import { ConfirmDialog } from "../../../shared/components/confirm-dialog/confirm-dialog";

  @Component({
    selector: 'app-supplier-list',
    imports: [LucideAngularModule, TranslatePipe, StatsGrid, Search, CommonModule, Pagination, Drawer, SupplierForm, ConfirmDialog],
    templateUrl: './supplier-list.html',
    styleUrl: './supplier-list.css',
  })
  export class SupplierList {
    @ViewChild(Drawer)
    drawer?: Drawer;

    @ViewChild(SupplierForm)
    supplierForm?: SupplierForm;

    icons = {
      Plus,
      Contact,
      Pencil,
      Trash2,
      ChevronDown
    };

    suppliers: Supplier[] = [];
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

    selectedSupplier: Supplier | null = null;

    constructor(
      private supplierService: SupplierService,
      private cdr: ChangeDetectorRef,
      private router: Router,
      private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
      this.route.queryParams.subscribe((param) => {
        ((this.page = +(param['page'] ?? 1)),
          (this.limit = +(param['limit'] ?? 10)),
          (this.searchKeyword = param['search'] ?? ''),
          (this.statusFilter = param['status'] ?? ''),
          this.loadSuppliers());
      });
      this.loadStats();
    }

    changePage(page: number): void {
      this.page = page;
      this.updateQueryParams();
    }

    onSearch(keyboard: string) {
      this.searchKeyword = keyboard;
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

    loadSuppliers(): void {
      this.loading = true;
      this.supplierService
        .getSuppliers({
          page: this.page,
          limit: this.limit,
          search: this.searchKeyword,
          status: this.statusFilter,
        })
        .subscribe({
          next: (res) => {
            this.suppliers = res.data;

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
      this.supplierForm?.resetForm();

      this.isDrawerOpen = false;

      setTimeout(() => {
        this.selectedSupplier = null;
      }, 500);
    }

    onCancel() {
      this.drawer?.onClose();
    }

    onSave(formData: FormData) {
      if (this.selectedSupplier) {
        this.supplierService.updateSupplier(this.selectedSupplier._id, formData).subscribe({
          next: (res) => {
            this.loadSuppliers();
            this.onCancel();
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        this.supplierService.createSupplier(formData).subscribe({
          next: (res) => {
            this.loadSuppliers();
            this.onCancel();
          },
          error: (err) => {
            // console.error(err);
            console.log('Status:', err.status);
  console.log('Error:', err.error);
  console.log('Full error:', err);
          },
        });
      }
    }

    edit(supplier: Supplier) {
      this.selectedSupplier = supplier;
      this.isDrawerOpen = true;
    }

    delete(supplier: Supplier) {
      this.selectedSupplier = supplier;
      this.showDeleteDialog = true;
    }

    cancelDelete() {
      this.showDeleteDialog = false;
      this.selectedSupplier = null;
    }

    confirmDelete(){
      this.showDeleteDialog = false;
      if (!this.selectedSupplier) return;

      this.supplierService.deleteSupplier(this.selectedSupplier._id).subscribe({
        next: () => {
          this.selectedSupplier = null;
          this.loadSuppliers();
          this.loadStats()
        },
        error: (err) => {
          console.error(err)
        }
      })
    }
  }
