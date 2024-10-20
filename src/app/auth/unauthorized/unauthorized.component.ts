import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UnauthorizedReason } from '../auth.service';


@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.css'
})
export class UnauthorizedComponent implements OnInit {
  private route = inject(ActivatedRoute);

  message = signal<string>('You are not authorized to access this page.');

  ngOnInit() {
    const reason = this.route.snapshot.queryParamMap.get('reason');
    this.updateMessage(reason);
  }

  private updateMessage(reason: string | null) {
    switch (reason) {
      case UnauthorizedReason.EMAIL_NOT_VERIFIED:
        this.message.set('Please verify your email address to access this page.');
        break;
      case UnauthorizedReason.INSUFFICIENT_PERMISSIONS:
        this.message.set('You do not have the necessary permissions to access this page.');
        break;
      default:
        this.message.set('You are not authorized to access this page.');
    }
  }
}
