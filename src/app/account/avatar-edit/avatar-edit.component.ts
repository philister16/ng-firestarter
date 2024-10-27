import { Component, input, inject, signal, output } from '@angular/core';
import { UserAccount } from '../account.service';
import { StorageService } from '../../core/storage.service';
import { DbStatus } from '../../core/interfaces';
import { FirebaseError } from 'firebase/app';
@Component({
  selector: 'app-avatar-edit',
  standalone: true,
  imports: [],
  templateUrl: './avatar-edit.component.html',
  styleUrl: './avatar-edit.component.css'
})
export class AvatarEditComponent {
  account = input<UserAccount | null>();
  dbStatus = input<DbStatus>([false, '', '']);
  onUpdate = output<Partial<UserAccount>>();
  storageService = inject(StorageService);
  progress = signal<number>(0);
  errorMessage = signal<string>('');
  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  async uploadFile(file: File): Promise<void> {
    try {
      const resizedImage = await this.storageService.resizeImage(file, { width: 100, height: 100 });
      const url = await this.storageService.uploadFile(resizedImage, `avatar/${this.account()?.uid}`, (status) => {
        this.progress.set(status.progress);
      });
      this.onUpdate.emit({ photoURL: url });
    } catch (error) {
      const message = this.storageService.handleError(error as FirebaseError);
      this.errorMessage.set(message);
      throw error;
    }
  }

}
