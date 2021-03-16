import { Routes } from '@angular/router';

import { EnrollStudentComponent } from './enroll-student.component';

export const EnrollStudentRoutes: Routes = [{
  path: '',
  component: EnrollStudentComponent,
  data: {
    breadcrumb: 'Virtual Class',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
