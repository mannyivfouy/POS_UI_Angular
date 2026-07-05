import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, LucideAngularModule, TranslatePipe],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() page = 1;
  @Input() totalPage = 1;

  @Input() limit = 10;
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();

  icons = {
    ChevronLeft,
    ChevronRight,
  };

  changePage(p: number) {
    if (p < 1 || p > this.totalPage) return;
    this.pageChange.emit(p);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPage }, (_, i) => i + 1);
  }

  get startItem(): number {
    if (this.totalItems === 0) return 0;
    return (this.page - 1) * this.limit + 1;
  }

  get endItem(): number {
    return Math.min(this.page * this.limit, this.totalItems);
  }
}
