import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-drawer',
  imports: [],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
})
export class Drawer {
  @Input() open = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
