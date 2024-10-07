import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, updateDoc, getDoc } from '@angular/fire/firestore';
import { UserAccount } from './account.interface';
import { updateProfile, getAuth } from '@angular/fire/auth';

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
        roles: 'user',
      });
      console.log('User document created in Firestore');
    } catch (error: any) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }

  async updateUser(uid: string, userData: Partial<UserAccount>): Promise<void> {
    try {

      // Check if displayName or photoURL are being updated
      //
      if ('displayName' in userData || 'photoURL' in userData) {
        console.error('Updating user profile is not allowed in Firestore. Use Firebase Auth instead.');
        throw new Error('Updating user profile is not allowed in Firestore. Use Firebase Auth instead.');
      }

      // Update other fields in Firestore
      const userRef = doc(this.firestore, `users/${uid}`);
      await updateDoc(userRef, userData);
      console.log('User document updated in Firestore');
    } catch (error: any) {
      console.error('Error updating user document:', error);
      throw error;
    }
  }

  async getUser(uid: string): Promise<UserAccount | null> {
    try {
      const userRef = doc(this.firestore, `users/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        // Convert the document data to UserAccount type
        return userSnapshot.data() as UserAccount;
      } else {
        console.log('No user found with the given UID');
        return null;
      }
    } catch (error: any) {
      console.error('Error fetching user document:', error);
      throw error;
    }
  }
}


