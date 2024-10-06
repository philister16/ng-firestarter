import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-action',
  standalone: true,
  imports: [],
  templateUrl: './action.component.html',
  styleUrl: './action.component.css'
})
export class ActionComponent implements OnInit {
  isWorking = false;
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    const mode = this.route.snapshot.paramMap.get('mode') as 'verifyEmail' | 'resetPassword' | 'recoverEmail';
    this.handleAction(mode);
  }

  handleAction(mode: string): void {
    this.isWorking = true;
    switch (mode) {
      case 'verifyEmail':
        // Handle email verification
        break;
      case 'resetPassword':
        // Handle password reset
        break;
      case 'recoverEmail':
        // Handle email change
        break;
    }
    setTimeout(() => {
      this.isWorking = false;
    }, 2000);
  }
}
