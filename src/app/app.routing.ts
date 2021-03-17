import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuard } from './_helpers/auth.guard';

export const AppRoutes: Routes = [
 
  { path: '', component: AdminLayoutComponent, loadChildren: () => import('./home/home.module').then(m => m.HomeModule), 
    canActivate: [AuthGuard] 
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadChildren: () => import('./authentication/login-system-admin/login-system-admin.module').then(m => m.LoginSystemAdminModule),
      },
      {
        path: 'admin/register',
        loadChildren: () => import('./authentication/register-system-admin/register-system-admin.module')
          .then(m => m.RegisterSystemAdminModule),
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [ 
      {
        path: 'signalr',
        loadChildren: () => import('./signalr/signalr.module').then(m => m.SignalrModule),
      },
      {
        path: 'host-vclass',
        loadChildren: () => import('./vclass/enroll-student.module').then(m => m.EnrollStudentModule),
      },
      {
        path: 'participant-vclass',
        loadChildren: () => import('./vclass-student/vclass-student.module').then(m => m.VClassStudentModule),
      },      
      {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
         //canActivate: [AuthGuard]
      },
      {
        path: 'user-list',
        loadChildren: () => import('./user-list/user-list.module').then(m => m.UserListModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'dormitory',
        loadChildren: () => import('./dormitory/dormitory.module').then(m => m.DormitoryModule),
        // canActivate: [AuthGuard]
      },
    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
