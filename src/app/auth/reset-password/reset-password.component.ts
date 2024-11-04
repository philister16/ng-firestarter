import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  oobCode: string | null = null;
  resetPasswordForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.oobCode = this.route.snapshot.queryParams['oobCode'];
  }

  async onSubmit(): Promise<void> {
    if (this.resetPasswordForm.invalid) {
      return;
    }
    try {
      this.isLoading = true;
      const { password } = this.resetPasswordForm.value;
      await this.authService.resetPassword(this.oobCode!, password!);
      this.successMessage = 'Password reset successful. Please login with your new password.';
      this.errorMessage = '';
    } catch (error: any) {
      this.errorMessage = error.message;
      this.successMessage = '';
    } finally {
      this.isLoading = false;
      this.resetPasswordForm.reset();
    }
  }
}
