import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable, getDownloadURL, deleteObject, updateMetadata, UploadTaskSnapshot } from '@angular/fire/storage';
import { FirebaseError } from 'firebase/app';

export interface UploadProgress {
  progress: number;
  downloadURL: string | null;
}

export interface ImageProperties {
  width: number;
  height: number;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = inject(Storage);

  handleError(error: FirebaseError): string {
    if (error instanceof FirebaseError) {
      switch (error.code) {
        case 'storage/unauthorized':
          return 'You do not have permission to access this file.';
        case 'storage/canceled':
          return 'Upload was cancelled.';
        case 'storage/object-not-found':
          return 'File does not exist.';
        case 'storage/quota-exceeded':
          return 'Storage quota exceeded.';
        case 'storage/retry-limit-exceeded':
          return 'Maximum time limit exceeded. Please try uploading again.';
        default:
          return 'An error occurred during the upload.';
      }
    }
    return 'An unexpected error occurred.';
  }

  uploadFile(file: File, path: string, progressCallback?: (progress: UploadProgress) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      const storageRef = ref(this.storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot: UploadTaskSnapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progressCallback) {
            progressCallback({ progress, downloadURL: null });
          }
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (progressCallback) {
            progressCallback({ progress: 100, downloadURL });
          }
          resolve(downloadURL);
        }
      );
    });
  }

  updateFile(file: File, path: string): Promise<string> {
    return this.uploadFile(file, path);
  }

  deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    return deleteObject(storageRef);
  }

  updateMetadata(path: string, metadata: any): Promise<any> {
    const storageRef = ref(this.storage, path);
    return updateMetadata(storageRef, metadata);
  }

  getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }

  resizeImage(file: File, properties: ImageProperties, type: string = 'image/webp'): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        canvas.width = properties.width;
        canvas.height = properties.height;

        // Calculate scaling and position for cropping
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / scale - img.width) / 2;
        const y = (canvas.height / scale - img.height) / 2;

        ctx.drawImage(img, x, y, img.width, img.height, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, type, 1); // You can adjust quality here
      };
      img.onerror = (error) => reject(error);
    });
  }
}
