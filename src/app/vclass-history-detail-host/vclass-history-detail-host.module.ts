import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VclassHistoryDetailHostComponent } from './vclass-history-detail-host.component';
import { VclassHistoryDetailHostRoutes } from './vclass-history-detail-host.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VclassHistoryDetailHostRoutes),
      SharedModule
  ],
  declarations: [VclassHistoryDetailHostComponent]
})

export class VclassHistoryDetailHostModule {}
