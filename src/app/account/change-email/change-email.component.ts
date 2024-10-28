import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { DbStatus } from '../../core/interfaces';

@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private user = this.authService.user;
  readonly email = computed(() => this.user()?.auth?.email ?? '');
  dbStatus = signal<DbStatus>([false, '', '']);
  showUpdate = signal(false);

  changeEmailForm = this.fb.nonNullable.group({
    newEmail: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  async onSubmit() {
    if (this.changeEmailForm.invalid) return;
    try {
      this.dbStatus.set([true, '', '']);
      const { newEmail, password } = this.changeEmailForm.value;
      if (!newEmail || !password) throw new Error('Invalid form data');
      await this.authService.verifyBeforeUpdateEmail(newEmail, password);
      this.dbStatus.set([false, '', 'Email verification sent to ' + newEmail + '. Please check your inbox to complete the change.']);
      this.toggleUpdate();
      this.changeEmailForm.reset();
    } catch (error) {
      this.dbStatus.set([false, '', (error as Error).message || 'Failed to send update email']);
    }
  }

  toggleUpdate() {
    this.showUpdate.update(v => !v);
  }
}
