import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UnauthorizedReason } from '../auth.service';


@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrls: ['./unauthorized.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnauthorizedComponent implements OnInit {
  private route = inject(ActivatedRoute);

  content: { heading: string, message: string } = { heading: 'Unauthorized Access', message: 'You are not authorized to access this page.' };

  ngOnInit() {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    this.updateMessage(reason);
  }

  private updateMessage(reason: string | null) {
    switch (reason) {
      case UnauthorizedReason.EMAIL_NOT_VERIFIED:
        this.content = { heading: 'Email Not Verified', message: 'Please verify your email address to access this page.' };
        break;
      case UnauthorizedReason.INSUFFICIENT_PERMISSIONS:
        this.content = { heading: 'Insufficient Permissions', message: 'You do not have the necessary permissions to access this page.' };
        break;
      default:
        this.content = { heading: 'Unauthorized Access', message: 'You are not authorized to access this page.' };
    }
  }
}
