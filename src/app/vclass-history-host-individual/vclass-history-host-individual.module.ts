import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VclassHistoryHostIndividualComponent } from './vclass-history-host-individual.component';
import { VclassHistoryHostIndividualRoutes } from './vclass-history-host-individual.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VclassHistoryHostIndividualRoutes),
      SharedModule
  ],
  declarations: [VclassHistoryHostIndividualComponent]
})

export class VclassHistoryHostIndividualModule {}
