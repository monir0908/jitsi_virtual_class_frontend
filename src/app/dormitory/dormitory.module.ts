import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { DormitoryComponent } from './dormitory.component';
import { DormitoryRoutes } from './dormitory.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(DormitoryRoutes),
      SharedModule
  ],
  declarations: [DormitoryComponent]
})

export class DormitoryModule {}
