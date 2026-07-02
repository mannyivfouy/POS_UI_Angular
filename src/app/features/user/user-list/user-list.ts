import { ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { StatsCardModel } from '../../../shared/models/stats-card.model';
import { UserService } from '../../../core/services/user.service';
import { StatsGrid } from '../../../shared/components/stats-grid/stats-grid';
import { Users, UserCheck, UserX } from 'lucide-angular';

@Component({
  selector: 'app-user-list',
  imports: [StatsGrid],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {
  users: User[] = [];
  stats: StatsCardModel[] = [];

  page = 1;
  limit = 10;
  search = '';

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
        this.cdr.detectChanges()
      },
      error: () => {
        // handle it — don't leave this silent
      },
    });
  }
}
