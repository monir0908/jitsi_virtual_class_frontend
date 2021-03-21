import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { VClassHostComponent } from './vclass-host.component';
import { VClassHostRoutes } from './vclass-host.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(VClassHostRoutes),
      SharedModule
  ],
  declarations: [VClassHostComponent]
})

export class VClassHostModule {}
