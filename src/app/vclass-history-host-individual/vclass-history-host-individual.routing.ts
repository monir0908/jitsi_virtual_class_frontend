import { Routes } from '@angular/router';

import { VclassHistoryHostIndividualComponent } from './vclass-history-host-individual.component';

export const VclassHistoryHostIndividualRoutes: Routes = [{
  path: '',
  component: VclassHistoryHostIndividualComponent,
  data: {
    breadcrumb: 'Your Virtual Class History',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
