import { Routes } from '@angular/router';

import { BatchComponent } from './batch.component';

export const BatchRoutes: Routes = [{
  path: '',
  component: BatchComponent,
  data: {
    breadcrumb: 'Batch',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
