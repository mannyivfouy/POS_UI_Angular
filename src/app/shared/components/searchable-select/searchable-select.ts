import { Component, Input, Output } from '@angular/core';
import { SelectOption } from '../../models/searchable-select';
import { ChevronDown, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-searchable-select',
  imports: [LucideAngularModule],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.css',
})
export class SearchableSelect {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() items: SelectOption[] = [];

  icons = {
    ChevronDown
  }
}
