import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VClassStudentComponent } from './vclass-student.component';
import { VClassStudentRoutes } from './vclass-student.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VClassStudentRoutes),
      SharedModule
  ],
  declarations: [VClassStudentComponent]
})

export class VClassStudentModule {}
