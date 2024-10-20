import { Component, inject, signal, computed, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth, updateEmail, EmailAuthProvider, reauthenticateWithCredential, sendEmailVerification, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {
  @Input() email: string | undefined = '';
  private auth = inject(Auth);
  private fb = inject(FormBuilder);

  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  changeEmailForm = this.fb.nonNullable.group({
    newEmail: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit() {
    if (this.changeEmailForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const { newEmail, password } = this.changeEmailForm.value;
      if (!newEmail || !password) throw new Error('Invalid form data');
      await this.updateUserEmail(newEmail, password);
      this.handleSuccess(newEmail);
    } catch (error) {
      this.handleError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async updateUserEmail(newEmail: string, password: string): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) throw new Error('No authenticated user found');
    if (!user.email) throw new Error('Current user email is null');

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await verifyBeforeUpdateEmail(user, newEmail);
    } catch (error) {
      console.error('Error in updateUserEmail:', error);
      throw error;
    }
  }

  private handleSuccess(newEmail: string): void {
    this.successMessage.set(`Verification email sent to ${newEmail}. Please check your inbox and verify the new email address to complete the update.`);
    this.changeEmailForm.reset();
  }

  private handleError(error: unknown): void {
    console.error('Error updating email:', error);

    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'auth/requires-recent-login':
          this.errorMessage.set('Please sign in again before updating your email.');
          break;
        case 'auth/invalid-email':
          this.errorMessage.set('The email address is badly formatted.');
          break;
        case 'auth/email-already-in-use':
          this.errorMessage.set('The email address is already in use by another account.');
          break;
        case 'auth/wrong-password':
          this.errorMessage.set('The password is invalid.');
          break;
        case 'auth/operation-not-allowed':
          this.errorMessage.set('Email change is not allowed. Please contact support.');
          break;
        default:
          this.errorMessage.set(`Failed to update email: ${error.message}`);
      }
    } else {
      this.errorMessage.set('An unexpected error occurred. Please try again.');
    }
  }
}
