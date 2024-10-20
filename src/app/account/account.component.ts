import { Component, inject } from '@angular/core';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [ProfileEditComponent, ChangeEmailComponent, ChangePasswordComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  readonly accountService = inject(AccountService);
  readonly account = this.accountService.account;
}
