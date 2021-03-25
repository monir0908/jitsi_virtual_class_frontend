import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserRoleCreateComponent } from './user-role-create.component';
import { UserRoleCreateRoutes } from './user-role-create.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserRoleCreateRoutes),
      SharedModule
  ],
  declarations: [UserRoleCreateComponent]
})

export class UserRoleCreateModule {}
