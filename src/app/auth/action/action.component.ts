import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements OnInit {
  isWorking = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  mode: 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail' | null = null;
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.mode = this.route.snapshot.queryParamMap.get('mode') as 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail';
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (this.mode && oobCode) {
      this.handleAction(this.mode, oobCode);
    } else {
      this.errorMessage.set('Invalid action parameters');
    }
  }

  async handleAction(mode: 'verifyEmail' | 'resetPassword' | 'recoverEmail' | 'verifyAndChangeEmail', oobCode: string): Promise<void> {
    this.isWorking.set(true);
    try {
      switch (mode) {
        case 'verifyEmail':
          await this.authService.verifyEmail(oobCode);
          this.successMessage.set('Email verified successfully.');
          break;
        case 'resetPassword':
          // Handle password reset
          break;
        case 'recoverEmail':
          await this.authService.recoverEmail(oobCode);
          this.successMessage.set('Previous email recovered successfully. Please login with your previous email.');
          break;
        case 'verifyAndChangeEmail':
          await this.authService.completeEmailUpdate(oobCode);
          this.successMessage.set('Email changed successfully. Please login with your new email.');
          break;
        default:
          throw new Error('Invalid action mode');
      }
    } catch (error: any) {
      this.errorMessage.set('An error occurred: ' + error.message);
    } finally {
      this.isWorking.set(false);
    }
  }
}
