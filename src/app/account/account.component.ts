import { Component, inject, signal } from '@angular/core';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AvatarEditComponent } from './avatar-edit/avatar-edit.component';
import { AccountService, UserAccount } from './account.service';
import { DbStatus } from '../core/interfaces';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ProfileEditComponent, ChangeEmailComponent, ChangePasswordComponent, AvatarEditComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  readonly accountService = inject(AccountService);
  readonly account = this.accountService.account;
  dbStatus = signal<DbStatus>([false, '', '']);

  async updateAccount(update: Partial<UserAccount>): Promise<void> {
    try {
      if (!this.account()?.uid) {
        throw new Error('No user found');
      }
      this.dbStatus.set([true, '', '']);
      await this.accountService.updateAccount(this.account()?.uid!, update);
      this.dbStatus.set([false, '', 'Account updated successfully']);
    } catch (error: any) {
      console.error(error);
      this.dbStatus.set([false, error.message ?? 'Unknown error', '']);
    }
  }
}
