import { Routes } from '@angular/router';

import { DormitoryComponent } from './dormitory.component';

export const DormitoryRoutes: Routes = [{
  path: '',
  component: DormitoryComponent,
  data: {
    breadcrumb: 'Dormitory',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
