import { Routes } from '@angular/router';

import { VClassHostComponent } from './vclass-host.component';

export const VClassHostRoutes: Routes = [{
  path: '',
  component: VClassHostComponent,
  data: {
    breadcrumb: 'Virtual Class | Teacher',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
