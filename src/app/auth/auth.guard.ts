import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, AuthState, UnauthorizedReason } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  try {
    const authState: AuthState = await authService.resolveAuthentication();
    if (authState === AuthState.VERIFIED) {
      return true;
    } else if (authState === AuthState.AUTHENTICATED) {
      router.navigate(['/unauthorized'], { queryParams: { returnUrl: state.url, reason: UnauthorizedReason.EMAIL_NOT_VERIFIED } });
      return false;
    } else {
      router.navigate(['/auth', 'login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  } catch (error) {
    console.error('Error during auth state ready:', error);
    router.navigate(['/auth', 'login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
