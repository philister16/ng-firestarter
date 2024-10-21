import { Component, inject, signal } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  private authService = inject(AuthService);
  private user = this.authService.user;
  private accountService = inject(AccountService);
  readonly account = this.accountService.account;
  nameHasChanged = signal(false);
  isSavingName = signal(false);
  resultMessage = signal('');
  private fb = inject(FormBuilder);
  nameForm = this.fb.nonNullable.group({
    displayName: [this.account()?.displayName, [Validators.minLength(3), Validators.maxLength(32)]]
  });


  // Add methods for updating profile
  async saveName(): Promise<void> {
    if (this.nameForm.invalid) {
      return;
    }
    try {
      this.isSavingName.set(true);
      const { displayName } = this.nameForm.value;
      if (!this.user()) {
        throw new Error('No user found');
      }
      const { uid } = this.user()!;
      await this.accountService.updateAccount(uid, { displayName });
      this.resultMessage.set('Name updated successfully');
    } catch (error) {
      this.resultMessage.set('Failed to update name');
      throw error;
    } finally {
      this.nameHasChanged.set(false);
      this.isSavingName.set(false);
    }
  }
}
