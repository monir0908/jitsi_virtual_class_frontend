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
        path: 'host-vclass',
        loadChildren: () => import('./vclass-host/vclass-host.module').then(m => m.VClassHostModule),
      },
      {
        path: 'participant-vclass',
        loadChildren: () => import('./vclass-participant/vclass-participant.module').then(m => m.VClassParticipantModule),
      },      
      {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
         //canActivate: [AuthGuard]
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'batch',
        loadChildren: () => import('./batch/batch.module').then(m => m.BatchModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'project-batch',
        loadChildren: () => import('./project-batch/project-batch.module').then(m => m.ProjectBatchModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'project-batch-host',
        loadChildren: () => import('./project-batch-host/project-batch-host.module').then(m => m.ProjectBatchHostModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'project-batch-host-participant',
        loadChildren: () => import('./project-batch-host-participant/project-batch-host-participant.module').then(m => m.ProjectBatchHostParticipantModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'vclass-history-host',
        loadChildren: () => import('./vclass-history-host/vclass-history-host.module').then(m => m.VclassHistoryHostModule),
        // canActivate: [AuthGuard]
      },
      {
        path: 'vclass-history-detail-host/:vclassId',
        loadChildren: () => import('./vclass-history-detail-host/vclass-history-detail-host.module').then(m => m.VclassHistoryDetailHostModule),
        // canActivate: [AuthGuard]
      },
      
    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
