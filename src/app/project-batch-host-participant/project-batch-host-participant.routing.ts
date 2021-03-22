import { Routes } from '@angular/router';

import { ProjectBatchHostParticipantComponent } from './project-batch-host-participant.component';

export const ProjectBatchHostParticipantRoutes: Routes = [{
  path: '',
  component: ProjectBatchHostParticipantComponent,
  data: {
    breadcrumb: 'Merge Project Batch Host Participant',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
