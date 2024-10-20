import { Component, computed, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RouterLink, RouterOutlet } from '@angular/router';
import { sendEmailVerification } from '@angular/fire/auth';
import { AccountService } from '../account/account.service';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private auth = inject(Auth);
  private accountService = inject(AccountService);
  readonly account = this.accountService.account;

  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async resendEmailVerification() {
    try {
      if (this.auth.currentUser) {
        await sendEmailVerification(this.auth.currentUser);
      }
    } catch (error) {
      console.error('Error sending email verification:', error);
    }
  }
}
