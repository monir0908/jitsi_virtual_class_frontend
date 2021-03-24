import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserComponent } from './user.component';
import { UserRoutes } from './user.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserRoutes),
      SharedModule
  ],
  declarations: [UserComponent]
})

export class UserModule {}
