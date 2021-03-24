import { Routes } from '@angular/router';

import { UserCreateComponent } from './user-create.component';

export const UserCreateRoutes: Routes = [{
  path: '',
  component: UserCreateComponent,
  data: {
    breadcrumb: 'UserCreate List | Create UserCreate',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
