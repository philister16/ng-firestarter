import { Component, input, inject, signal, output, ChangeDetectionStrategy } from '@angular/core';
import { UserAccount } from '../account.service';
import { StorageService } from '../../core/storage.service';
import { AsyncStatus } from '../../core/interfaces';
import { FirebaseError } from 'firebase/app';
import { UserData } from '../../auth/auth.service';
@Component({
  selector: 'app-avatar-edit',
  standalone: true,
  imports: [],
  templateUrl: './avatar-edit.component.html',
  styleUrl: './avatar-edit.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AvatarEditComponent {
  user = input<UserData | null>();
  dbStatus = input<AsyncStatus>([false, '', '']);
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
      const url = await this.storageService.uploadFile(resizedImage, `avatar/${this.user()?.auth.uid}`, (status) => {
        this.progress.set(status.progress);
      });
      this.onUpdate.emit({ profilePicture: url });
    } catch (error) {
      const message = this.storageService.handleError(error as FirebaseError);
      this.errorMessage.set(message);
      throw error;
    }
  }

}
