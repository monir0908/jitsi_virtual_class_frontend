import { Routes } from '@angular/router';

import { HeadRoleListComponent } from './head-role-list.component';

export const HeadRoleListRoutes: Routes = [{
  path: '',
  component: HeadRoleListComponent,
  data: {
    breadcrumb: 'Head Role List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
