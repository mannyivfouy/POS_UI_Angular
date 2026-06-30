import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent {
  @Input() isOpen = true;

  menu = [{ label: 'Dashboard', route: '/dashboard', roles: ['Admin'] }];

  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.getUser();
  }

  get filteredMenu() {
    const role = this.user?.role?.name;
    return this.menu.filter((m) => m.roles.includes(role));
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
