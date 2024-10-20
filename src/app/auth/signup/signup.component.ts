import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  isLoading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.signupForm.invalid) return;
    try {
      this.isLoading.set(true);
      const { email, password } = this.signupForm.value;
      await this.authService.signUpWithEmailAndPassword(email!, password!);
      this.successMessage.set('Account created successfully. Please check your email for verification and login.');
    } catch (err) {
      // handled by service
    } finally {
      this.isLoading.set(false);
      this.signupForm.reset();
    }
  }
}
