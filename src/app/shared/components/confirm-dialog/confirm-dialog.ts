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
  @Input() showCancel = true
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();


  closing = false;

  onConfirm() {
    this.startCloseAnimation(() => {
      this.confirm.emit();
    });
  }

  onCancel() {
    this.startCloseAnimation(() => {
      this.cancel.emit();
    });
  }

  private startCloseAnimation(callback: () => void) {
    this.closing = true;

    setTimeout(() => {
      this.closing = false;

      callback();
    }, 300);
  }

  get confirmButtonClass() {
    switch (this.type) {
      case 'warning':
        return 'bg-indigo-500 hover:bg-indigo-600';

      case 'info':
        return 'bg-indigo-600 hover:bg-indigo-700';

      default:
        return 'bg-pink-600 hover:bg-pink-700';
    }
  }
}
