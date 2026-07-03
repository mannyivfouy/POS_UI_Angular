import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { UserService } from '../../../core/services/user.service';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Users, UserCheck, UserX } from 'lucide-angular';
import { Pagination } from '../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-user-list',
  imports: [StatsGrid, Pagination],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  users: User[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  search = '';
  totalPage = 0;

  loading = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadStats();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService
      .getUsers({ page: this.page, limit: this.limit, search: this.search })
      .subscribe({
        next: (res) => {
          this.users = res.data;

          this.page = res.pagination.page;
          this.limit = res.pagination.limit;
          this.totalPage = res.pagination.totalPage;

          this.loading = false;
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
          { title: 'Total Users', value: stats.totalUser, icon: Users },
          { title: 'Active Users', value: stats.activeUser, icon: UserCheck },
          { title: 'Inactive Users', value: stats.inactiveUser, icon: UserX },
        ];
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(page: number): void {
    this.page = page;
    this.loadUsers();
  }
}
