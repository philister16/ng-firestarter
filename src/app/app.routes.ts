import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [

  // Redirect to home as default
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  // Unguarded routes
  {
    path: 'auth',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: ':mode',
        loadComponent: () => import('./auth/auth/auth.component').then(m => m.AuthComponent),
      },
      {
        path: 'action',
        loadComponent: () => import('./auth/action/action.component').then(m => m.ActionComponent)
      }
    ]
  },

  // Guarded routes
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./account/account.component').then(m => m.AccountComponent)
      }
    ]
  },

  // 404
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];
