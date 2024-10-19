import { Component, Input, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  @Input() displayName!: string;
  @Input() photoURL!: string;
  auth = inject(AuthService);


}
