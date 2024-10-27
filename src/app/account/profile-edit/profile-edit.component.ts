import { Component, inject, signal, input, OnInit, output } from '@angular/core';
import { UserAccount } from '../account.service';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DbStatus } from '../../core/interfaces';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.css'
})
export class ProfileEditComponent implements OnInit {
  account = input<UserAccount | null>();
  dbStatus = input<DbStatus>([false, '', '']);
  onUpdate = output<Partial<UserAccount>>();
  nameHasChanged = signal(false);
  private fb = inject(FormBuilder);
  nameForm!: FormGroup;

  ngOnInit(): void {
    this.nameForm = this.fb.nonNullable.group({
      displayName: [this.account()?.displayName, [Validators.minLength(3), Validators.maxLength(32)]]
    });
  }

  // Add methods for updating profile
  saveName() {
    if (this.nameForm.invalid) {
      return;
    }
    const { displayName } = this.nameForm.value;
    this.onUpdate.emit({ displayName });
    this.nameHasChanged.set(false);
  }
}
