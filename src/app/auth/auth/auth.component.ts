import { Component, OnInit, Signal, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  authForm!: FormGroup;
  // toSignal automatically unsubscribes from the observable
  mode: Signal<'login' | 'signup' | 'forgot'> = toSignal(this.route.paramMap.pipe(map(params => params.get('mode') as 'login' | 'signup' | 'forgot')), { initialValue: 'login' });
  dictionary = computed(() => { return this.mode() === 'login' ? 'Login' : this.mode() === 'signup' ? 'Sign Up' : 'Request Password'; });

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.authForm.invalid) {
      console.error('Invalid form values: ', this.authForm.value);
      return;
    }

    if (this.authForm.valid) {
      console.log(this.authForm.value);
      // Handle form submission
      switch (this.mode()) {
        case 'login':
          // Handle login
          break;
        case 'signup':
          // Handle signup
          break;
        case 'forgot':
          // Handle forgot password
          break;
      }
    }
  }

}
