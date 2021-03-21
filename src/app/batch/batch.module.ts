import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { BatchComponent } from './batch.component';
import { BatchRoutes } from './batch.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(BatchRoutes),
      SharedModule
  ],
  declarations: [BatchComponent]
})

export class BatchModule {}
