import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, UserCredential, sendEmailVerification, applyActionCode } from '@angular/fire/auth';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private accountService = inject(AccountService);

  async signup(email: string, password: string): Promise<void> {
    try {
      // Create user with email and password
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.auth, email, password);

      // Send email verification
      if (userCredential.user) {
        await sendEmailVerification(userCredential.user);
      }

      // Create user document
      await this.accountService.createUser(userCredential.user.uid, email);

      console.log('User signed up successfully');
    } catch (error: any) {
      console.error('Error during signup:', error);
      throw error; // Re-throw the error to be handled by the component
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
}
