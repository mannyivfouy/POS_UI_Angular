import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, History, Archive, Boxes, ArchiveRestore, ShoppingBag, ReceiptText, Users, ShieldCheck, UserCircle } from 'lucide-angular';
import { LucideWarehouse } from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule, LucideWarehouse],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;

  menu = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
    { label: 'Sales', route: '/sales', icon: ShoppingCart, roles: ['Admin', 'Cashier'] },
    { label: 'Sales History', route: '/sales-history', icon: History, roles: ['Admin', 'Manager'] },
    { label: 'Stock', route: '/stock', icon: Archive, roles: ['Admin', 'Cashier', 'Manager'] },
    { label: 'Categories', route: '/categories', icon: Boxes, roles: ['Admin', 'Cashier', 'Manager'] },
    { label: 'Purchase', route: '/purchase', icon: ShoppingBag, roles: ['Admin', 'Manager'] },
    { label: 'Purchase History', route: '/purchase-history', icon: ReceiptText, roles: ['Admin', 'Manager'] },
    { label: 'User', route: '/users', icon: Users, roles: ['Admin'] },
    { label: 'Role', route: '/roles', icon: ShieldCheck, roles: ['Admin'] },
    { label: 'Customer', route: '/customers', icon: UserCircle, roles: ['Admin', 'Cashier'] },
    {label : 'Supplier', route: '/supplier', icon: ArchiveRestore, roles: ['Admin', 'Manager']}
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
