import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountService } from './account.service';
import { AuthService } from '../auth/auth.service';
import { UserAccount } from './account.interface';

export const accountResolver: ResolveFn<UserAccount | null> = async (route, state) => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);

  try {
    const userId = authService.currentUser()?.uid;
    if (!userId) {
      throw new Error('User is not logged in');
    }
    return await accountService.getAccount(userId);
  } catch (error) {
    console.error('Error loading user account:', error);
    throw error;
  }
};
