import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserListComponent } from './user-list.component';
import { UserListRoutes } from './user-list.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserListRoutes),
      SharedModule
  ],
  declarations: [UserListComponent]
})

export class UserListModule {}
