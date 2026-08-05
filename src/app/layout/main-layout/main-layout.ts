import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SidebarComponent } from '../../shared/components/sidebar/sidebar';
import { Header } from "../../shared/components/header/header";
import { LoadingScreen } from '../../shared/components/loading-screen/loading-screen';
import { LucideAngularModule, Menu } from 'lucide-angular';
@Component({
  selector: 'app-main-layout.component',
  imports: [CommonModule, RouterModule, SidebarComponent, Header, LoadingScreen, LucideAngularModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {

  readonly Menu = Menu
  isSidebarOpen = true

  constructor(private authService: AuthService) {}

  get user() {
    return this.authService.getUser();
  }

  toggleSidebar(){
    this.isSidebarOpen = !this.isSidebarOpen
  }
}
