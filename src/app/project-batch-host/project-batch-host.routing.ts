import { Routes } from '@angular/router';

import { ProjectBatchHostComponent } from './project-batch-host.component';

export const ProjectBatchHostRoutes: Routes = [{
  path: '',
  component: ProjectBatchHostComponent,
  data: {
    breadcrumb: 'Merge Project Batch Host',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
