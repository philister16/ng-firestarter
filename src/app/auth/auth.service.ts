import { Injectable, inject, signal, Signal, computed } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential, sendEmailVerification, applyActionCode, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, updateProfile } from '@angular/fire/auth';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private accountService = inject(AccountService);

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

  async signup(email: string, password: string): Promise<void> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      await this.accountService.createUser(userCredential.user.uid, email);

      console.log('User signed up successfully');
    } catch (error: any) {
      console.error('Error during signup:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);

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

  async resendEmailVerification(user: User): Promise<void> {
    try {
      await sendEmailVerification(user);
      console.log('Email verification sent successfully');
    } catch (error: any) {
      console.error('Error sending email verification:', error);
      throw error;
    }
  }

  async verifyEmail(oobCode: string): Promise<void> {
    try {
      await applyActionCode(this.auth, oobCode);
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
        await updateProfile(user, { displayName, photoURL });
        await this.accountService.updateUser(user.uid, { displayName, photoURL });
      }
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
}
