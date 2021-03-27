import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HeadRoleListComponent } from './head-role-list.component';
import { HeadRoleListRoutes } from './head-role-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HeadRoleListRoutes),
      SharedModule
  ],
  declarations: [HeadRoleListComponent]
})

export class HeadRoleListModule {}
