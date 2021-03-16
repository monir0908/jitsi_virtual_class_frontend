import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { EnrollStudentComponent } from './enroll-student.component';
import { EnrollStudentRoutes } from './enroll-student.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(EnrollStudentRoutes),
      SharedModule
  ],
  declarations: [EnrollStudentComponent]
})

export class EnrollStudentModule {}
