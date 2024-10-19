import { Injectable, Signal, inject, signal } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { UserAccount } from './account.interface';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private firestore: Firestore = inject(Firestore);
  private currentAccountSignal = signal<UserAccount | null>(null);

  readonly currentAccount: Signal<UserAccount | null> = this.currentAccountSignal.asReadonly();

  constructor() { }

  async createAccount(user: User, accountData: Partial<UserAccount>): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userRef, accountData);
      this.currentAccountSignal.set(accountData);
    } catch (error: any) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async updateAccount(uid: string, userData: Partial<UserAccount>): Promise<void> {
    try {
      // Update other fields in Firestore
      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, userData);
      this.currentAccountSignal.update(account => ({ ...account, ...userData } as UserAccount));
      console.log('User document updated in Firestore');
    } catch (error: any) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  async getAccount(uid: string): Promise<UserAccount | null> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        // Convert the document data to UserAccount type
        const accountData = userSnapshot.data() as UserAccount;
        this.currentAccountSignal.set(accountData);
        return accountData;
      } else {
        console.log('No user found with the given UID');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }

  async deleteAccount(uid: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await deleteDoc(userRef);
      this.currentAccountSignal.set(null);
      console.log('User document deleted from Firestore');
    } catch (error: any) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  }
}


