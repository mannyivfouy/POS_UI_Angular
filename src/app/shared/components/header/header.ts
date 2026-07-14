import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { LanguageService } from '../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { Bell, CircleQuestionMark, LucideAngularModule } from 'lucide-angular';
import { LoadingScreenService } from '../../../core/services/loading.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  icons = {
    Bell,
    CircleQuestionMark,
  };

  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    public languageService: LanguageService,
    private loadingScreenService: LoadingScreenService,
  ) {}

  get user() {
    return this.authService.getUser();
  }

  onSearch(event: any) {
    this.searchService.setSearch(event.target.value);
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
