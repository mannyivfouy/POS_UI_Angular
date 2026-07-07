import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { UserService } from '../../../core/services/user.service';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Users, UserCheck, UserX, LucideAngularModule, Plus, Pencil, Trash2 } from 'lucide-angular';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { CommonModule } from '@angular/common';
import { Search } from '../../../shared/components/search/search';
import { environment } from '../../../../environments/environment';
import { Drawer } from '../../../shared/components/drawer/drawer';
import { UserForm } from '../user-form/user-form';
import { TranslatePipe } from '@ngx-translate/core';

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
  };

  environment = environment;

  users: User[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  totalPage = 1;
  totalItems = 0;

  searchKeyword = '';

  loading = false;

  isDrawerOpen = false;
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  changePage(page: number): void {
    this.page = page;
    this.loadUsers();
  }

  onSearch(keyword: string) {
    this.searchKeyword = keyword;
    this.page = 1;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers({ page: this.page, limit: this.limit, search: this.searchKeyword })
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
