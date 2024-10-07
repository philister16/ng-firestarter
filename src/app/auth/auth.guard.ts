import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  try {
    await getAuth().authStateReady();
    if (auth.isLoggedIn()) {
      return true;
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
