import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  Camera,
  ChevronDown,
  Eye,
  EyeOff,
  LucideAngularModule,
  Save,
  User,
  X,
} from 'lucide-angular';
import { Role } from '../../../core/models/role.model';
import { TranslatePipe } from '@ngx-translate/core';
@Component({
  selector: 'app-user-form',
  imports: [CommonModule, FormsModule, LucideAngularModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnChanges {
  @Input() userData: any = null;
  @Input() roles: Role[] = [];

  @Output() saved = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  icons = {
    X,
    Save,
    Eye,
    EyeOff,
    Camera,
    User,
    ChevronDown,
  };

  userForm!: FormGroup;
  avatarFile?: File;
  avatarPreview: string | null = null;

  isEditingMode = false;
  isPasswordVisible = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      avatar: [null],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]],
      roleId: ['', Validators.required],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      status: ['active', Validators.required],
    });

    this.loadUser();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['userData'] && this.userForm) {
      this.loadUser();
    }
  }

  loadUser() {
    if (!this.userData) {
      this.isEditingMode = false;
      this.avatarPreview = null;

      this.userForm.reset({
        status: 'active',
      });

      return;
    }

    this.isEditingMode = true;

    this.userForm.patchValue({
      username: this.userData.username,
      fullname: this.userData.fullname,
      roleId: this.userData.roleId?._id || this.userData.roleId,
      phone: this.userData.phone,
      email: this.userData.email,
      status: this.userData.status,
    });

    this.avatarPreview = this.userData.avatar
      ? `http://localhost:5000${this.userData.avatar}`
      : null;

    const passwordControl = this.userForm.get('password');
    passwordControl?.removeValidators(Validators.required);
    passwordControl?.updateValueAndValidity();
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    if (file.size > 2 * 1024 * 1024) {
      alert('Avatar size must be less than 2MB');
      return;
    }

    this.userForm.patchValue({
      avatar: file,
    });

    this.avatarPreview = URL.createObjectURL(file);
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleStatus() {
    const currentStatus = this.userForm.get('status')?.value;

    this.userForm.patchValue({
      status: currentStatus === 'active' ? 'inactive' : 'active',
    });
  }

  submit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();

    Object.keys(this.userForm.value).forEach((key) => {
      const value = this.userForm.value[key];

      if (key === 'avatar' && typeof value === 'string') {
        return;
      }

      if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    this.saved.emit(formData);
  }

  onCancel() {
    this.cancel.emit();
  }

  resetForm() {
    this.isEditingMode = false;
    this.avatarPreview = null;
    this.avatarFile = undefined;
    this.isPasswordVisible = false;

    this.userForm.reset({
      username: '',
      fullname: '',
      avatar: null,
      password: '',
      roleId: '',
      phone: '',
      email: '',
      status: 'active',
    });

    const passwordControl = this.userForm.get('password');

    passwordControl?.setValidators([
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(20),
    ]);

    passwordControl?.updateValueAndValidity();
  }

  setServerError(field: string, message: string) {
    const control = this.userForm.get(field);

    if (!control) return;

    control.setErrors({
      ...control.errors,
      server: message,
    });

    control.markAllAsTouched();
  }
}
