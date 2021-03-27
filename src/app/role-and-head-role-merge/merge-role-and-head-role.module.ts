import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RoleAndHeadRoleMergeComponent } from './merge-role-and-head-role.component';
import { RoleAndHeadRoleMergeRoutes } from './merge-role-and-head-role.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RoleAndHeadRoleMergeRoutes),
      SharedModule
  ],
  declarations: [RoleAndHeadRoleMergeComponent]
})

export class RoleAndHeadRoleMergeModule {}
