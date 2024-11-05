import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AsyncStatus } from '../core/interfaces';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
  private authService = inject(AuthService);
  readonly user = this.authService.user;
  status = signal<AsyncStatus>([false, '', '']);


  async logout() {
    try {
      await this.authService.signOut();
    } catch (error) {
      // TODO: handle error
      console.error('Error during logout:', error);
    }
  }

  async resendEmailVerification() {
    try {
      this.status.set([true, '', '']);
      await this.authService.resendEmailVerification();
      this.status.set([false, '', 'Email verification sent. Please check your email.']);
    } catch (error) {
      // TODO: handle error
      this.status.set([false, 'Error sending email verification.', '']);
    }
  }
}
