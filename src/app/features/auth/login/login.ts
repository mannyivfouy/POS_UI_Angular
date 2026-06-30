import { ChangeDetectorRef, Component } from '@angular/core';
import { LucideWarehouse, LucideUser, LucideLock, LucideLogIn, LucideEye } from '@lucide/angular';
import { LoginRequest, LoginResponse } from '../../../core/models/auth.model';
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
    LucideEye,
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
        console.log('LOGIN SUCCESS:', res); // 👈 debug

        this.isLoading = false;

        this.authService.saveSession(res.token, res.user);

        // 👇 FORCE NAVIGATION CHECK
        this.router.navigateByUrl('/dashboard').then((success) => {
          console.log('NAV RESULT:', success);
        });
      },

      error: (err) => {
        console.log('LOGIN ERROR:', err); // 👈 debug

        this.isLoading = false;

        this.errorMessage = err?.error?.message || err?.message || 'Invalid username or password';
      },
    });
  }
}
