import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { SearchService } from '../../../core/services/search.service';
@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  constructor(
    private authService: AuthService,
    private searchService: SearchService,
  ) {}

  get user() {
    return this.authService.getUser();
  }

  onSearch(event: any) {
    this.searchService.setSearch(event.target.value);
  }
}
