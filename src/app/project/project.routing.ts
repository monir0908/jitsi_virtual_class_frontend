import { Routes } from '@angular/router';

import { ProjectComponent } from './project.component';

export const ProjectRoutes: Routes = [{
  path: '',
  component: ProjectComponent,
  data: {
    breadcrumb: 'Project | Organization',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
