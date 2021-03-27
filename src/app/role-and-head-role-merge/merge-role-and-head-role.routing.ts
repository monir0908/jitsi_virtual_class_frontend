import { Routes } from '@angular/router';

import { RoleAndHeadRoleMergeComponent } from './merge-role-and-head-role.component';

export const RoleAndHeadRoleMergeRoutes: Routes = [{
  path: '',
  component: RoleAndHeadRoleMergeComponent,
  data: {
    breadcrumb: 'Mearge Role And Head Role',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
