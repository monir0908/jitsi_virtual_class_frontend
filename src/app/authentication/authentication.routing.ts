import { Routes } from '@angular/router';

import { ForgotComponent } from './forgot/forgot.component';
import {LockScreenComponent} from './lock-screen/lock-screen.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      // {
      //   path: 'login',
      //   loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
      //   data: {
      //     breadcrumb: 'Login'
      //   }
      // },
      {
        path: 'forgot',
        component: ForgotComponent,
        data: {
          breadcrumb: 'Forgot'
        }
      },
      {
      path: 'lock-screen',
      component: LockScreenComponent,
        data: {
          breadcrumb: 'Lock Screen'
        }
    }]
  }
];
