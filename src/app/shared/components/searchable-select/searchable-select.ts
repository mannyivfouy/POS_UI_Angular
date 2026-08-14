import { Component, ElementRef, forwardRef, HostListener, Input, Output } from '@angular/core';
import { SelectOption } from '../../models/searchable-select.model';
import { Check, ChevronDown, LucideAngularModule, Search } from 'lucide-angular';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-searchable-select',
  imports: [LucideAngularModule, CommonModule, FormsModule, TranslatePipe],
  templateUrl: './searchable-select.html',
  styleUrl: './searchable-select.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelect),
      multi: true,
    },
  ],
})
export class SearchableSelect {
  @Input() searchType = '';
  @Input() placeholder = '';
  @Input() items: SelectOption[] = [];

  icons = {
    ChevronDown,
    Search,
    Check
  };

  isOpen = false;
  searchTerm = '';
  selectedValue: string | null = null;
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  get filteredItems(): SelectOption[] {
    const search = this.searchTerm.trim().toLowerCase();

    if (!search) {
      return this.items;
    }

    return this.items.filter((item) => item.name.toLowerCase().includes(search));
  }

  get selectedLabel(): string {
    const selected = this.items.find((item) => item._id === this.selectedValue);

    return selected?.name ?? this.placeholder;
  }

  toggleDropdown(): void {
    if (this.disabled) {
      return;
    }

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.searchTerm = '';
    }

    this.onTouched();
  }

  selectItem(item: SelectOption): void {
    this.selectedValue = item._id;

    this.onChange(item._id);
    this.onTouched();

    this.isOpen = false;
    this.searchTerm = '';
  }

  writeValue(value: string | null): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
      this.searchTerm = '';
    }
  }
}
