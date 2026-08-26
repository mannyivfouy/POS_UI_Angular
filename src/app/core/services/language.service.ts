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

    this.setBodyLanguageClass(savedLanguage);
  }

  setLanguage(lang: string): void {
    this.translate.use(lang);
    localStorage.setItem('lang', lang);

    this.setBodyLanguageClass(lang);
  }

  getCurrentLanguage(): string {
    return this.translate.currentLang() ?? this.defaultLanguage;
  }

  getAvailableLanguages(): string[] {
    return ['en', 'kh'];
  }

  private setBodyLanguageClass(lang: string): void {
    document.body.classList.remove('lang-en', 'lang-kh');
    document.body.classList.add(`lang-${lang}`);
  }
}
