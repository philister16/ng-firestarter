import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountService } from './account/account.service';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-firestarter';
  readonly accountService = inject(AccountService);
  readonly account = this.accountService.account;
}
