import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
  successMessage = signal('');
  errorMessage = signal('');

  async logout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async resendEmailVerification() {
    try {
      await this.authService.resendEmailVerification();
      this.successMessage.set('Email verification sent. Please check your email.');
    } catch (error) {
      this.errorMessage.set('Error sending email verification.');
    }
  }
}
