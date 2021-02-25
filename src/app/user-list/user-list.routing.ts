import { Routes } from '@angular/router';

import { UserListComponent } from './user-list.component';

export const UserListRoutes: Routes = [{
  path: '',
  component: UserListComponent,
  data: {
    breadcrumb: 'User List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
