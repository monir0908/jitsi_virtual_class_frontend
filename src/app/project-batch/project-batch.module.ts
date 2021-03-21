import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectBatchComponent } from './project-batch.component';
import { ProjectBatchRoutes } from './project-batch.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProjectBatchRoutes),
      SharedModule
  ],
  declarations: [ProjectBatchComponent]
})

export class ProjectBatchModule {}
