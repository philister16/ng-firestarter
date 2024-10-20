import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { applyActionCode, Auth, confirmPasswordReset } from '@angular/fire/auth';
import { AccountService } from '../../account/account.service';
@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements OnInit {
  @ViewChild('resetForm') resetForm!: NgForm;
  isWorking = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  mode: 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail' | null = null;
  oobCode: string | null = null;

  private route = inject(ActivatedRoute);
  private auth = inject(Auth);
  private router = inject(Router);
  private accountService = inject(AccountService);

  ngOnInit(): void {
    this.mode = this.route.snapshot.queryParamMap.get('mode') as 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail';
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (this.mode && this.oobCode) {
      // For password reset we need the user to fill in the form first
      if (this.mode === 'resetPassword') {
        return;
      }

      // For other actions we can handle the action code right away
      this.handleAction(this.mode, this.oobCode);
    } else {
      this.errorMessage.set('Invalid action parameters');
    }
  }

  async handleAction(mode: 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail', oobCode: string): Promise<void> {
    this.isWorking.set(true);
    try {
      // Define messages for each mode
      const messages: any = {
        verifyEmail: 'Email verified successfully.',
        recoverEmail: 'Previous email recovered successfully. Please login with your previous email.',
        verifyAndChangeEmail: 'Email changed successfully. Please login with your new email.'
      };

      // Validate mode
      if (!(mode in messages)) {
        throw new Error('Invalid action mode');
      }

      // Apply action code
      await applyActionCode(this.auth, oobCode);

      // Navigate to account page for email change
      if (this.mode === 'verifyAndChangeEmail' || this.mode === 'recoverEmail') {
        // Firebase logs out after email change! Therefore we don't reload the user to avoid an error.
        this.router.navigate(['/account']);
      }

      // Navigate home after initial email verification, happens right after signup
      if (mode === 'verifyEmail') {
        if (this.auth.currentUser) {
          // Reload user to ensure emailVerified is updated
          await this.auth.currentUser?.reload();
        }
        // Update local account data. We want to be sure that emailVerified was updated server side first.
        if (this.auth.currentUser?.emailVerified) {
          this.accountService.updateAccount(this.auth.currentUser?.uid, { emailVerified: true });
        }
        this.router.navigate(['/']);
        this.successMessage.set(messages[mode]);
      }

    } catch (error: any) {
      this.errorMessage.set(`An error occurred: ${error.message}`);
    } finally {
      this.isWorking.set(false);
    }
  }

  async onResetPassword(form: NgForm) {
    if (form.valid && this.oobCode) {
      const { password, confirmPassword } = form.value;

      if (password !== confirmPassword) {
        this.errorMessage.set('Passwords do not match.');
        return;
      }

      this.isWorking.set(true);
      this.errorMessage.set(null);
      this.successMessage.set(null);

      try {
        await confirmPasswordReset(this.auth, this.oobCode, password);
        this.successMessage.set('Password reset successfully. You can now log in with your new password.');
      } catch (error: any) {
        this.errorMessage.set('An error occurred while resetting the password: ' + error.message);
      } finally {
        this.isWorking.set(false);
      }
    }
  }
}
