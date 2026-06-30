import { ChangeDetectorRef, Component } from '@angular/core';
import {
  LucideWarehouse,
  LucideUser,
  LucideLock,
  LucideLogIn,
  LucideEye,
  LucideShield,
  LucideEyeOff,
} from '@lucide/angular';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login.component',
  imports: [
    LucideWarehouse,
    LucideUser,
    LucideLock,
    LucideLogIn,
    LucideEye,
    LucideEyeOff,
    LucideShield,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  isLoading = false;
  errorMessage = '';
  isPasswordVisible = false;
  form: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  // toggle password
  togglePassword() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // login submit
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const data = this.form.value;

    this.authService.login(data).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.saveSession(res.result.token, res.result.user);
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err?.error?.message || err?.message || 'Invalid username or password';
        this.cdr.detectChanges();
      },
    });
  }
}


