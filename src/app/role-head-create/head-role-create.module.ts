import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeadRoleCreateComponent } from './head-role-create.component';
import { HeadRoleCreateRoutes } from './head-role-create.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HeadRoleCreateRoutes),
      SharedModule
  ],
  declarations: [HeadRoleCreateComponent]
})

export class HeadRoleCreateModule {}
