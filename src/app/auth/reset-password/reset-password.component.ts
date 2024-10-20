import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  isLoading = signal(false);
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
      this.isLoading.set(true);
      const { password } = this.resetPasswordForm.value;
      await this.authService.resetPassword(this.oobCode!, password!);
      this.router.navigate(['/login']);
    } catch (error) {
      // handled by auth service
      return;
    } finally {
      this.isLoading.set(false);
      this.resetPasswordForm.reset();
    }
  }
}
