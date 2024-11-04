import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActionMode, AuthService, ActionResult } from '../auth.service';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionComponent implements OnInit {
  isWorking = false;
  errorMessage = '';
  successMessage = '';
  mode: ActionMode | null = null;
  oobCode: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.mode = this.route.snapshot.queryParamMap.get('mode') as ActionMode;
    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode');

    if (!this.mode || !this.oobCode) {
      this.errorMessage = 'No action parameters.';
      return;
    }

    if (this.mode === ActionMode.RESET_PASSWORD) {
      this.delegate();
    } else {
      this.handle();
    }
  }

  async handle(): Promise<void> {
    this.isWorking = true;
    try {
      const result: ActionResult = await this.authService.handleAction(this.mode, this.oobCode);
      if (!result.success) {
        throw new Error('Could not handle action');
      }
      switch (result.mode) {
        case ActionMode.VERIFY_EMAIL:
          this.router.navigate(['/']);
          break;
        case ActionMode.RECOVER_EMAIL:
          this.authService.signOut();
          this.successMessage = result.message;
          break;
        case ActionMode.VERIFY_AND_CHANGE_EMAIL:
          this.authService.signOut();
          this.successMessage = result.message;
          break;
      }
    } catch (error: any) {
      this.errorMessage = error.message;
      this.successMessage = '';
    } finally {
      this.isWorking = false;
    }
  }

  delegate() {
    this.router.navigate(['/auth/reset'], { queryParamsHandling: 'preserve' });
  }
}
