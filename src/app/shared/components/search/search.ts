import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search',
  imports: [LucideAngularModule],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search {
  @Input() value = ''
  @Input() placeholder = 'Search...';
  @Output() search = new EventEmitter<string>();


  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe((value) => {
      this.search.emit(value);
    });
  }

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search.next(value);
  }
}
