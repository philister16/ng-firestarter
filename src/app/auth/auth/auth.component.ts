import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  readonly authService = inject(AuthService);
  readonly authError = this.authService.authError;

}
