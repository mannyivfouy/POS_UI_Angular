import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Camera, Eye, EyeOff, LucideAngularModule, User } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { ConfirmDialog } from "../../shared/components/confirm-dialog/confirm-dialog";

@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule, CommonModule, FormsModule, ReactiveFormsModule, TranslatePipe, ConfirmDialog],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnChanges {
  @Input() profileData: any = null;

  icons = {
    Camera,
    Eye,
    EyeOff,
    User,
  };

  profileForm!: FormGroup;
  avatarFile?: File;
  avatarPreview: string | null = null;

  isPasswordVisible = false;
  showSuccessDialog = false

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      fullname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      avatar: [null],
      password: ['', [Validators.minLength(6), Validators.maxLength(20)]],
      phone: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    });
    this.loadProfile();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profileData'] && this.profileForm) {
      this.loadProfile();
    }
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (res: any) => {
        const user = res.data;

        this.profileForm.patchValue({
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          phone: user.phone,
        });

        this.avatarPreview = user.avatar ? `http://localhost:5000${user.avatar}` : null;
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePassword(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onCancel() {
    this.loadProfile();
  }

  submit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('username', this.profileForm.value.username);
    formData.append('fullname', this.profileForm.value.fullname);
    formData.append('email', this.profileForm.value.email);
    formData.append('phone', this.profileForm.value.phone);

    // only send password if user enters a new one
    if (this.profileForm.value.password) {
      formData.append('password', this.profileForm.value.password);
    }

    // avatar file
    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }

    this.userService.updateProfile(formData).subscribe({
      next: (res) => {
        this.showSuccessDialog = true;
        this.loadProfile();
      },

      error: (err) => {
        console.log(err);
      },
    });
  }

  closeSuccessDialog(){
    this.showSuccessDialog = false
  }
}
