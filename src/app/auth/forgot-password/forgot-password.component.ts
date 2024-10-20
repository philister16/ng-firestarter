import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  isLoading = signal(false);
  successMessage = signal('');

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async onSubmit() {
    if (this.forgotPasswordForm.invalid) return;
    try {
      this.isLoading.set(true);
      const { email } = this.forgotPasswordForm.value;
      await this.authService.passwordResetEmail(email!);
      this.successMessage.set('Password reset email sent. Please check your email.');
    } catch (err: any) {
      // handled in auth service
    } finally {
      this.isLoading.set(false);
      this.forgotPasswordForm.reset();
    }
  }
}
