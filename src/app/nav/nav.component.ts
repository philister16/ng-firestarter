import { Component, inject, computed } from '@angular/core';
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
  readonly currentUser = this.authService.currentUser;
  readonly isLoggedIn = this.authService.isLoggedIn;
  readonly isEmailVerified = computed(() => this.currentUser()?.emailVerified ?? false);

  async logout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async resendEmailVerification() {
    try {
      if (this.currentUser() !== null) {
        await this.authService.resendEmailVerification(this.currentUser()!);
      }
    } catch (error) {
      console.error('Error sending email verification:', error);
    }
  }

}
