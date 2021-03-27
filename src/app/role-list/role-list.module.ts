import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RoleListComponent } from './role-list.component';
import { RoleListRoutes } from './role-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RoleListRoutes),
      SharedModule
  ],
  declarations: [RoleListComponent]
})

export class RoleListModule {}
