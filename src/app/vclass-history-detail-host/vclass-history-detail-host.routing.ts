import { Routes } from '@angular/router';

import { VclassHistoryDetailHostComponent } from './vclass-history-detail-host.component';

export const VclassHistoryDetailHostRoutes: Routes = [{
  path: '',
  component: VclassHistoryDetailHostComponent,
  data: {
    breadcrumb: 'Virtual Class History Detail',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
