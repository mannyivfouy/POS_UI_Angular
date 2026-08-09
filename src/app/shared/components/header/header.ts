import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { Bell, CircleQuestionMark, LucideAngularModule, Menu } from 'lucide-angular';
import { LoadingScreenService } from '../../../core/services/loading.service';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { NavigationStart, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule, TranslatePipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  icons = {
    Bell,
    CircleQuestionMark,
    Menu,
  };

  lowStockProducts: Product[] = [];
  showNotifications = false;
  notificationCount = 0;

  constructor(
    public languageService: LanguageService,
    private loadingScreenService: LoadingScreenService,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router : Router
  ) {}

  ngOnInit(): void {
    this.loadLowStockProducts();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.showNotifications = false
      }
    })
  }

  loadLowStockProducts(): void {
    this.productService.getLowStockAlert().subscribe({
      next: (res) => {
        this.lowStockProducts = res.data;
        this.notificationCount = res.data.length;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load low stock products:', err);
      },
    });
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  changeLanguage(lang: string) {
    this.loadingScreenService.show();

    setTimeout(() => {
      this.languageService.setLanguage(lang);

      setTimeout(() => {
        this.loadingScreenService.hide();
      }, 300);
    }, 100);
  }

  toggleLanguage() {
    const nextLang = this.languageService.getCurrentLanguage() === 'en' ? 'kh' : 'en';

    this.loadingScreenService.show();

    setTimeout(() => {
      this.languageService.setLanguage(nextLang);

      setTimeout(() => {
        this.loadingScreenService.hide();
      }, 300);
    }, 100);
  }
}
