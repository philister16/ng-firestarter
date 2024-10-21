import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { AccountService } from './account/account.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-firestarter';
  private authService = inject(AuthService);
  readonly user = this.authService.userData;
  private accountService = inject(AccountService);
  readonly account = this.accountService.account;
}
