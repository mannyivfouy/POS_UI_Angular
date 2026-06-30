import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
@Component({
  selector: 'app-main-layout.component',
  imports: [CommonModule, RouterModule, SidebarComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {
  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.getUser();
  }
}
