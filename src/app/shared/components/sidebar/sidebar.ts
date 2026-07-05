import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, History, Archive, Boxes, ArchiveRestore, ShoppingBag, ReceiptText, Users, ShieldCheck, UserCircle } from 'lucide-angular';
import { LucideWarehouse } from '@lucide/angular';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule, LucideWarehouse, TranslatePipe],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;

  menu = [
    { labelKey: 'menu.dashboard', route: '/dashboard', icon: LayoutDashboard, roles: ['Admin'] },
    { labelKey: 'menu.sale', route: '/sales', icon: ShoppingCart, roles: ['Admin', 'Cashier'] },
    { labelKey: 'menu.sale_history', route: '/sales-history', icon: History, roles: ['Admin', 'Manager'] },
    { labelKey: 'menu.stock', route: '/stock', icon: Archive, roles: ['Admin', 'Cashier', 'Manager'] },
    { labelKey: 'menu.category', route: '/categories', icon: Boxes, roles: ['Admin', 'Cashier', 'Manager'] },
    { labelKey: 'menu.purchase', route: '/purchase', icon: ShoppingBag, roles: ['Admin', 'Manager'] },
    { labelKey: 'menu.purchase_history', route: '/purchase-history', icon: ReceiptText, roles: ['Admin', 'Manager'] },
    { labelKey: 'menu.user', route: '/users', icon: Users, roles: ['Admin'] },
    { labelKey: 'menu.role', route: '/roles', icon: ShieldCheck, roles: ['Admin'] },
    { labelKey: 'menu.customer', route: '/customers', icon: UserCircle, roles: ['Admin', 'Cashier'] },
    {labelKey : 'menu.supplier', route: '/supplier', icon: ArchiveRestore, roles: ['Admin', 'Manager']}
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
