import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const router = inject(Router);
    const authService = inject(AuthService);

    const user = authService.getUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    const roleName = user.role?.name;

    if (allowedRoles.includes(roleName)) {
      return true;
    }

    router.navigate(['/dashboard']);
    return false;
  };
};
