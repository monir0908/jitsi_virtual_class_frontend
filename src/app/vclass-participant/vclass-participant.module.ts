import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VClassParticipantComponent } from './vclass-participant.component';
import { VClassParticipantRoutes } from './vclass-participant.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VClassParticipantRoutes),
      SharedModule
  ],
  declarations: [VClassParticipantComponent]
})

export class VClassParticipantModule {}
