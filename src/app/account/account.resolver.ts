import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountService, UserAccount } from './account.service';
import { AuthService } from '../auth/auth.service';
import { User } from '@angular/fire/auth';
export const accountResolver: ResolveFn<Partial<UserAccount> | null> = async (route, state) => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);

  try {
    const user: User | null = authService.user();
    if (!user) {
      throw new Error('User is not logged in');
    }
    return await accountService.getAccount(user);
  } catch (error) {
    console.error('Error loading user account:', error);
    throw error;
  }
};
