import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { accountResolver } from './account/account.resolver';

export const routes: Routes = [

  // Redirect to home as default
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },

  // Unauthenticated routes
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth/auth.component').then(m => m.AuthComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
      },
      {
        path: 'signup',
        loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'forgot',
        loadComponent: () => import('./auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset',
        loadComponent: () => import('./auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
        path: 'action',
        loadComponent: () => import('./auth/action/action.component').then(m => m.ActionComponent)
      },
    ]
  },

  // Authenticated routes
  {
    path: '',
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    loadComponent: () => import('./nav/nav.component').then(m => m.NavComponent),
    resolve: {
      userAccount: accountResolver,
    },
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'account',
        loadComponent: () => import('./account/account.component').then(m => m.AccountComponent),
      }
    ]
  },

  // Unauthenticated utility routes

  // Unauthorized
  {
    path: 'unauthorized',
    loadComponent: () => import('./auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // 404
  {
    path: '404',
    loadComponent: () => import('./not-found/not-found.component').then(m => m.NotFoundComponent)
  },
  {
    path: '**',
    redirectTo: '404'
  }
];
