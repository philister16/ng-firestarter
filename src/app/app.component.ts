import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AuthService } from './auth/auth.service';
import { computed } from '@angular/core';

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
  readonly user = this.authService.user;
  readonly userCompact = computed(() => {
    const { uid, email, emailVerified, displayName, photoURL } = this.user()?.auth || {};
    return { auth: { uid, email, emailVerified, displayName, photoURL }, account: this.user()?.account };
  });
}
