import { Component, inject } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  private accountService = inject(AccountService);
  readonly account = this.accountService.account;

  // Add methods for updating profile
}
