import { Routes } from '@angular/router';

import { VclassHistoryHostComponent } from './vclass-history-host.component';

export const VclassHistoryHostRoutes: Routes = [{
  path: '',
  component: VclassHistoryHostComponent,
  data: {
    breadcrumb: 'Virtual Class History | Teacher',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
