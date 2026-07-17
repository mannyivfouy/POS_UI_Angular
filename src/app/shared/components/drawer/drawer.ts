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

  closing = false

  onClose() {
    if (this.closing) return;

    this.closing = true;
  }

  animationFinished() {
    if (this.closing) {
      this.closing = false;
      this.close.emit();
    }
  }

}
