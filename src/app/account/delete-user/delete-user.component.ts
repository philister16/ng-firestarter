import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbStatus } from '../../core/interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteUserComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  dbStatus = signal<DbStatus>([false, '', '']);

  deleteUserForm = this.fb.group({
    password: ['', Validators.required],
    confirmation: [false, Validators.requiredTrue],
  });

  async onSubmit(): Promise<void> {
    if (this.deleteUserForm.invalid) {
      return;
    }
    try {
      this.dbStatus.set([true, '', '']);
      const password = this.deleteUserForm.value.password;
      await this.authService.deleteUser(password ?? '');
      this.dbStatus.set([false, '', 'Account deleted successfully']);
      await this.router.navigate(['/', 'unauthorized'], { queryParams: { reason: 'userDeleted' } });
    } catch (err: any) {
      this.dbStatus.set([false, err.message, '']);
    }
  }
}
