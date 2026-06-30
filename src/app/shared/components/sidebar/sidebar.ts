import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, History } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;

  menu = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
    { label: 'Sales', route: '/sales', icon: ShoppingCart, roles: ['Admin'] },
    { label: 'Sales History', route: '/sales-history', icon: History, roles: ['Admin'] },
    // { label: 'Stock', route: '/stock', icon: '📦', roles: ['Admin'] },
    // { label: 'Product Categories', route: '/categories', icon: '🏷️', roles: ['Admin'] },
    // { label: 'Purchase Management', route: '/purchase', icon: '🧾', roles: ['Admin'] },
    // { label: 'Purchase History', route: '/purchase-history', icon: '📜', roles: ['Admin'] },
    // { label: 'User Management', route: '/users', icon: '👤', roles: ['Admin'] },
    // { label: 'Role Management', route: '/roles', icon: '🛡️', roles: ['Admin'] },
    // { label: 'Customer Management', route: '/customers', icon: '👥', roles: ['Admin'] },
  ];

  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.getUser();
  }

  get filteredMenu() {
    const role = this.user?.roleId?.name;
    return this.menu.filter((m) => m.roles.includes(role));
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
