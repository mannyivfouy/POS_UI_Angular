import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { UserService } from '../../../core/services/user.service';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import {
  Users,
  UserCheck,
  UserX,
  LucideAngularModule,
  Plus,
  Pencil,
  Trash2,
  ChevronDown,
} from 'lucide-angular';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';
import { Search } from '../../../shared/components/search/search';
import { environment } from '../../../../environments/environment';
import { Drawer } from '../../../shared/components/drawer/drawer';
import { UserForm } from '../user-form/user-form';
import { TranslatePipe } from '@ngx-translate/core';
import { Role } from '../../../core/models/role.model';
import { RoleService } from '../../../core/services/role.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  imports: [
    StatsGrid,
    Pagination,
    CommonModule,
    Search,
    LucideAngularModule,
    Drawer,
    UserForm,
    TranslatePipe,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  icons = {
    Plus,
    Pencil,
    Trash2,
    ChevronDown,
  };

  environment = environment;

  users: User[] = [];
  stats: StatsCardModel[] = [];
  roles: Role[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';
  statusFilter = '';
  roleFilter = '';

  loading = false;

  isDrawerOpen = false;
  statusDropdownOpen = false;
  roleDropdownOpen = false;

  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((param) => {
      ((this.page = +(param['page'] ?? 1)),
        (this.limit = +(param['limit'] ?? 10)),
        (this.searchKeyword = param['search'] ?? ''),
        (this.statusFilter = param['status'] ?? ''),
        (this.roleFilter = param['roleId'] ?? ''),
        this.loadUsers());
    });
    this.loadStats();
    this.loadRoles();
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

  toggleStatusDropdown() {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  onStatusFilter(status: string) {
    this.statusFilter = status;
    this.statusDropdownOpen = false;
    this.page = 1;
    this.updateQueryParams();
  }

  toggleRoleDropdown() {
    this.roleDropdownOpen = !this.roleDropdownOpen;
  }

  onRoleFilter(roleId: string) {
    this.roleFilter = roleId;
    this.roleDropdownOpen = false;
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
        roleId: this.roleFilter || null,
      },
      queryParamsHandling: 'merge',
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers({
        page: this.page,
        limit: this.limit,
        search: this.searchKeyword,
        status: this.statusFilter,
        roleId: this.roleFilter,
      })
      .subscribe({
        next: (res) => {
          this.users = res.data;

          // this.page = res.pagination.page;
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
    this.userService.getUserStats().subscribe({
      next: (res) => {
        const stats = res.data;
        this.stats = [
          { titleKey: 'user.stats.total', value: stats.totalUser, icon: Users },
          { titleKey: 'user.stats.active', value: stats.activeUser, icon: UserCheck },
          { titleKey: 'user.stats.inactive', value: stats.inactiveUser, icon: UserX },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe({
      next: (res: any) => {
        this.roles = Array.isArray(res) ? res : (res.data ?? []);
        this.cdr.detectChanges();
      },
    });
  }

  openCreateUser() {
    this.selectedUser = null;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  onSaved() {
    this.closeDrawer();
    this.loadUsers();
  }

  edit(user: User) {
    this.selectedUser = user;
    this.isDrawerOpen = true;
  }
  delete(user: any) {}
}
