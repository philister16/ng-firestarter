import { Component, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent {
  private auth = inject(Auth);
  readonly displayName = signal(this.auth.currentUser?.displayName);
  readonly photoURL = signal(this.auth.currentUser?.photoURL);

  // Add methods for updating profile
}
