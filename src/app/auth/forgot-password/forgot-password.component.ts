import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    try {
      this.isLoading = true;
      const { email } = this.forgotPasswordForm.value;
      await this.authService.passwordResetEmail(email!);
      this.successMessage = 'Password reset email sent. Please check your email.';
      this.errorMessage = '';
    } catch (err: any) {
      this.errorMessage = err.message;
      this.successMessage = '';
    } finally {
      this.isLoading = false;
      this.forgotPasswordForm.reset();
    }
  }
}
