import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SignalRComponent } from './signalr.component';
import { SignalrRoutes } from './signalr.routing';
import {SharedModule} from '../shared/shared.module';
import { HighchartsChartModule } from 'highcharts-angular';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SignalrRoutes),
      SharedModule,
      HighchartsChartModule
  ],
  declarations: [SignalRComponent]
})

export class SignalrModule {}
