import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectBatchHostParticipantComponent } from './project-batch-host-participant.component';
import { ProjectBatchHostParticipantRoutes } from './project-batch-host-participant.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProjectBatchHostParticipantRoutes),
      SharedModule
  ],
  declarations: [ProjectBatchHostParticipantComponent]
})

export class ProjectBatchHostParticipantModule {}
