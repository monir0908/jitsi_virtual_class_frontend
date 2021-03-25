import { Routes } from '@angular/router';

import { UserRoleListComponent } from './user-role-list.component';

export const UserRoleListRoutes: Routes = [{
  path: '',
  component: UserRoleListComponent,
  data: {
    breadcrumb: 'User Role List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
