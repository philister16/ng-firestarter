import { Injectable, computed, inject, signal } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { UserAccount } from './account.interface';
import { Auth, User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private firestore: Firestore = inject(Firestore);
  private auth = inject(Auth);
  private accountSignal = signal<UserAccount | null>(null);
  readonly account = computed(() => this.accountSignal());

  constructor() {
    this.auth.onAuthStateChanged(user => {
      if (user) {
        this.accountSignal.set({
          uid: user.uid,
          email: user.email ?? '',
          emailVerified: user.emailVerified ?? false
        });
      } else {
        this.accountSignal.set(null);
      }
    });
  }

  async createAccount(user: User, accountData: Partial<UserAccount>): Promise<void> {
    try {
      const { uid, email, emailVerified } = user;
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, { ...accountData, uid, email, emailVerified });
      this.accountSignal.set({ uid, email: email ?? '', emailVerified, ...accountData });
    } catch (error: any) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async updateAccount(uid: string, accountData: Partial<UserAccount>): Promise<void> {
    try {
      // Update other fields in Firestore
      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, accountData);
      this.accountSignal.update(account => ({ ...account, ...accountData } as UserAccount));
      console.log('User document updated in Firestore');
    } catch (error: any) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  async getAccount(uid: string): Promise<Partial<UserAccount> | null> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        // Convert the document data to UserAccount type
        const accountData = userSnapshot.data() as Partial<UserAccount>;
        this.accountSignal.update(account => ({ ...account, ...accountData } as UserAccount));
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
      this.accountSignal.set(null);
      console.log('User document deleted from Firestore');
    } catch (error: any) {
      console.error('Error deleting user document:', error);
      throw error;
    }
  }
}


