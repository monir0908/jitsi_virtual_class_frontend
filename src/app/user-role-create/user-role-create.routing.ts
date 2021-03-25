import { Routes } from '@angular/router';

import { UserRoleCreateComponent } from './user-role-create.component';

export const UserRoleCreateRoutes: Routes = [{
  path: '',
  component: UserRoleCreateComponent,
  data: {
    breadcrumb: 'Create User Role',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
