import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { DbStatus } from '../core/interfaces';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private authService = inject(AuthService);
  readonly user = this.authService.user;
  status = signal<DbStatus>([false, '', '']);


  async logout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async resendEmailVerification() {
    try {
      this.status.set([true, '', '']);
      await this.authService.resendEmailVerification();
      this.status.set([false, '', 'Email verification sent. Please check your email.']);
    } catch (error) {
      this.status.set([false, 'Error sending email verification.', '']);
    }
  }
}
