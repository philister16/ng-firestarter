import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserAccount } from './account.interface';
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private firestore: Firestore = inject(Firestore);

  constructor() { }

  async createUser(uid: string, email: string): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await setDoc(userRef, {
        email: email,
        createdAt: new Date(),
        roles: ['user'],
        disabled: false
      });
      console.log('User document created in Firestore');
    } catch (error: any) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async updateUser(uid: string, userData: Partial<UserAccount>): Promise<void> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, userData);
      console.log('User document updated in Firestore');
    } catch (error: any) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }
}


