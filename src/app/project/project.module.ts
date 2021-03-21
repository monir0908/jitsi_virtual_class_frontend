import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProjectComponent } from './project.component';
import { ProjectRoutes } from './project.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(ProjectRoutes),
      SharedModule
  ],
  declarations: [ProjectComponent]
})

export class ProjectModule {}
