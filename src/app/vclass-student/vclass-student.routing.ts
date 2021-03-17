import { Routes } from '@angular/router';

import { VClassStudentComponent } from './vclass-student.component';

export const VClassStudentRoutes: Routes = [{
  path: '',
  component: VClassStudentComponent,
  data: {
    breadcrumb: 'Virtual Class',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
