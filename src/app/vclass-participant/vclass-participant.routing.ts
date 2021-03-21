import { Routes } from '@angular/router';

import { VClassParticipantComponent } from './vclass-participant.component';

export const VClassParticipantRoutes: Routes = [{
  path: '',
  component: VClassParticipantComponent,
  data: {
    breadcrumb: 'Virtual Class | Student',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
