import { Routes } from '@angular/router';

import { RoleListComponent } from './role-list.component';

export const RoleListRoutes: Routes = [{
  path: '',
  component: RoleListComponent,
  data: {
    breadcrumb: 'Role List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
