import { Injectable, computed, inject, signal } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { FirebaseError } from 'firebase/app';

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
  private firestore: Firestore = inject(Firestore);
  private accountSignal = signal<UserAccount | null>(null);
  readonly account = computed(() => this.accountSignal());

  constructor() { }

  async createAccount(userId: string, accountData: Partial<UserAccount>): Promise<void> {
    try {
      if (!userId) {
        throw new Error('No user provided');
      }
      // save in DB
      const userRef = doc(this.firestore, `users/${userId}`);
      await setDoc(userRef, accountData);
      // set local signal
      this.accountSignal.set(accountData);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async updateAccount(userId: string, accountUpdate: Partial<UserAccount>): Promise<void> {
    try {
      // Update in DB and reflect in local signal
      const userRef = doc(this.firestore, `users/${userId}`);
      await updateDoc(userRef, accountUpdate);
      this.accountSignal.update(account => ({ ...account, ...accountUpdate } as UserAccount));
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async getAccount(userId: string): Promise<Partial<UserAccount> | null> {
    try {
      if (!userId) {
        throw new Error('No user provided');
      }
      // get from DB
      const userRef = doc(this.firestore, `users/${userId}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const accountData = userSnapshot.data() as Partial<UserAccount>;
        this.accountSignal.set(accountData);
        return accountData;
      } else {
        console.log('No user found with the given UID');
        return null;
      }
    } catch (error: any) {
      this.handleError(error);
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      // delete from DB and null local signal
      const userRef = doc(this.firestore, `users/${userId}`);
      await deleteDoc(userRef);
      this.accountSignal.set(null);
    } catch (error: any) {
      this.handleError(error);
    }
  }

  clearAccount(): void {
    this.accountSignal.set(null);
  }

  /// TODO: handle errors in an error service

  private handleError(error: any): never {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'permission-denied':
          throw new Error('You do not have permission to perform this operation.');
        case 'not-found':
          throw new Error('The requested document was not found.');
        case 'already-exists':
          throw new Error('The document already exists.');
        case 'resource-exhausted':
          throw new Error('Quota exceeded or rate limit reached. Please try again later.');
        case 'failed-precondition':
          throw new Error('Operation was rejected because the system is not in a state required for the operation.');
        case 'aborted':
          throw new Error('The operation was aborted, typically due to a concurrency issue.');
        case 'out-of-range':
          throw new Error('Operation was attempted past the valid range.');
        case 'unimplemented':
          throw new Error('Operation is not implemented or not supported.');
        case 'internal':
          throw new Error('Internal error. Please try again later.');
        case 'unavailable':
          throw new Error('The service is currently unavailable. Please try again later.');
        case 'data-loss':
          throw new Error('Unrecoverable data loss or corruption.');
        case 'unauthenticated':
          throw new Error('The request does not have valid authentication credentials.');
        default:
          throw new Error('An unexpected error occurred. Please try again.');
      }
    } else {
      throw new Error(error.message || 'An unexpected error occurred. Please try again.');
    }
  }
}


