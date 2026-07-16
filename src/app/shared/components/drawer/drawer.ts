import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-drawer',
  imports: [LucideAngularModule],
  templateUrl: './drawer.html',
  styleUrl: './drawer.css',
})
export class Drawer {
  @Input() open = false;
  @Input() title = '';

  @Output() close = new EventEmitter<void>();

  icons = {
    X,
  }

  onClose() {
    this.close.emit();
  }
}
