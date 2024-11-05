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
  quality?: number;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private storage: Storage = inject(Storage);

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
        (error) => reject(error.message = this.getErrorMessage(error as FirebaseError)),
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

  async updateFile(file: File, path: string): Promise<string> {
    try {
      return await this.uploadFile(file, path);
    } catch (error: any) {
      error.message = this.getErrorMessage(error as FirebaseError);
      throw error;
    }
  }

  async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(this.storage, path);
      return await deleteObject(storageRef);
    } catch (error: any) {
      error.message = this.getErrorMessage(error as FirebaseError);
      throw error;
    }
  }

  async updateMetadata(path: string, metadata: any): Promise<any> {
    try {
      const storageRef = ref(this.storage, path);
      return await updateMetadata(storageRef, metadata);
    } catch (error: any) {
      error.message = this.getErrorMessage(error as FirebaseError);
      throw error;
    }
  }

  async getDownloadURL(path: string): Promise<string> {
    try {
      const storageRef = ref(this.storage, path);
      return await getDownloadURL(storageRef);
    } catch (error: any) {
      error.message = this.getErrorMessage(error as FirebaseError);
      throw error;
    }
  }

  resizeImage(file: File, properties: ImageProperties): Promise<File> {
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
              type: properties.type || 'image/webp',
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        }, properties.type || 'image/webp', properties.quality || 1);
      };
      img.onerror = (error) => reject(error);
    });
  }

  async purgeUserFiles(uid: string): Promise<void> {
    const avatarRef = ref(this.storage, `avatar/${uid}`);
    try {
      await deleteObject(avatarRef);
    } catch (error: any) {
      error.message = this.getErrorMessage(error as FirebaseError);
      throw error;
    }
  }

  private getErrorMessage(error: FirebaseError): string {
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
        case 'storage/invalid-checksum':
          return 'File on the client does not match file received by the server.';
        case 'storage/server-file-wrong-size':
          return 'File on the client does not match the size of the file received by the server.';
        case 'storage/unknown':
          return 'An unknown error occurred.';
        case 'storage/invalid-url':
          return 'Invalid URL provided to refFromURL().';
        case 'storage/invalid-argument':
          return 'Invalid argument provided.';
        case 'storage/no-default-bucket':
          return 'No default bucket found. Did you set the storageBucket property?';
        case 'storage/cannot-slice-blob':
          return 'Cannot slice blob for upload. Please try again.';
        case 'storage/unauthenticated':
          return 'User is unauthenticated. Please authenticate and try again.';
        default:
          return error.message || 'An error occurred during the upload.';
      }
    }
    return 'An unexpected error occurred.';
  }
}
