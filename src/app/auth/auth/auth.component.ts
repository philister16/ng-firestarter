import { Component, inject, ViewChild, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../account/account.service';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  @ViewChild('authForm') authForm!: NgForm;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);
  private accountService = inject(AccountService);
  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);
  mode = toSignal(this.route.paramMap.pipe(
    map(params => {
      const mode = params.get('mode') as 'login' | 'signup' | 'forgot' | 'verify';
      if (!['login', 'signup', 'forgot', 'verify'].includes(mode)) {
        this.router.navigateByUrl('/404');
      }
      return mode;
    })
  ));

  async onSubmit() {
    if (this.authForm.invalid) return;

    this.errorMessage.set('');
    this.successMessage.set('');
    this.isLoading.set(true);

    const { email, password } = this.authForm.value;

    try {
      await this.handleAuthAction(email, password);
    } catch (error: any) {
      this.errorMessage.set(error.message);
    } finally {
      this.authForm.reset();
      this.isLoading.set(false);
    }
  }

  private async handleAuthAction(email: string, password: string): Promise<void> {
    switch (this.mode()) {
      case 'login':
        await signInWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/home']);
        break;
      case 'signup':
        const { user } = await createUserWithEmailAndPassword(this.auth, email, password);
        await sendEmailVerification(user);
        await this.accountService.createAccount(user, { roles: 'user' });
        this.successMessage.set('Account created successfully. Please check your email for verification.');
        break;
      case 'forgot':
        await sendPasswordResetEmail(this.auth, email);
        this.successMessage.set('Password reset email sent. Please check your inbox.');
        break;
    }
  }

  async sendVerificationEmail() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await sendEmailVerification(user);
        this.successMessage.set('Verification email sent. Please check your inbox and click the link to verify your email.');
      }
    } catch (error: any) {
      this.errorMessage.set(error.message);
    }
  }
}
