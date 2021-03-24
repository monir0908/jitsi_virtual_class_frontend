import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserCreateComponent } from './user-create.component';
import { UserCreateRoutes } from './user-create.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserCreateRoutes),
      SharedModule
  ],
  declarations: [UserCreateComponent]
})

export class UserCreateModule {}
