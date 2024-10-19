import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-change-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-email.component.html'
})
export class ChangeEmailComponent implements OnInit {
  changeEmailForm!: FormGroup;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  email = computed(() => this.authService.currentUser()?.email ?? '');
  isLoading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor() { }

  ngOnInit() {
    this.changeEmailForm = this.fb.group({
      newEmail: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.changeEmailForm.invalid) {
      return;
    }

    try {
      this.isLoading.set(true);
      const { newEmail, password } = this.changeEmailForm.value;
      await this.authService.initiateEmailUpdate(newEmail, password);
      this.successMessage.set('Click the link in your email to complete the update.');
      this.changeEmailForm.reset();
    } catch (error) {
      console.error('Error updating email:', error);
      this.errorMessage.set('Failed to initiate update email');
    } finally {
      this.isLoading.set(false);
    }

  }
}

