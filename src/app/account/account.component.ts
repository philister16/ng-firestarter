import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AvatarEditComponent } from './avatar-edit/avatar-edit.component';
import { AccountService, UserAccount } from './account.service';
import { AsyncStatus } from '../core/interfaces';
import { AuthService } from '../auth/auth.service';
import { DeleteUserComponent } from './delete-user/delete-user.component';
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ProfileEditComponent, AvatarEditComponent, ChangeEmailComponent, ChangePasswordComponent, DeleteUserComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent {
  readonly accountService = inject(AccountService);
  readonly userService = inject(AuthService);
  readonly user = this.userService.user;
  readonly account = computed(() => this.user()?.account);
  dbStatus = signal<AsyncStatus>([false, '', '']);

  async updateAccount(update: Partial<UserAccount>): Promise<void> {
    try {
      if (!this.user()?.auth.uid) {
        throw new Error('No user found');
      }
      this.dbStatus.set([true, '', '']);
      await this.accountService.updateAccount(this.user()?.auth.uid!, update);
      this.dbStatus.set([false, '', 'Account updated successfully']);
    } catch (error: any) {
      console.error(error);
      this.dbStatus.set([false, error.message ?? 'Unknown error', '']);
    }
  }
}
