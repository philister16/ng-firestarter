import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthProvider } from '../auth.service';

@Component({
  selector: 'app-signin-with',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="social-signin">
      <button
        (click)="signInWith(AuthProvider.GOOGLE)"
        [disabled]="isLoading()">
        {{ isLoading() ? 'Signing in...' : 'Sign in with Google' }}
      </button>

      <!-- Commented out until implemented -->
      <!--
      <button
        (click)="signInWith(AuthProvider.FACEBOOK)"
        [disabled]="isLoading()">
        Sign in with Facebook
      </button>

      <button
        (click)="signInWith(AuthProvider.APPLE)"
        [disabled]="isLoading()">
        Sign in with Apple
      </button>
      -->
    </div>
  `
})
export class SigninWithComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = signal(false);

  // Make AuthProvider enum available in template
  protected AuthProvider = AuthProvider;

  async signInWith(provider: AuthProvider): Promise<void> {
    if (this.isLoading()) return;

    try {
      this.isLoading.set(true);
      await this.authService.signInWithProvider(provider);
      this.router.navigate(['/home']);
    } catch (err) {
      // Error handled by auth service
    } finally {
      this.isLoading.set(false);
    }
  }
}
