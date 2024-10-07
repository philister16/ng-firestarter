import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  authForm!: FormGroup;
  mode: Signal<'login' | 'signup' | 'forgot'> = toSignal(
    this.route.paramMap.pipe(map(params => params.get('mode') as 'login' | 'signup' | 'forgot')),
    { initialValue: 'login' }
  );
  dictionary = computed(() => this.mode() === 'login' ? 'Login' : this.mode() === 'signup' ? 'Sign Up' : 'Request Password');
  error: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.authForm.invalid) {
      console.error('Invalid form values: ', this.authForm.value);
      return;
    }

    const { email, password } = this.authForm.value;

    this.isLoading = true;
    this.error = null;

    try {
      switch (this.mode()) {
        case 'login':
          // Handle login
          break;
        case 'signup':
          await this.authService.signup(email, password);
          console.log('Signup successful');
          this.router.navigate(['/home']);
          break;
        case 'forgot':
          // Handle forgot password
          break;
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      this.error = err.message;
    } finally {
      this.isLoading = false;
      this.authForm.reset();
    }
  }
}
