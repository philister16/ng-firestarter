import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  try {
    await auth.authStateReady();
    if (auth.currentUser && auth.currentUser?.emailVerified) {
      return true;
    } else if (auth.currentUser && !auth.currentUser?.emailVerified) {
      router.navigate(['/auth', 'verify'], { queryParams: { returnUrl: state.url } });
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
