import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RoleCreateComponent } from './role-create.component';
import { RoleCreateRoutes } from './role-create.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(RoleCreateRoutes),
      SharedModule
  ],
  declarations: [RoleCreateComponent]
})

export class RoleCreateModule {}
