import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  async onSubmit() {
    if (this.loginForm.invalid) return;
    try {
      this.isLoading.set(true);
      const { email, password } = this.loginForm.value;
      await this.authService.signInWithEmailAndPassword(email!, password!);
      this.router.navigate(['/home']);
    } catch (err: any) {
      // handled in auth service
    } finally {
      this.isLoading.set(false);
      this.loginForm.reset();
    }
  }
}
