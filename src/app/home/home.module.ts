import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutes } from './home.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(HomeRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [HomeComponent]
})

export class HomeModule {}
