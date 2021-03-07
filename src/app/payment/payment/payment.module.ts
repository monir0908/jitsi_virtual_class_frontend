import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PaymentComponent } from './payment.component';
import { PaymentRoutes } from './payment.routing';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(PaymentRoutes),
      SharedModule
  ],
  declarations: [PaymentComponent] 
})

export class PaymentModule {}
