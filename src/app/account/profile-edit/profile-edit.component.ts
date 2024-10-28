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
  account = input<Partial<UserAccount> | null>();
  dbStatus = input<DbStatus>([false, '', '']);
  onUpdate = output<Partial<UserAccount>>();
  nameHasChanged = signal(false);
  private fb = inject(FormBuilder);
  nameForm!: FormGroup;

  ngOnInit(): void {
    this.nameForm = this.fb.nonNullable.group({
      firstName: [this.account()?.firstName, [Validators.minLength(3), Validators.maxLength(64)]],
      lastName: [this.account()?.lastName, [Validators.minLength(3), Validators.maxLength(64)]]
    });
  }

  saveName() {
    if (this.nameForm.invalid) {
      return;
    }
    this.onUpdate.emit(this.nameForm.value);
    this.nameHasChanged.set(false);
  }
}
