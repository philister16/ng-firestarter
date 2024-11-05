import { Injectable, computed, inject, signal } from '@angular/core';
import { DbService } from '../core/db.service';

export interface UserAccount {
  roles?: string[];
  firstName?: string | null;
  lastName?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  profilePicture?: string | null;
}
// TODO: abstract interaction with DB into a separate service including error handling
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private dbService = inject(DbService);
  private accountSignal = signal<UserAccount | null>(null);
  readonly account = computed(() => this.accountSignal());

  constructor() { }

  async createAccount(userId: string, accountData: Partial<UserAccount>): Promise<void> {
    try {
      if (!userId) {
        throw new Error('No user provided');
      }
      // save in DB
      await this.dbService.createWithId('users', userId, accountData);
      // set local signal
      this.accountSignal.set(accountData);
    } catch (error: any) {
      throw error;
    }
  }

  async updateAccount(userId: string, accountUpdate: Partial<UserAccount>): Promise<void> {
    try {
      // Update in DB and reflect in local signal
      await this.dbService.update('users', userId, accountUpdate);
      this.accountSignal.update(account => ({ ...account, ...accountUpdate } as UserAccount));
    } catch (error: any) {
      throw error;
    }
  }

  async getAccount(userId: string): Promise<Partial<UserAccount> | null> {
    try {
      if (!userId) {
        throw new Error('No user provided');
      }
      // get from DB
      const user = await this.dbService.get('users', userId);
      if (user) {
        // Remove id property since it's not part of the UserAccount interface
        const { id, ...userData } = user;
        this.accountSignal.set(userData as Partial<UserAccount>);
        return userData;
      } else {
        return null;
      }
    } catch (error: any) {
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // delete from DB and null local signal
      await this.dbService.delete('users', userId);
      this.accountSignal.set(null);
    } catch (error: any) {
      throw error;
    }
  }

  clearAccount(): void {
    this.accountSignal.set(null);
  }
}


