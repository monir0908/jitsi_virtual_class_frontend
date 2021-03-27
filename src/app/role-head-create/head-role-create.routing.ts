import { Routes } from '@angular/router';

import { HeadRoleCreateComponent } from './head-role-create.component';

export const HeadRoleCreateRoutes: Routes = [{
  path: '',
  component: HeadRoleCreateComponent,
  data: {
    breadcrumb: 'Head Role List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
