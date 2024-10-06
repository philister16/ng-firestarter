import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"ngfirestarter-d9c14","appId":"1:309848632701:web:5e9996b565c94251c2f014","storageBucket":"ngfirestarter-d9c14.appspot.com","locationId":"europe-west","apiKey":"AIzaSyBhrrzRghchYSZhQOKRnZSVZ48BMXMoOOg","authDomain":"ngfirestarter-d9c14.firebaseapp.com","messagingSenderId":"309848632701"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage())]
};
