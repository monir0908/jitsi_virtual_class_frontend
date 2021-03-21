import { Routes } from '@angular/router';

import { ProjectBatchComponent } from './project-batch.component';

export const ProjectBatchRoutes: Routes = [{
  path: '',
  component: ProjectBatchComponent,
  data: {
    breadcrumb: 'Merge Project & Batch',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
