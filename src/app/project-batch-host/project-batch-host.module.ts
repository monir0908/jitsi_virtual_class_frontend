import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectBatchHostComponent } from './project-batch-host.component';
import { ProjectBatchHostRoutes } from './project-batch-host.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProjectBatchHostRoutes),
      SharedModule
  ],
  declarations: [ProjectBatchHostComponent]
})

export class ProjectBatchHostModule {}
