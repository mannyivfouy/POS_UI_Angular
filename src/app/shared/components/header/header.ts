import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
import { LanguageService } from '../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { Bell, CircleQuestionMark, LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  icons = {
    Bell,
    CircleQuestionMark
  }


  constructor(
    private authService: AuthService,
    private searchService: SearchService,
    public languageService: LanguageService,
  ) {}

  get user() {
    return this.authService.getUser();
  }

  onSearch(event: any) {
    this.searchService.setSearch(event.target.value);
  }

  changeLanguage(lang: string) {
    this.languageService.setLanguage(lang);
  }

  toggleLanguage() {
    const nextLang = this.languageService.getCurrentLanguage() === 'en' ? 'kh' : 'en';

    this.languageService.setLanguage(nextLang);
  }
}
