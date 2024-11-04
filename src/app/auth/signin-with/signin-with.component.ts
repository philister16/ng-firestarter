import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, AuthProvider } from '../auth.service';

@Component({
  selector: 'app-signin-with',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signin-with.component.html',
  styleUrls: ['./signin-with.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninWithComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = false;
  errorMessage = '';

  // Make AuthProvider enum available in template
  protected AuthProvider = AuthProvider;

  async signInWith(provider: AuthProvider): Promise<void> {
    if (this.isLoading) return;

    try {
      this.isLoading = true;
      await this.authService.signInWithProvider(provider);
      this.router.navigate(['/home']);
    } catch (err: any) {
      this.errorMessage = err.message;
    } finally {
      this.isLoading = false;
    }
  }
}
