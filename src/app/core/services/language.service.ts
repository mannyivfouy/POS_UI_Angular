import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly defaultLanguage = 'en';

  constructor(private translate: TranslateService) {
    const savedLanguage = localStorage.getItem('lang') || this.defaultLanguage;

    this.translate.setFallbackLang(this.defaultLanguage);
    this.translate.use(savedLanguage);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang() ?? this.defaultLanguage;
  }

  getAvailableLanguages(): string[] {
    return ['en', 'kh'];
  }
}
