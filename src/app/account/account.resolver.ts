import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { AccountService } from './account.service';
import { UserAccount } from './account.interface';
import { Auth } from '@angular/fire/auth';

export const accountResolver: ResolveFn<Partial<UserAccount> | null> = async (route, state) => {
  const accountService = inject(AccountService);
  const auth = inject(Auth);

  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('User is not logged in');
    }
    return await accountService.getAccount(userId);
  } catch (error) {
    console.error('Error loading user account:', error);
    throw error;
  }
};
