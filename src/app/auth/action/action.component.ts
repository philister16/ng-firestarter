import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements OnInit {
  isWorking = signal(false);
  isComplete = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);

  ngOnInit(): void {
    const mode = this.route.snapshot.queryParamMap.get('mode') as 'verifyEmail' | 'resetPassword' | 'recoverEmail';
    const oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (mode && oobCode) {
      this.handleAction(mode, oobCode);
    } else {
      this.errorMessage.set('Invalid action parameters');
    }
  }

  async handleAction(mode: string, oobCode: string): Promise<void> {
    this.isWorking.set(true);
    try {
      switch (mode) {
        case 'verifyEmail':
          await this.authService.verifyEmail(oobCode);
          this.successMessage.set('Email verified successfully');
          this.isComplete.set(true);
          break;
        case 'resetPassword':
          // Handle password reset
          break;
        case 'recoverEmail':
          // Handle email change
          break;
        default:
          throw new Error('Invalid action mode');
      }
    } catch (error: any) {
      this.errorMessage.set(error.message || 'An error occurred');
    } finally {
      this.isWorking.set(false);
    }
  }
}
