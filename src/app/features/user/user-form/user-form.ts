import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Save, X } from 'lucide-angular';
@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm {
  @Input() user: any = null;
  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  icons = {
    X,
    Save
  }

  userData = {
    fullname: '',
    username: '',
    phone: '',
  };

  ngOnChanges() {
    if (this.user) {
      this.userData = { ...this.user };
    }
  }

  onSubmit() {
    this.saved.emit(this.userData);
  }
}
