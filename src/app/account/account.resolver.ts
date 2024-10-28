import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountService, UserAccount } from './account.service';
import { AuthService } from '../auth/auth.service';
import { UserData } from '../auth/auth.service';
export const accountResolver: ResolveFn<Partial<UserAccount> | null> = async (route, state) => {
  const accountService = inject(AccountService);
  const authService = inject(AuthService);

  try {
    const user: UserData | null = authService.user();
    if (!user?.auth) {
      throw new Error('User is not logged in');
    }
    // return cached account if available
    if (user.account) {
      return user.account;
    } else {
      // or fetch from DB
      return await accountService.getAccount(user.auth.uid);
    }
  } catch (error) {
    console.error('Error loading user account:', error);
    throw error;
  }
};
