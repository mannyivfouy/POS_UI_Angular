import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  imports: [],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})
export class ConfirmDialog {
  @Input() open = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to continue?';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';
  @Input() showCancel = true;
  @Input() type: 'danger' | 'warning' | 'info' | 'success' = 'danger';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  closing = false;
  private action: 'confirm' | 'cancel' | null = null;

  onConfirm() {
    this.action = 'confirm';
    this.closing = true;
  }

  onCancel() {
    this.action = 'cancel';
    this.closing = true;
  }

  onAnimationEnd() {
    if (!this.closing) return;

    this.closing = false;

    if (this.action === 'confirm') {
      this.confirm.emit();
    }

    if (this.action === 'cancel') {
      this.cancel.emit();
    }

    this.action = null;
  }

  get confirmButtonClass() {
    switch (this.type) {
      case 'warning':
        return 'bg-indigo-500 hover:bg-indigo-600';

      case 'info':
        return 'bg-indigo-600 hover:bg-indigo-700';

      case 'success':
        return 'bg-indigo-600 hover:bg-indigo-700';

      default:
        return 'bg-pink-600 hover:bg-pink-700';
    }
  }
}
