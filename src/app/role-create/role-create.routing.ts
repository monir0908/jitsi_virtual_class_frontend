import { Routes } from '@angular/router';

import { RoleCreateComponent } from './role-create.component';

export const RoleCreateRoutes: Routes = [{
  path: '',
  component: RoleCreateComponent,
  data: {
    breadcrumb: 'Role Create',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
