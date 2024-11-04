import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.signupForm.invalid) return;
    try {
      this.isLoading = true;
      const { email, password } = this.signupForm.value;
      await this.authService.signUpWithEmailAndPassword(email!, password!);
      this.successMessage = 'Account created successfully. Please check your email for verification and login.';
      this.errorMessage = '';
    } catch (err: any) {
      this.errorMessage = err.message;
      this.successMessage = '';
    } finally {
      this.isLoading = false;
      this.signupForm.reset();
    }
  }
}
