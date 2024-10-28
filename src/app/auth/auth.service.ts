import { Injectable, signal, inject, computed } from '@angular/core';
import { applyActionCode, confirmPasswordReset, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, updatePassword, updateProfile, User, UserProfile } from '@angular/fire/auth';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { AccountService, UserAccount } from '../account/account.service';

export enum AuthState {
  UNAUTHENTICATED,
  AUTHENTICATED,
  VERIFIED
}

export enum UnauthorizedReason {
  EMAIL_NOT_VERIFIED = 'emailNotVerified',
  INSUFFICIENT_PERMISSIONS = 'insufficientPermissions'
}

export enum ActionMode {
  VERIFY_EMAIL = 'verifyEmail',
  RECOVER_EMAIL = 'recoverEmail',
  VERIFY_AND_CHANGE_EMAIL = 'verifyAndChangeEmail',
  RESET_PASSWORD = 'resetPassword'
}

export interface ActionResult {
  mode: ActionMode;
  success: boolean;
  message: string;
}

export interface UserData {
  auth: User;
  account?: UserAccount;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private accountService = inject(AccountService);
  private userSignal = signal<User | null>(null);
  private authErrorSignal = signal<string | null>(null);

  /**
   * Returns the current user and their account data
   */
  readonly user = computed<UserData | null>(() => {
    if (this.userSignal()) {
      return { auth: this.userSignal(), account: this.accountService.account() } as UserData;
    }
    return null;
  });

  /**
   * Returns the current authentication error
   */
  readonly authError = computed(() => this.authErrorSignal());

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSignal.set(user);
      /// @DEV: account is fetched from firestore by the account resolver on the root route
      if (!user) {
        // clear account if user is not logged in
        this.accountService.clearAccount();
      }
    });
  }

  async signUpWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
      await sendEmailVerification(user);
      await this.accountService.createAccount(user.uid, {});
      return user;
    } catch (error) {
      this.handleAuthenticationError(error as FirebaseError);
      throw error;
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<User | null> {
    try {
      const { user } = await signInWithEmailAndPassword(this.auth, email, password);
      return user;
    } catch (error) {
      this.handleAuthenticationError(error as FirebaseError);
      throw error;
    }
  }

  async passwordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      this.handleAuthenticationError(error as FirebaseError);
      throw error;
    }
  }

  async resetPassword(oobCode: string, newPassword: string): Promise<void> {
    try {
      if (!oobCode || !newPassword) {
        throw new Error('Invalid parameters');
      }
      await confirmPasswordReset(this.auth, oobCode, newPassword);
    } catch (error) {
      this.handleAuthenticationError(error as FirebaseError);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      this.handleAuthenticationError(error as FirebaseError);
      throw error;
    }
  }

  async handleAction(mode: ActionMode | null, oobCode: string | null): Promise<ActionResult> {
    if (!mode || !oobCode) {
      throw new Error('Invalid action parameters');
    }

    let result: ActionResult;
    try {
      await applyActionCode(this.auth, oobCode);
      switch (mode) {
        case ActionMode.VERIFY_EMAIL:
          await this.auth.currentUser?.reload();
          this.userSignal.set(this.auth.currentUser);
          result = { mode, success: true, message: 'Email verified successfully.' };
          break;
        case ActionMode.RECOVER_EMAIL:
          result = { mode, success: true, message: 'Email recovered successfully.' };
          break;
        case ActionMode.VERIFY_AND_CHANGE_EMAIL:
          result = { mode, success: true, message: 'Email verified and changed successfully.' };
          break;
        default:
          throw new Error('Invalid action mode');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  async resendEmailVerification(): Promise<void> {
    try {
      if (!this.auth.currentUser) {
        throw new Error('No user is currently signed in.');
      }
      await sendEmailVerification(this.auth.currentUser);
    } catch (error) {
      throw error;
    }
  }

  async resolveAuthentication(): Promise<AuthState> {
    try {
      await this.auth.authStateReady();
      const user = this.auth.currentUser;
      if (user && user.emailVerified) {
        return AuthState.VERIFIED;
      } else if (user) {
        return AuthState.AUTHENTICATED;
      } else {
        return AuthState.UNAUTHENTICATED;
      }
    } catch (error) {
      throw error;
    }
  }

  private patchUserSignal(user: Partial<User>) {
    this.userSignal.update((currentUser) => {
      return { ...currentUser, ...user } as User;
    });
  }

  private handleAuthenticationError(error: FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
        this.authErrorSignal.set('Invalid credentials.');
        break;
      case 'auth/invalid-email':
        this.authErrorSignal.set('Invalid email address.');
        break;
      case 'auth/user-disabled':
        this.authErrorSignal.set('This user account has been disabled.');
        break;
      case 'auth/user-not-found':
        this.authErrorSignal.set('No user found with this email.');
        break;
      case 'auth/wrong-password':
        this.authErrorSignal.set('Incorrect password.');
        break;
      case 'auth/email-already-in-use':
        this.authErrorSignal.set('Email is already in use.');
        break;
      case 'auth/weak-password':
        this.authErrorSignal.set('Password is too weak.');
        break;
      case 'auth/operation-not-allowed':
        this.authErrorSignal.set('Operation not allowed.');
        break;
      case 'auth/account-exists-with-different-credential':
        this.authErrorSignal.set('An account already exists with the same email address but different sign-in credentials.');
        break;
      case 'auth/requires-recent-login':
        this.authErrorSignal.set('This operation is sensitive and requires recent authentication. Log in again before retrying.');
        break;
      case 'auth/too-many-requests':
        this.authErrorSignal.set('Access to this account has been temporarily disabled due to many failed login attempts. Try again later.');
        break;
      case 'auth/network-request-failed':
        this.authErrorSignal.set('A network error occurred. Please check your connection and try again.');
        break;
      case 'auth/invalid-action-code':
        this.authErrorSignal.set('Invalid action code.');
        break;
      default:
        this.authErrorSignal.set(error.message || 'An unknown authentication error occurred.');
    }
    // Log the error for debugging purposes
    console.error('Authentication error:', error);
  }
}
