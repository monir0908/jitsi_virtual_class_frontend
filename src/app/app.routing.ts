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
        canActivate: [AuthGuard],
        // data: {auth: 'Host'}
      },
      {
        path: 'participant-vclass',
        loadChildren: () => import('./vclass-participant/vclass-participant.module').then(m => m.VClassParticipantModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Participant'}
      },      
      {
        path: 'dashboard',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Admin,Superuser,Host'}
      },
      {
        path: 'user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'user-create',
        loadChildren: () => import('./user-create/user-create.module').then(m => m.UserCreateModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },      
      {
        path: 'user-role-create',
        loadChildren: () => import('./user-role-create/user-role-create.module').then(m => m.UserRoleCreateModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'head-role-create',
        loadChildren: () => import('./role-head-create/head-role-create.module').then(m => m.HeadRoleCreateModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'role-create',
        loadChildren: () => import('./role-create/role-create.module').then(m => m.RoleCreateModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'merge-role-and-head-role',
        loadChildren: () => import('./role-and-head-role-merge/merge-role-and-head-role.module').then(m => m.RoleAndHeadRoleMergeModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'batch',
        loadChildren: () => import('./batch/batch.module').then(m => m.BatchModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'project-batch',
        loadChildren: () => import('./project-batch/project-batch.module').then(m => m.ProjectBatchModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'project-batch-host',
        loadChildren: () => import('./project-batch-host/project-batch-host.module').then(m => m.ProjectBatchHostModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Superuser'}
      },
      {
        path: 'project-batch-host-participant',
        loadChildren: () => import('./project-batch-host-participant/project-batch-host-participant.module').then(m => m.ProjectBatchHostParticipantModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Admin,Superuser'}
      },
      {
        path: 'vclass-history-host',
        loadChildren: () => import('./vclass-history-host/vclass-history-host.module').then(m => m.VclassHistoryHostModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Admin,Superuser'}
      },
      {
        path: 'vclass-history-detail-host/:vclassId',
        loadChildren: () => import('./vclass-history-detail-host/vclass-history-detail-host.module').then(m => m.VclassHistoryDetailHostModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Admin,Superuser'}
      },
      {
        path: 'vclass-history-host-individual',
        loadChildren: () => import('./vclass-history-host-individual/vclass-history-host-individual.module').then(m => m.VclassHistoryHostIndividualModule),
        canActivate: [AuthGuard],
        // data: {auth: 'Host'}
      },
      
    ]
  }, {
    path: '**',
    redirectTo: '/'
  }
];
