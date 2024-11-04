import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SigninWithComponent } from '../signin-with/signin-with.component';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [RouterOutlet, RouterLink, SigninWithComponent],
  templateUrl: './auth.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthComponent {

}
