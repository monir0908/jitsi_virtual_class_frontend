import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserRoleListComponent } from './user-role-list.component';
import { UserRoleListRoutes } from './user-role-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserRoleListRoutes),
      SharedModule
  ],
  declarations: [UserRoleListComponent]
})

export class UserRoleListModule {}
