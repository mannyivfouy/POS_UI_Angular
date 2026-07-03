import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() page = 1;
  @Input() totalPage = 1;

  @Output() pageChange = new EventEmitter<number>();

  changePage(p: number) {
    this.pageChange.emit(p);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPage }, (_, i) => i + 1);
  }
}
