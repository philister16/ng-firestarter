import { Injectable, inject, signal, Signal, computed } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential, sendEmailVerification, applyActionCode, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, updateProfile, deleteUser, verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // Signal to keep track of the current user
  private currentUserSignal = signal<User | null>(null);

  // Public read-only signal for components to subscribe to
  readonly currentUser: Signal<User | null> = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSignal.set(user);
    });
  }

  async signup(email: string, password: string): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }
      console.log('User signed up successfully');
      return userCredential.user;
    } catch (error: any) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      // The currentUserSignal will be automatically updated by the onAuthStateChanged listener
      console.log('User logged in successfully');
    } catch (error: any) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      // The currentUserSignal will be automatically updated by the onAuthStateChanged listener
      console.log('User logged out successfully');
    } catch (error: any) {
      console.error('Error during logout:', error);
      throw error;
    }
  }

  async resendEmailVerification(): Promise<void> {
    try {
      const user = this.currentUser();
      if (user) {
        if (user.emailVerified) {
          throw new Error('Email already verified');
        }
        await sendEmailVerification(user);
      }
      console.log('Email verification sent successfully');
    } catch (error: any) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  async verifyEmail(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
      this.auth.currentUser?.reload(); // triggers onAuthStateChanged
      console.log(this.auth.currentUser);
      console.log('Email verified successfully');
    } catch (error: any) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  async updateUser({ displayName, photoURL }: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const user = this.currentUser();
      if (user) {
        await updateProfile(user, {
          displayName: displayName ? displayName : user.displayName,
          photoURL: photoURL ? photoURL : user.photoURL
        });
        this.auth.currentUser?.reload(); // triggers onAuthStateChanged
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(currentPassword: string): Promise<void> {
    try {
      const user = this.currentUser();
      if (user) {
        const credential = EmailAuthProvider.credential(user.email!, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        // The currentUserSignal will be automatically updated by the onAuthStateChanged listener
        console.log('User deleted from Firebase Authentication');
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async initiateEmailUpdate(newEmail: string, currentPassword: string): Promise<void> {
    try {
      const user = this.currentUser();
      if (!user) {
        throw new Error('No user is currently logged in');
      }

      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Initiate the email verification process
      await verifyBeforeUpdateEmail(user, newEmail);

      console.log('Email update verification sent successfully');
    } catch (error: any) {
      console.error('Error initiating email update:', error);
      throw error;
    }
  }

  async completeEmailUpdate(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
      // will log user out
      console.log('Email updated successfully');
    } catch (error: any) {
      console.error('Error completing email update:', error);
      throw error;
    }
  }

  async recoverEmail(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
      this.auth.currentUser?.reload(); // triggers onAuthStateChanged
      console.log('Email recovered successfully');
    } catch (error: any) {
      console.error('Error recovering email:', error);
      throw error;
    }
  }
}

