import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbStatus } from '../../core/interfaces';

@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})
export class DeleteUserComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
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
    } catch (err: any) {
      this.dbStatus.set([false, err.message, '']);
    }
  }
}
