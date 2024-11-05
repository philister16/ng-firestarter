import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { DbStatus } from '../../core/interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  dbStatus = signal<DbStatus>([false, '', '']);
  changePasswordForm = this.fb.group({
    password: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  async onSubmit(): Promise<void> {
    if (this.changePasswordForm.invalid) {
      return;
    }
    try {
      this.dbStatus.set([true, '', '']);
      const { password, newPassword } = this.changePasswordForm.value;
      await this.authService.updatePassword(password!, newPassword!);
      this.dbStatus.set([false, '', 'Password updated successfully.']);
      this.changePasswordForm.reset();
    } catch (error: any) {
      console.error(error);
      this.dbStatus.set([false, error.message || 'Error: Failed to update password.', '']);
    }
  }

}
