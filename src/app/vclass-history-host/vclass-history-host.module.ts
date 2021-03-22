import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VclassHistoryHostComponent } from './vclass-history-host.component';
import { VclassHistoryHostRoutes } from './vclass-history-host.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VclassHistoryHostRoutes),
      SharedModule
  ],
  declarations: [VclassHistoryHostComponent]
})

export class VclassHistoryHostModule {}
